import { Router, Response, NextFunction } from 'express';
import { Database } from 'better-sqlite3';
import { registerUser, loginUser, findUserById } from '../services/userService.js';
import { authSchema, loginSchema } from '../validation/schemas.js';
import { AuthenticatedRequest, requireAuth } from '../middleware/auth.js';

export function createAuthRouter(db: Database): Router {
  const router = Router();

  router.post('/register', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const parsed = authSchema.parse(req.body);
      const result = await registerUser(db, parsed.email, parsed.password);
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  });

  router.post('/login', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const parsed = loginSchema.parse(req.body);
      const result = await loginUser(db, parsed.email, parsed.password);
      res.json(result);
    } catch (err) {
      next(err);
    }
  });

  router.get('/me', requireAuth, (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
      const user = findUserById(db, req.userId);
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
      res.json({ id: user.id, email: user.email });
    } catch (err) {
      next(err);
    }
  });

  return router;
}
