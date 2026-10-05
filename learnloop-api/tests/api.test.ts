import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import Database from 'better-sqlite3';
import { createApp } from '../src/app.js';
import { seed } from '../src/db/seed.js';

describe('LearnLoop API Integration Tests', () => {
  let db: Database.Database;
  let app: ReturnType<typeof createApp>;

  beforeEach(() => {
    // Isolated in-memory database for each test run
    db = new Database(':memory:');
    db.pragma('foreign_keys = ON');
    seed(db);
    app = createApp(db);
  });

  afterEach(() => {
    db.close();
  });

  describe('GET /health', () => {
    it('should return 200 with { ok: true }', async () => {
      const res = await request(app).get('/health');
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ ok: true });
    });
  });

  describe('Courses API', () => {
    it('GET /courses should return an array of full course objects', async () => {
      const res = await request(app).get('/courses');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(4);

      const htmlCourse = res.body.find((c: any) => c.id === 'html-css');
      expect(htmlCourse).toBeDefined();
      expect(htmlCourse.title).toBe('HTML and CSS Foundations');
      expect(htmlCourse.level).toBe('Beginner');
      expect(htmlCourse.lessons.length).toBe(3);
      expect(htmlCourse.lessons[0]).toHaveProperty('id', 'l1');
      expect(htmlCourse.lessons[0]).toHaveProperty('title', 'Semantic HTML');
      expect(htmlCourse.lessons[0]).toHaveProperty('content');

      expect(htmlCourse.quiz).toBeDefined();
      expect(htmlCourse.quiz.seconds).toBe(90);
      expect(htmlCourse.quiz.questions.length).toBe(3);
      expect(htmlCourse.quiz.questions[0]).toHaveProperty('q');
      expect(Array.isArray(htmlCourse.quiz.questions[0].options)).toBe(true);
      expect(typeof htmlCourse.quiz.questions[0].answer).toBe('number');
    });

    it('GET /courses/:id should return a specific course by id', async () => {
      const res = await request(app).get('/courses/react');
      expect(res.status).toBe(200);
      expect(res.body.id).toBe('react');
      expect(res.body.title).toBe('React Basics');
      expect(res.body.level).toBe('Intermediate');
      expect(res.body.lessons.length).toBe(3);
      expect(res.body.quiz.questions.length).toBe(3);
    });

    it('GET /courses/:id should return 404 for non-existent course', async () => {
      const res = await request(app).get('/courses/nonexistent-course');
      expect(res.status).toBe(404);
      expect(res.body).toEqual({ error: 'Course not found.' });
    });
  });

  describe('Progress API', () => {
    it('GET /progress should return empty object when no progress is saved', async () => {
      const res = await request(app).get('/progress');
      expect(res.status).toBe(200);
      expect(res.body).toEqual({});
    });

    it('PUT /progress and GET /progress round-trip', async () => {
      const payload = {
        'html-css': ['l1', 'l2'],
        react: ['l1'],
      };

      const putRes = await request(app)
        .put('/progress')
        .send(payload);

      expect(putRes.status).toBe(200);
      expect(putRes.body).toEqual(payload);

      // Verify persistence via GET /progress
      const getRes = await request(app).get('/progress');
      expect(getRes.status).toBe(200);
      expect(getRes.body).toEqual(payload);
    });

    it('PUT /progress should replace previous progress', async () => {
      await request(app)
        .put('/progress')
        .send({ 'html-css': ['l1', 'l2'] });

      const updatedRes = await request(app)
        .put('/progress')
        .send({ 'html-css': ['l1'], javascript: ['l1'] });

      expect(updatedRes.status).toBe(200);
      expect(updatedRes.body).toEqual({ 'html-css': ['l1'], javascript: ['l1'] });

      const getRes = await request(app).get('/progress');
      expect(getRes.body).toEqual({ 'html-css': ['l1'], javascript: ['l1'] });
    });

    it('PUT /progress should reject non-existent course ID with 400', async () => {
      const res = await request(app)
        .put('/progress')
        .send({ 'invalid-course': ['l1'] });

      expect(res.status).toBe(400);
      expect(res.body.error).toContain("Course not found: 'invalid-course'");
    });

    it('PUT /progress should reject non-existent lesson ID with 400', async () => {
      const res = await request(app)
        .put('/progress')
        .send({ 'html-css': ['l999'] });

      expect(res.status).toBe(400);
      expect(res.body.error).toContain("Lesson 'l999' does not exist for course 'html-css'");
    });

    it('PUT /progress should reject invalid body format with 400', async () => {
      const res = await request(app)
        .put('/progress')
        .send({ 'html-css': 'not-an-array' });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('Results API', () => {
    it('GET /results should return empty array initially', async () => {
      const res = await request(app).get('/results');
      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });

    it('POST /results should store result and return 201 with timestamp', async () => {
      const res = await request(app)
        .post('/results')
        .send({ courseId: 'react', score: 3, total: 3 });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.courseId).toBe('react');
      expect(res.body.score).toBe(3);
      expect(res.body.total).toBe(3);
      expect(typeof res.body.at).toBe('number');

      // Verify GET /results returns it
      const getRes = await request(app).get('/results');
      expect(getRes.status).toBe(200);
      expect(getRes.body.length).toBe(1);
      expect(getRes.body[0].courseId).toBe('react');
      expect(getRes.body[0].score).toBe(3);
    });

    it('POST /results should reject score > total with 400', async () => {
      const res = await request(app)
        .post('/results')
        .send({ courseId: 'react', score: 5, total: 3 });

      expect(res.status).toBe(400);
      expect(res.body.error).toContain('score must be less than or equal to total');
    });

    it('POST /results should reject negative score with 400', async () => {
      const res = await request(app)
        .post('/results')
        .send({ courseId: 'react', score: -1, total: 3 });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('POST /results should reject non-existent course with 400', async () => {
      const res = await request(app)
        .post('/results')
        .send({ courseId: 'nonexistent', score: 2, total: 3 });

      expect(res.status).toBe(400);
      expect(res.body.error).toContain("Course 'nonexistent' does not exist.");
    });

    it('GET /results should return results in newest first order', async () => {
      await request(app)
        .post('/results')
        .send({ courseId: 'html-css', score: 1, total: 3 });

      await request(app)
        .post('/results')
        .send({ courseId: 'javascript', score: 2, total: 3 });

      const res = await request(app).get('/results');
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body[0].courseId).toBe('javascript');
      expect(res.body[1].courseId).toBe('html-css');
    });
  });

  describe('Auth API and User Scoping', () => {
    it('POST /auth/register should register a new user and return token', async () => {
      const res = await request(app)
        .post('/auth/register')
        .send({ email: 'student@example.com', password: 'password123' });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user).toHaveProperty('id');
      expect(res.body.user.email).toBe('student@example.com');
    });

    it('POST /auth/register should reject duplicate email', async () => {
      await request(app)
        .post('/auth/register')
        .send({ email: 'student@example.com', password: 'password123' });

      const res = await request(app)
        .post('/auth/register')
        .send({ email: 'student@example.com', password: 'password123' });

      expect(res.status).toBe(400);
      expect(res.body.error).toContain('Email already in use');
    });

    it('POST /auth/login should authenticate user and return token', async () => {
      await request(app)
        .post('/auth/register')
        .send({ email: 'student2@example.com', password: 'password123' });

      const res = await request(app)
        .post('/auth/login')
        .send({ email: 'student2@example.com', password: 'password123' });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user.email).toBe('student2@example.com');
    });

    it('POST /auth/login should reject incorrect password with 401', async () => {
      await request(app)
        .post('/auth/register')
        .send({ email: 'student3@example.com', password: 'password123' });

      const res = await request(app)
        .post('/auth/login')
        .send({ email: 'student3@example.com', password: 'wrongpassword' });

      expect(res.status).toBe(401);
      expect(res.body.error).toContain('Invalid email or password');
    });

    it('should scope progress and results independently per authenticated user', async () => {
      // Register user A
      const userARes = await request(app)
        .post('/auth/register')
        .send({ email: 'userA@example.com', password: 'password123' });
      const tokenA = userARes.body.token;

      // Register user B
      const userBRes = await request(app)
        .post('/auth/register')
        .send({ email: 'userB@example.com', password: 'password123' });
      const tokenB = userBRes.body.token;

      // User A saves progress
      await request(app)
        .put('/progress')
        .set('Authorization', `Bearer ${tokenA}`)
        .send({ 'html-css': ['l1'] });

      // User B saves different progress
      await request(app)
        .put('/progress')
        .set('Authorization', `Bearer ${tokenB}`)
        .send({ javascript: ['l1', 'l2'] });

      // Check User A progress
      const checkA = await request(app)
        .get('/progress')
        .set('Authorization', `Bearer ${tokenA}`);
      expect(checkA.body).toEqual({ 'html-css': ['l1'] });

      // Check User B progress
      const checkB = await request(app)
        .get('/progress')
        .set('Authorization', `Bearer ${tokenB}`);
      expect(checkB.body).toEqual({ javascript: ['l1', 'l2'] });

      // Check guest/default user progress remains empty
      const checkDefault = await request(app).get('/progress');
      expect(checkDefault.body).toEqual({});
    });
  });

  describe('Error handling', () => {
    it('should return 404 { error: "Not found" } for unknown routes', async () => {
      const res = await request(app).get('/unknown-path');
      expect(res.status).toBe(404);
      expect(res.body).toEqual({ error: 'Not found' });
    });
  });
});
