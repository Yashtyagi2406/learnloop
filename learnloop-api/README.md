# LearnLoop API

Backend REST API for **LearnLoop**, a course and lesson learning platform with progress tracking and timed quizzes. Built with Node.js, Express, TypeScript, SQLite (`better-sqlite3`), and Zod validation.

---

## Features

- **Course Catalog**: Serves full course objects including lessons and interactive quizzes.
- **Progress Tracking**: Tracks per-course and per-lesson completion with idempotency and cross-course validation.
- **Quiz Results**: Records quiz scores with timestamping, score validation (`0 <= score <= total`), and reverse-chronological retrieval.
- **Normalized SQLite Database**: Courses, lessons, questions, progress, and results stored in separate normalized tables.
- **Idempotent Seeding**: `npm run seed` ports courses from `learnloop/src/data.js` safely without duplicating records.
- **Centralized Error Handling**: Uniform JSON error responses (`{ "error": "message" }`) with appropriate HTTP status codes and zero stack trace leakage.
- **Input Validation**: Request validation using Zod on every write route.
- **CORS Configured**: Dynamic origin via `CORS_ORIGIN`, defaulted for Vite frontend development.
- **JWT Authentication & User Scoping**: Optional user registration and login (`POST /auth/register`, `POST /auth/login`) with bcrypt password hashing and token-based user progress scoping. Unauthenticated requests seamlessly default to the default user.

---

## Setup & Running Locally

### 1. Prerequisites
- Node.js (v18+ recommended, v20+ / v24 tested)
- npm (v9+)

### 2. Installation
```bash
cd learnloop-api
npm install
```

### 3. Environment Variables
Copy the example environment file:
```bash
cp .env.example .env
```

| Variable | Default | Description |
| :--- | :--- | :--- |
| `PORT` | `4000` | Port for the HTTP server to listen on |
| `CORS_ORIGIN` | `http://localhost:5173` | Allowed CORS origin (matches Vite dev server) |
| `DATABASE_PATH` | `./learnloop.db` | Path to SQLite database file |
| `JWT_SECRET` | `supersecret_jwt_key_learnloop_2026` | Secret key for signing JWT tokens |

### 4. Database Seeding
Initialize the schema and seed the default course data:
```bash
npm run seed
```

### 5. Running the Server
```bash
# Development mode with hot reload
npm run dev

# Or build and run production bundle
npm run build
npm start
```
The server will start at `http://localhost:4000`.

### 6. Running Tests
Run the integration test suite powered by Vitest and Supertest:
```bash
npm test
```

---

## API Endpoints

All responses are formatted in JSON. Errors return `{ "error": "message" }` with the respective HTTP status code.

| Method | Endpoint | Auth | Description | Status Codes |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/health` | No | Server health check status | `200` |
| `GET` | `/courses` | No | Retrieve list of all courses | `200` |
| `GET` | `/courses/:id` | No | Retrieve single course by ID | `200`, `404` |
| `GET` | `/progress` | Optional (Bearer) | Get saved lesson completion progress | `200` |
| `PUT` | `/progress` | Optional (Bearer) | Replace saved lesson progress for user | `200`, `400` |
| `GET` | `/results` | Optional (Bearer) | List all quiz results, newest first | `200` |
| `POST` | `/results` | Optional (Bearer) | Save a quiz result with score and total | `201`, `400` |
| `POST` | `/auth/register` | No | Register new user account | `201`, `400` |
| `POST` | `/auth/login` | No | Authenticate user & get JWT token | `200`, `401` |
| `GET` | `/auth/me` | Required (Bearer) | Retrieve profile of authenticated user | `200`, `401` |

### Sample Payloads

#### Course Object
```json
{
  "id": "react",
  "title": "React Basics",
  "level": "Intermediate",
  "description": "Build interfaces from components, props, state and effects.",
  "lessons": [
    {
      "id": "l1",
      "title": "Components and JSX",
      "content": "A component is a function that returns JSX. Keep components small and focused on one job."
    }
  ],
  "quiz": {
    "seconds": 90,
    "questions": [
      {
        "q": "What do props let you do?",
        "options": ["Mutate a parent's state", "Pass data into a component", "Create routes", "Style components"],
        "answer": 1
      }
    ]
  }
}
```

#### Progress (`GET /progress`, `PUT /progress`)
```json
{
  "html-css": ["l1", "l2"],
  "react": ["l1"]
}
```

#### Result Creation (`POST /results`)
```json
{
  "courseId": "react",
  "score": 3,
  "total": 3
}
```

---

## Deployment Notes

### Deploying to Render
1. Create a **Web Service** connected to your repository.
2. Configure settings:
   - **Root Directory**: `learnloop-api`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build && npm run seed`
   - **Start Command**: `npm start`
3. Environment Variables:
   - `PORT`: `4000` (or leave default assigned by Render)
   - `CORS_ORIGIN`: Your deployed frontend URL (e.g., `https://learnloop.vercel.app`)
   - `DATABASE_PATH`: `/var/data/learnloop.db` (attach a Render **Persistent Disk** mounted at `/var/data` so SQLite data persists across redeploys)
   - `JWT_SECRET`: A strong random string

### Deploying to Railway
1. Create a **New Project** and select this GitHub repository.
2. Set the service root directory to `learnloop-api`.
3. In service settings:
   - **Build Command**: `npm install && npm run build && npm run seed`
   - **Start Command**: `npm start`
4. Attach a Railway **Volume** mounted at `/data`.
5. Set environment variables:
   - `PORT`: `4000`
   - `DATABASE_PATH`: `/data/learnloop.db`
   - `CORS_ORIGIN`: Your frontend domain
   - `JWT_SECRET`: A secure secret
