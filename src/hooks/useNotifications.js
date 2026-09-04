import { useEffect, useRef, useCallback } from 'react';
import { useTaskContext } from '../context/TaskContext';

const STORAGE_KEY = 'todoo_notif_settings';

const SOUND_PRESETS = {
  beep: (ctx) => {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.connect(g);
    g.connect(ctx.destination);
    o.type = 'sine';
    o.frequency.setValueAtTime(880, ctx.currentTime);
    o.frequency.setValueAtTime(1100, ctx.currentTime + 0.1);
    o.frequency.setValueAtTime(880, ctx.currentTime + 0.2);
    g.gain.setValueAtTime(0.3, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
    o.start(ctx.currentTime);
    o.stop(ctx.currentTime + 0.5);
  },
  chime: (ctx) => {
    const notes = [523, 659, 784];
    notes.forEach((freq, i) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.connect(g);
      g.connect(ctx.destination);
      o.type = 'sine';
      o.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.15);
      g.gain.setValueAtTime(0, ctx.currentTime + i * 0.15);
      g.gain.linearRampToValueAtTime(0.25, ctx.currentTime + i * 0.15 + 0.05);
      g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.15 + 0.4);
      o.start(ctx.currentTime + i * 0.15);
      o.stop(ctx.currentTime + i * 0.15 + 0.4);
    });
  },
  ding: (ctx) => {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.connect(g);
    g.connect(ctx.destination);
    o.type = 'sine';
    o.frequency.setValueAtTime(990, ctx.currentTime);
    g.gain.setValueAtTime(0.3, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.2);
    o.start(ctx.currentTime);
    o.stop(ctx.currentTime + 1.2);
  },
  bell: (ctx) => {
    const notes = [659, 784, 988, 1319];
    notes.forEach((freq, i) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.connect(g);
      g.connect(ctx.destination);
      o.type = 'sine';
      o.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.12);
      g.gain.setValueAtTime(0, ctx.currentTime + i * 0.12);
      g.gain.linearRampToValueAtTime(0.2, ctx.currentTime + i * 0.12 + 0.03);
      g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.12 + 0.6);
      o.start(ctx.currentTime + i * 0.12);
      o.stop(ctx.currentTime + i * 0.12 + 0.6);
    });
  },
};

export function playSound(soundType) {
  if (!soundType || soundType === 'none') return;
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const play = SOUND_PRESETS[soundType];
    if (play) play(ctx);
  } catch {}
}

export function getSettings() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return { enabled: true, reminderHours: 24, sound: true, soundType: 'beep' };
}

export function saveSettings(settings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

export default function useNotifications() {
  const { tasks, notifSettings } = useTaskContext();
  const notifiedRef = useRef(new Set());

  const checkDeadlines = useCallback(() => {
    if (!notifSettings.enabled) return;
    if (!('Notification' in window) || Notification.permission !== 'granted') return;

    const now = new Date();
    tasks.forEach((task) => {
      if (task.completed || notifiedRef.current.has(task.id)) return;
      if (!task.deadline) return;

      const deadline = new Date(task.deadline);
      const diffMs = deadline.getTime() - now.getTime();
      const diffHours = diffMs / (1000 * 60 * 60);

      if (diffHours > 0 && diffHours <= notifSettings.reminderHours) {
        const body = diffHours <= 1
          ? `"${task.title}" deadline dalam kurang dari 1 jam!`
          : `"${task.title}" deadline dalam ${Math.ceil(diffHours)} jam lagi!`;

        const notifOptions = {
          body,
          icon: '/favicon-32x32.png',
        };

        if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
          navigator.serviceWorker.ready.then((reg) => {
            reg.showNotification('ToDoo - Deadline Mendekat!', notifOptions);
          }).catch(() => {});
        } else if ('Notification' in window && Notification.permission === 'granted') {
          try {
            new Notification('ToDoo - Deadline Mendekat!', notifOptions);
          } catch {}
        }

        if (notifSettings.sound) {
          playSound(notifSettings.soundType);
        }

        notifiedRef.current.add(task.id);
      }
    });
  }, [tasks, notifSettings]);

  useEffect(() => {
    if (!('Notification' in window)) return;

    const interval = setInterval(checkDeadlines, 60000);
    checkDeadlines();

    return () => clearInterval(interval);
  }, [checkDeadlines]);

  useEffect(() => {
    notifiedRef.current.clear();
  }, [tasks]);
}
