import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  let userId = searchParams.get('userId');
  const username = searchParams.get('username');

  const db = getDb();

  if (!userId && username) {
    const user = db.users.find(u => u.email.split('@')[0] === username);
    if (user) userId = user.id;
  }

  if (!userId) {
    return NextResponse.json({ error: 'User ID or Username is required' }, { status: 400 });
  }

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
