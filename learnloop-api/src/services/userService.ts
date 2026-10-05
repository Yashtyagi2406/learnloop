import { Database } from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../types/index.js';
import { HttpError } from '../middleware/errorHandler.js';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret_jwt_key_learnloop_2026';

export function findUserByEmail(db: Database, email: string): (User & { password_hash: string | null }) | null {
  const row = db.prepare(`
    SELECT id, email, password_hash, created_at
    FROM users
    WHERE LOWER(email) = LOWER(?)
  `).get(email) as (User & { password_hash: string | null }) | undefined;

  return row || null;
}

export function findUserById(db: Database, id: string): User | null {
  const row = db.prepare(`
    SELECT id, email, created_at
    FROM users
    WHERE id = ?
  `).get(id) as User | undefined;

  return row || null;
}

export async function registerUser(
  db: Database,
  email: string,
  password: string
): Promise<{ token: string; user: { id: string; email: string } }> {
  const existing = findUserByEmail(db, email);
  if (existing) {
    throw new HttpError(400, 'Email already in use');
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);
  const userId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  const now = Date.now();

  db.prepare(`
    INSERT INTO users (id, email, password_hash, created_at)
    VALUES (?, ?, ?, ?)
  `).run(userId, email.toLowerCase(), passwordHash, now);

  const token = jwt.sign({ userId, email: email.toLowerCase() }, JWT_SECRET, {
    expiresIn: '7d',
  });

  return {
    token,
    user: { id: userId, email: email.toLowerCase() },
  };
}

export async function loginUser(
  db: Database,
  email: string,
  password: string
): Promise<{ token: string; user: { id: string; email: string } }> {
  const user = findUserByEmail(db, email);
  if (!user || !user.password_hash) {
    throw new HttpError(401, 'Invalid email or password');
  }

  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    throw new HttpError(401, 'Invalid email or password');
  }

  const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: '7d',
  });

  return {
    token,
    user: { id: user.id, email: user.email },
  };
}
