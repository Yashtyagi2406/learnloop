import { z } from 'zod';

export const progressSchema = z.record(
  z.string(),
  z.array(z.string())
);

export const resultSchema = z
  .object({
    courseId: z.string().min(1, 'courseId is required'),
    score: z.number().int().min(0, 'Score must be non-negative'),
    total: z.number().int().min(0, 'Total must be non-negative'),
  })
  .refine(data => data.score <= data.total, {
    message: 'score must be less than or equal to total',
    path: ['score'],
  });

export const authSchema = z.object({
  email: z.string().email('Valid email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const loginSchema = z.object({
  email: z.string().email('Valid email is required'),
  password: z.string().min(1, 'Password is required'),
});
