import { NextRequest, NextResponse } from 'next/server';
import { getDb, saveDb } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  const { email, name, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
  }

  const db = getDb();
  const existing = db.users.find(u => u.email === email);

  if (existing) {
    return NextResponse.json({ error: 'User already exists' }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = {
    id: Math.random().toString(36).substring(7),
    email,
    name,
    password: hashedPassword,
    createdAt: new Date().toISOString()
  };

  db.users.push(newUser);
  saveDb(db);

  const { password: _, ...userWithoutPassword } = newUser;
  return NextResponse.json(userWithoutPassword);
}
