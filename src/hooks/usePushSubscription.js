import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY || '';

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i++) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export default function usePushSubscription() {
  const { user } = useAuth();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !('serviceWorker' in navigator) || !('PushManager' in window)) {
      setLoading(false);
      return;
    }

    const checkSubscription = async () => {
      try {
        const reg = await navigator.serviceWorker.ready;
        const subscription = await reg.pushManager.getSubscription();
        setIsSubscribed(!!subscription);
      } catch {
        setIsSubscribed(false);
      } finally {
        setLoading(false);
      }
    };

    checkSubscription();
  }, [user]);

  const subscribe = useCallback(async () => {
    if (!user || !VAPID_PUBLIC_KEY) return false;

    try {
      const reg = await navigator.serviceWorker.ready;
      const subscription = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      });

      const { endpoint } = subscription;
      const keys = subscription.toJSON().keys;

      const { error } = await supabase.from('push_subscriptions').upsert(
        {
          user_id: user.id,
          endpoint,
          p256dh: keys.p256dh,
          auth: keys.auth,
        },
        { onConflict: 'user_id,endpoint' }
      );

      if (error) throw error;

      setIsSubscribed(true);
      return true;
    } catch (err) {
      console.error('Gagal subscribe push:', err);
      return false;
    }
  }, [user]);

  const unsubscribe = useCallback(async () => {
    if (!user) return false;

    try {
      const reg = await navigator.serviceWorker.ready;
      const subscription = await reg.pushManager.getSubscription();

      if (subscription) {
        await subscription.unsubscribe();
      }

      await supabase
        .from('push_subscriptions')
        .delete()
        .eq('user_id', user.id);

      setIsSubscribed(false);
      return true;
    } catch (err) {
      console.error('Gagal unsubscribe push:', err);
      return false;
    }
  }, [user]);

  return { isSubscribed, loading, subscribe, unsubscribe };
}
