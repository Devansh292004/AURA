import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'db.json');

export interface User {
  id: string;
  email: string;
  name?: string;
  password?: string;
  createdAt: string;
}

export interface Platform {
  id: string;
  userId: string;
  platformName: 'github' | 'leetcode' | 'codechef' | 'hackerrank';
  username: string;
  profileUrl: string;
  lastSync: string;
  stats?: any;
}

export interface Activity {
  id: string;
  platformId: string;
  userId: string;
  date: string; // ISO date string (YYYY-MM-DD)
  activityValue: number;
}

export interface Analytics {
  id: string;
  userId: string;
  date: string;
  streak: number;
  consistencyScore: number;
}

interface Database {
  users: User[];
  platforms: Platform[];
  activity: Activity[];
  analytics: Analytics[];
}

const initialDb: Database = {
  users: [],
  platforms: [],
  activity: [],
  analytics: [],
};

export function getDb(): Database {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify(initialDb, null, 2));
    return initialDb;
  }

  try {
    const data = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (e) {
    return initialDb;
  }
}

export function saveDb(db: Database) {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}
