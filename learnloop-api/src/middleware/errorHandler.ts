import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export class HttpError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof HttpError) {
    res.status(err.statusCode).json({ error: err.message });
    return;
  }

  if (err instanceof ZodError) {
    const message = err.errors.map(e => e.message || `${e.path.join('.')}: invalid`).join(', ');
    res.status(400).json({ error: message || 'Validation failed' });
    return;
  }

  // Handle SQLite / foreign key errors
  if (err && typeof err === 'object' && 'code' in err && err.code === 'SQLITE_CONSTRAINT') {
    res.status(400).json({ error: 'Database constraint violation' });
    return;
  }

  // Fallback for unhandled errors
  const message = err?.message && process.env.NODE_ENV !== 'production'
    ? err.message
    : 'Internal server error';

  res.status(500).json({ error: message });
}

export function notFoundHandler(_req: Request, res: Response): void {
  res.status(404).json({ error: 'Not found' });
}
