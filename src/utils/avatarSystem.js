import { wasCompletedLate } from './helper';

const LEVELS = [
  { level: 1, name: 'Bayi Tugas', minPoints: 0, emoji: '🌱', color: '#9ca3af' },
  { level: 2, name: 'Pemula Rajin', minPoints: 50, emoji: '🌿', color: '#22c55e' },
  { level: 3, name: 'Pejuang Deadline', minPoints: 150, emoji: '🎯', color: '#3b82f6' },
  { level: 4, name: 'Tepat Waktu', minPoints: 300, emoji: '⚡', color: '#a855f7' },
  { level: 5, name: 'Master Produktif', minPoints: 500, emoji: '👑', color: '#f59e0b' },
];

const POINTS = {
  ON_TIME: 10,
  LATE: -5,
  DAILY_BONUS: 3,
  STREAK_BONUS: 20,
};

function calculateScore(tasks) {
  let score = 0;

  tasks.forEach((task) => {
    if (task.completed && task.completedAt && task.deadline) {
      if (wasCompletedLate(task)) {
        score += POINTS.LATE;
      } else {
        score += POINTS.ON_TIME;
      }
    }
  });

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
  const todayTasks = tasks.filter((t) => {
    if (!t.deadline) return false;
    const d = new Date(t.deadline);
    const dStr = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    return dStr === todayStr;
  });
  const todayAllCompleted = todayTasks.length > 0 && todayTasks.every((t) => t.completed);
  if (todayAllCompleted) {
    score += POINTS.DAILY_BONUS;
  }

  let streak = 0;
  for (let i = 1; i <= 30; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dStr = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    const dayTasks = tasks.filter((t) => {
      if (!t.deadline) return false;
      const td = new Date(t.deadline);
      const tdStr = `${td.getFullYear()}-${td.getMonth()}-${td.getDate()}`;
      return tdStr === dStr;
    });
    if (dayTasks.length === 0) continue;
    const allDone = dayTasks.every((t) => t.completed);
    if (allDone) {
      streak++;
    } else {
      break;
    }
  }
  if (streak >= 7) {
    score += POINTS.STREAK_BONUS;
  }

  return Math.max(0, score);
}

function getLevel(score) {
  let current = LEVELS[0];
  for (const level of LEVELS) {
    if (score >= level.minPoints) {
      current = level;
    }
  }
  return current;
}

function getNextLevel(score) {
  const current = getLevel(score);
  const nextIndex = LEVELS.findIndex((l) => l.level === current.level + 1);
  return nextIndex >= 0 ? LEVELS[nextIndex] : null;
}

function getProgress(score) {
  const current = getLevel(score);
  const next = getNextLevel(score);
  if (!next) return 100;
  const range = next.minPoints - current.minPoints;
  const progress = score - current.minPoints;
  return Math.min(100, Math.round((progress / range) * 100));
}

function getAvatarStats(tasks) {
  const score = calculateScore(tasks);
  const level = getLevel(score);
  const nextLevel = getNextLevel(score);
  const progress = getProgress(score);
  const onTimeCount = tasks.filter((t) => t.completed && !wasCompletedLate(t)).length;
  const lateCount = tasks.filter((t) => wasCompletedLate(t)).length;

  return { score, level, nextLevel, progress, onTimeCount, lateCount };
}

export { LEVELS, getAvatarStats, calculateScore, getLevel, getNextLevel, getProgress };
