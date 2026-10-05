import { Database } from 'better-sqlite3';
import { QuizResult } from '../types/index.js';

export function getResults(db: Database, userId: string): QuizResult[] {
  const rows = db.prepare(`
    SELECT id, course_id AS courseId, score, total, at
    FROM results
    WHERE user_id = ?
    ORDER BY at DESC, id DESC
  `).all(userId) as Array<{
    id: number;
    courseId: string;
    score: number;
    total: number;
    at: number;
  }>;

  return rows;
}

export function createResult(
  db: Database,
  userId: string,
  courseId: string,
  score: number,
  total: number
): QuizResult {
  const now = Date.now();
  const info = db.prepare(`
    INSERT INTO results (user_id, course_id, score, total, at)
    VALUES (?, ?, ?, ?, ?)
  `).run(userId, courseId, score, total, now);

  return {
    id: Number(info.lastInsertRowid),
    courseId,
    score,
    total,
    at: now,
  };
}
