import { Database } from 'better-sqlite3';
import { ProgressMap } from '../types/index.js';

export function getProgress(db: Database, userId: string): ProgressMap {
  const rows = db.prepare(`
    SELECT course_id, lesson_id
    FROM progress
    WHERE user_id = ?
    ORDER BY completed_at ASC
  `).all(userId) as Array<{ course_id: string; lesson_id: string }>;

  const result: ProgressMap = {};
  for (const row of rows) {
    if (!result[row.course_id]) {
      result[row.course_id] = [];
    }
    result[row.course_id].push(row.lesson_id);
  }

  return result;
}

export function saveProgress(
  db: Database,
  userId: string,
  progress: ProgressMap
): ProgressMap {
  const transaction = db.transaction(() => {
    // Delete existing progress for this user
    db.prepare('DELETE FROM progress WHERE user_id = ?').run(userId);

    const insertStmt = db.prepare(`
      INSERT INTO progress (user_id, course_id, lesson_id, completed_at)
      VALUES (?, ?, ?, ?)
    `);

    const now = Date.now();
    for (const [courseId, lessons] of Object.entries(progress)) {
      if (Array.isArray(lessons)) {
        // Filter unique lesson IDs to avoid duplicate key errors
        const uniqueLessons = Array.from(new Set(lessons));
        for (const lessonId of uniqueLessons) {
          insertStmt.run(userId, courseId, lessonId, now);
        }
      }
    }
  });

  transaction();
  return getProgress(db, userId);
}
