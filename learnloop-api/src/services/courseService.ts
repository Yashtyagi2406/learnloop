import { Database } from 'better-sqlite3';
import { Course, Lesson, Question } from '../types/index.js';

export function getAllCourses(db: Database): Course[] {
  const courses = db.prepare(`
    SELECT id, title, level, description, quiz_seconds
    FROM courses
    ORDER BY order_index ASC
  `).all() as Array<{
    id: string;
    title: string;
    level: string;
    description: string;
    quiz_seconds: number;
  }>;

  const lessonsStmt = db.prepare(`
    SELECT id, course_id, title, content
    FROM lessons
    ORDER BY order_index ASC
  `);
  const allLessons = lessonsStmt.all() as Array<{
    id: string;
    course_id: string;
    title: string;
    content: string;
  }>;

  const questionsStmt = db.prepare(`
    SELECT id, course_id, q, options, answer
    FROM questions
    ORDER BY order_index ASC
  `);
  const allQuestions = questionsStmt.all() as Array<{
    id: number;
    course_id: string;
    q: string;
    options: string;
    answer: number;
  }>;

  // Group lessons and questions by course_id
  const lessonsByCourse = new Map<string, Lesson[]>();
  for (const l of allLessons) {
    if (!lessonsByCourse.has(l.course_id)) {
      lessonsByCourse.set(l.course_id, []);
    }
    lessonsByCourse.get(l.course_id)!.push({
      id: l.id,
      title: l.title,
      content: l.content,
    });
  }

  const questionsByCourse = new Map<string, Question[]>();
  for (const q of allQuestions) {
    if (!questionsByCourse.has(q.course_id)) {
      questionsByCourse.set(q.course_id, []);
    }
    questionsByCourse.get(q.course_id)!.push({
      q: q.q,
      options: JSON.parse(q.options),
      answer: q.answer,
    });
  }

  return courses.map(course => ({
    id: course.id,
    title: course.title,
    level: course.level,
    description: course.description,
    lessons: lessonsByCourse.get(course.id) || [],
    quiz: {
      seconds: course.quiz_seconds,
      questions: questionsByCourse.get(course.id) || [],
    },
  }));
}

export function getCourseById(db: Database, id: string): Course | null {
  const course = db.prepare(`
    SELECT id, title, level, description, quiz_seconds
    FROM courses
    WHERE id = ?
  `).get(id) as {
    id: string;
    title: string;
    level: string;
    description: string;
    quiz_seconds: number;
  } | undefined;

  if (!course) return null;

  const lessons = db.prepare(`
    SELECT id, title, content
    FROM lessons
    WHERE course_id = ?
    ORDER BY order_index ASC
  `).all(id) as Lesson[];

  const questionsRaw = db.prepare(`
    SELECT q, options, answer
    FROM questions
    WHERE course_id = ?
    ORDER BY order_index ASC
  `).all(id) as Array<{
    q: string;
    options: string;
    answer: number;
  }>;

  const questions: Question[] = questionsRaw.map(q => ({
    q: q.q,
    options: JSON.parse(q.options),
    answer: q.answer,
  }));

  return {
    id: course.id,
    title: course.title,
    level: course.level,
    description: course.description,
    lessons,
    quiz: {
      seconds: course.quiz_seconds,
      questions,
    },
  };
}

export function courseExists(db: Database, id: string): boolean {
  const row = db.prepare('SELECT 1 FROM courses WHERE id = ?').get(id);
  return Boolean(row);
}

export function validateProgressCourseAndLessons(
  db: Database,
  progress: Record<string, string[]>
): { valid: boolean; error?: string } {
  const courseIds = Object.keys(progress);
  if (courseIds.length === 0) {
    return { valid: true };
  }

  const courseStmt = db.prepare('SELECT id FROM courses WHERE id = ?');
  const lessonStmt = db.prepare('SELECT 1 FROM lessons WHERE course_id = ? AND id = ?');

  for (const courseId of courseIds) {
    const course = courseStmt.get(courseId);
    if (!course) {
      return { valid: false, error: `Course not found: '${courseId}'` };
    }

    const lessonIds = progress[courseId];
    if (!Array.isArray(lessonIds)) {
      return { valid: false, error: `Lesson IDs for course '${courseId}' must be an array` };
    }

    for (const lessonId of lessonIds) {
      const lesson = lessonStmt.get(courseId, lessonId);
      if (!lesson) {
        return {
          valid: false,
          error: `Lesson '${lessonId}' does not exist for course '${courseId}'`,
        };
      }
    }
  }

  return { valid: true };
}
