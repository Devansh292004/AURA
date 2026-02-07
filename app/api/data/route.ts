import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  const db = getDb();

  const userPlatforms = db.platforms.filter(p => p.userId === userId);
  const userActivities = db.activity.filter(a => a.userId === userId);
  const userAnalytics = db.analytics.filter(a => a.userId === userId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return NextResponse.json({
    platforms: userPlatforms,
    activities: userActivities,
    latestAnalytics: userAnalytics[0] || null,
    history: userAnalytics
  });
}
