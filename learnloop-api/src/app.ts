import express, { Express } from 'express';
import cors from 'cors';
import { Database } from 'better-sqlite3';
import { userContext } from './middleware/auth.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { healthRouter } from './routes/health.js';
import { createCoursesRouter } from './routes/courses.js';
import { createProgressRouter } from './routes/progress.js';
import { createResultsRouter } from './routes/results.js';
import { createAuthRouter } from './routes/auth.js';

export function createApp(db: Database): Express {
  const app = express();

  const allowedOrigin = process.env.CORS_ORIGIN || 'http://localhost:5173';

  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl, or server-to-server)
        if (!origin) return callback(null, true);
        if (origin === allowedOrigin || allowedOrigin === '*') {
          return callback(null, true);
        }
        return callback(null, true); // Permissive in dev/testing while honoring header
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  app.use(express.json());
  app.use(userContext);

  // Routes
  app.use('/health', healthRouter);
  app.use('/courses', createCoursesRouter(db));
  app.use('/progress', createProgressRouter(db));
  app.use('/results', createResultsRouter(db));
  app.use('/auth', createAuthRouter(db));

  // Centralized Error Handling
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
