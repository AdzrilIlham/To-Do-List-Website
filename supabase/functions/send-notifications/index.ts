import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import webpush from "npm:web-push@3.6.7";

const VAPID_PUBLIC_KEY = Deno.env.get("VAPID_PUBLIC_KEY") || "";
const VAPID_PRIVATE_KEY = Deno.env.get("VAPID_PRIVATE_KEY") || "";
const VAPID_EMAIL = Deno.env.get("VAPID_EMAIL") || "mailto:admin@todoo.app";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const APP_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || Deno.env.get("APP_SERVICE_ROLE_KEY") || "";

async function sendPushNotification(subscriptionInfo: Record<string, unknown>, title: string, body: string): Promise<{ success: boolean; error?: string }> {
  const payload = JSON.stringify({ title, body, icon: "/favicon-32x32.png", badge: "/favicon-16x16.png" });

  try {
    webpush.setVapidDetails(VAPID_EMAIL, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
    await webpush.sendNotification(subscriptionInfo as webpush.PushSubscription, payload);
    return { success: true };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error("Error sending push notification:", errorMsg);
    return { success: false, error: errorMsg };
  }
}

serve(async (_req) => {
  try {
    const supabase = createClient(SUPABASE_URL, APP_SERVICE_ROLE_KEY);

    const now = new Date();
    const hours24Later = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const { data: tasks, error: tasksError } = await supabase
      .from("tasks")
      .select("id, user_id, title, deadline")
      .eq("completed", false)
      .not("deadline", "is", null)
      .gte("deadline", now.toISOString())
      .lte("deadline", hours24Later.toISOString());

    if (tasksError || !tasks || tasks.length === 0) {
      return new Response(JSON.stringify({ message: "No tasks to notify", count: 0, debug: { tasksError, vapidPublicKeySet: !!VAPID_PUBLIC_KEY } }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    const { data: alreadySent } = await supabase
      .from("notifications_log")
      .select("task_id");

    const sentTaskIds = new Set((alreadySent || []).map((l) => l.task_id));

    const tasksToNotify = tasks.filter((t) => !sentTaskIds.has(t.id));

    if (tasksToNotify.length === 0) {
      return new Response(JSON.stringify({ message: "All already notified", count: 0, totalTasks: tasks.length }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    const userIds = [...new Set(tasksToNotify.map((t) => t.user_id))];

    const { data: subscriptions } = await supabase
      .from("push_subscriptions")
      .select("user_id, endpoint, p256dh, auth")
      .in("user_id", userIds);

    if (!subscriptions || subscriptions.length === 0) {
      return new Response(JSON.stringify({ message: "No subscriptions", count: 0, tasksFound: tasksToNotify.length }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    const subsByUser = new Map<string, Array<Record<string, unknown>>>();
    for (const sub of subscriptions) {
      const existing = subsByUser.get(sub.user_id) || [];
      existing.push({ endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } });
      subsByUser.set(sub.user_id, existing);
    }

    let sentCount = 0;
    const errorsList: string[] = [];
    const logsToInsert: Array<{ task_id: string; user_id: string }> = [];

    for (const task of tasksToNotify) {
      const subs = subsByUser.get(task.user_id) || [];
      if (subs.length === 0) continue;

      const deadline = new Date(task.deadline);
      const diffHours = (deadline.getTime() - now.getTime()) / (1000 * 60 * 60);
      const body = diffHours <= 1
        ? `"${task.title}" deadline dalam kurang dari 1 jam!`
        : `"${task.title}" deadline dalam ${Math.ceil(diffHours)} jam lagi!`;

      let taskSentSuccessfully = false;

      for (const sub of subs) {
        const result = await sendPushNotification(sub, "ToDoo - Deadline Mendekat!", body);
        if (result.success) {
          sentCount++;
          taskSentSuccessfully = true;
        } else if (result.error) {
          errorsList.push(result.error);
        }
      }

      if (taskSentSuccessfully) {
        logsToInsert.push({ task_id: task.id, user_id: task.user_id });
      }
    }

    if (logsToInsert.length > 0) {
      await supabase.from("notifications_log").insert(logsToInsert);
    }

    return new Response(JSON.stringify({ message: "Done", sent: sentCount, tasks: tasksToNotify.length, errors: errorsList }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
