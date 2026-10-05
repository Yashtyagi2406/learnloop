import { Router, Request, Response, NextFunction } from 'express';
import { Database } from 'better-sqlite3';
import { getAllCourses, getCourseById } from '../services/courseService.js';
import { HttpError } from '../middleware/errorHandler.js';

export function createCoursesRouter(db: Database): Router {
  const router = Router();

  router.get('/', (_req: Request, res: Response, next: NextFunction) => {
    try {
      const courses = getAllCourses(db);
      res.json(courses);
    } catch (err) {
      next(err);
    }
  });

  router.get('/:id', (req: Request, res: Response, next: NextFunction) => {
    try {
      const course = getCourseById(db, req.params.id);
      if (!course) {
        throw new HttpError(404, 'Course not found.');
      }
      res.json(course);
    } catch (err) {
      next(err);
    }
  });

  return router;
}
