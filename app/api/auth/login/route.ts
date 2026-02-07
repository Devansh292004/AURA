import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  const db = getDb();
  const user = db.users.find(u => u.email === email);

  if (!user || user.password !== password) {
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
  }

  // Don't return password in response
  const { password: _, ...userWithoutPassword } = user;
  return NextResponse.json(userWithoutPassword);
}
