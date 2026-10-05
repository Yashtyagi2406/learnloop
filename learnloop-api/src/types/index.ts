export interface Lesson {
  id: string;
  title: string;
  content: string;
}

export interface Question {
  q: string;
  options: string[];
  answer: number;
}

export interface Quiz {
  seconds: number;
  questions: Question[];
}

export interface Course {
  id: string;
  title: string;
  level: string;
  description: string;
  lessons: Lesson[];
  quiz: Quiz;
}

export type ProgressMap = Record<string, string[]>;

export interface QuizResult {
  id?: number;
  courseId: string;
  score: number;
  total: number;
  at: number;
}

export interface User {
  id: string;
  email: string;
  password_hash?: string | null;
  created_at: number;
}
