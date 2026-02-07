import { NextRequest, NextResponse } from 'next/server';
import { getDb, saveDb } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { userId, platformName, username, profileUrl } = await req.json();

    if (!userId || !platformName || !username) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const db = getDb();

    const existing = db.platforms.find(p => p.userId === userId && p.platformName === platformName);
    if (existing) {
      return NextResponse.json({ error: 'Platform already connected' }, { status: 400 });
    }

    const newPlatform = {
      id: Math.random().toString(36).substring(7),
      userId,
      platformName,
      username,
      profileUrl,
      lastSync: new Date().toISOString()
    };

    db.platforms.push(newPlatform);
    saveDb(db);

    return NextResponse.json(newPlatform);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

  const db = getDb();
  db.platforms = db.platforms.filter(p => p.id !== id);
  db.activity = db.activity.filter(a => a.platformId !== id);
  saveDb(db);

  return NextResponse.json({ success: true });
}
