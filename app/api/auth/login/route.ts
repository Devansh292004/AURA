import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  const db = getDb();
  const user = db.users.find(u => u.email === email);

  if (!user) {
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
  }

  // Don't return password in response
  const { password: _, ...userWithoutPassword } = user;
  return NextResponse.json(userWithoutPassword);
}
