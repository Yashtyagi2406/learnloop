import { Router, Response, NextFunction } from 'express';
import { Database } from 'better-sqlite3';
import { getResults, createResult } from '../services/resultsService.js';
import { courseExists } from '../services/courseService.js';
import { resultSchema } from '../validation/schemas.js';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { HttpError } from '../middleware/errorHandler.js';
import { DEFAULT_USER_ID } from '../db/schema.js';

export function createResultsRouter(db: Database): Router {
  const router = Router();

  router.get('/', (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.userId || DEFAULT_USER_ID;
      const results = getResults(db, userId);
      res.json(results);
    } catch (err) {
      next(err);
    }
  });

  router.post('/', (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.userId || DEFAULT_USER_ID;
      const parsed = resultSchema.parse(req.body);

      if (!courseExists(db, parsed.courseId)) {
        throw new HttpError(400, `Course '${parsed.courseId}' does not exist.`);
      }

      const result = createResult(
        db,
        userId,
        parsed.courseId,
        parsed.score,
        parsed.total
      );

      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  });

  return router;
}
