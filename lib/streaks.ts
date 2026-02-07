import { Activity } from './db';
import { startOfDay, subDays, format } from 'date-fns';

export function calculateStreak(activities: Activity[]): number {
  if (activities.length === 0) return 0;

  const activeDays = Array.from(new Set(activities.map(a => a.date)));

  let streak = 0;
  let currentDate = startOfDay(new Date());

  const todayStr = format(currentDate, 'yyyy-MM-dd');
  const hasActivityToday = activeDays.includes(todayStr);

  if (!hasActivityToday) {
    currentDate = subDays(currentDate, 1);
    const yesterdayStr = format(currentDate, 'yyyy-MM-dd');
    if (!activeDays.includes(yesterdayStr)) {
      return 0;
    }
  }

  for (let i = 0; i < 365; i++) {
    const checkDateStr = format(currentDate, 'yyyy-MM-dd');
    if (activeDays.includes(checkDateStr)) {
      streak++;
      currentDate = subDays(currentDate, 1);
    } else {
      break;
    }
  }

  return streak;
}

export function calculateConsistencyScore(activities: Activity[]): number {
  if (activities.length === 0) return 0;

  const thirtyDaysAgo = subDays(new Date(), 30);
  const recentActivities = activities.filter(a => new Date(a.date) >= thirtyDaysAgo);

  const activeDays = new Set(recentActivities.map(a => a.date)).size;

  return Math.round((activeDays / 30) * 100);
}
