import { Router, Response, NextFunction } from 'express';
import { Database } from 'better-sqlite3';
import { getProgress, saveProgress } from '../services/progressService.js';
import { validateProgressCourseAndLessons } from '../services/courseService.js';
import { progressSchema } from '../validation/schemas.js';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { HttpError } from '../middleware/errorHandler.js';
import { DEFAULT_USER_ID } from '../db/schema.js';

export function createProgressRouter(db: Database): Router {
  const router = Router();

  router.get('/', (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.userId || DEFAULT_USER_ID;
      const progress = getProgress(db, userId);
      res.json(progress);
    } catch (err) {
      next(err);
    }
  });

  router.put('/', (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.userId || DEFAULT_USER_ID;
      const parsed = progressSchema.parse(req.body);

      const validation = validateProgressCourseAndLessons(db, parsed);
      if (!validation.valid) {
        throw new HttpError(400, validation.error || 'Invalid course or lesson ID');
      }

      const updated = saveProgress(db, userId, parsed);
      res.json(updated);
    } catch (err) {
      next(err);
    }
  });

  return router;
}
