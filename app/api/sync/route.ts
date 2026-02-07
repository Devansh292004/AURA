import { NextRequest, NextResponse } from 'next/server';
import { getDb, saveDb, Activity } from '@/lib/db';
import { fetchLeetCodeStats } from '@/lib/leetcode';
import { fetchGitHubStats } from '@/lib/github';
import { fetchCodeChefStats, fetchHackerRankStats } from '@/lib/competitions';
import { calculateStreak, calculateConsistencyScore } from '@/lib/streaks';
import { format } from 'date-fns';

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json();
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const db = getDb();
    const userPlatforms = db.platforms.filter(p => p.userId === userId);

    if (userPlatforms.length === 0) {
      return NextResponse.json({ message: 'No platforms connected' }, { status: 200 });
    }

    const now = new Date();
    const todayStr = format(now, 'yyyy-MM-dd');

    for (const platform of userPlatforms) {
      let stats: any = null;

      try {
        if (platform.platformName === 'leetcode') {
          stats = await fetchLeetCodeStats(platform.username);
          if (stats.submissionCalendar) {
            Object.entries(stats.submissionCalendar).forEach(([timestamp, count]) => {
              const dateStr = format(new Date(parseInt(timestamp) * 1000), 'yyyy-MM-dd');
              upsertActivity(db, userId, platform.id, dateStr, count as number);
            });
          }
        } else if (platform.platformName === 'github') {
          stats = await fetchGitHubStats(platform.username);
          if (stats.contributions) {
            stats.contributions.forEach((day: any) => {
              upsertActivity(db, userId, platform.id, day.date, day.count);
            });
          }
        } else if (platform.platformName === 'codechef') {
          stats = await fetchCodeChefStats(platform.username);
          if (!stats) stats = { rating: 0, globalRank: 0, countryRank: 0 };
        } else if (platform.platformName === 'hackerrank') {
          stats = await fetchHackerRankStats(platform.username);
          if (!stats) stats = { badges: 0, skills: 0, solved: 0 };
        }

        // Update platform sync time and stats
        const platformIdx = db.platforms.findIndex(p => p.id === platform.id);
        if (platformIdx !== -1) {
          db.platforms[platformIdx].lastSync = now.toISOString();
          db.platforms[platformIdx].stats = stats;
        }
      } catch (e) {
        console.error(`Failed to sync ${platform.platformName}:`, e);
      }
    }

    // Update Analytics
    const userActivities = db.activity.filter(a => a.userId === userId);
    const currentStreak = calculateStreak(userActivities);
    const consistencyScore = calculateConsistencyScore(userActivities);

    const analyticsIdx = db.analytics.findIndex(a => a.userId === userId && a.date === todayStr);
    if (analyticsIdx !== -1) {
      db.analytics[analyticsIdx].streak = currentStreak;
      db.analytics[analyticsIdx].consistencyScore = consistencyScore;
    } else {
      db.analytics.push({
        id: Math.random().toString(36).substring(7),
        userId,
        date: todayStr,
        streak: currentStreak,
        consistencyScore
      });
    }

    saveDb(db);

    return NextResponse.json({
      success: true,
      streak: currentStreak,
      consistencyScore
    });

  } catch (error: any) {
    console.error('Sync error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

function upsertActivity(db: any, userId: string, platformId: string, date: string, value: number) {
  const existingIdx = db.activity.findIndex((a: Activity) =>
    a.userId === userId && a.platformId === platformId && a.date === date
  );

  if (existingIdx !== -1) {
    db.activity[existingIdx].activityValue = value;
  } else if (value > 0) {
    db.activity.push({
      id: Math.random().toString(36).substring(7),
      userId,
      platformId,
      date,
      activityValue: value
    });
  }
}
