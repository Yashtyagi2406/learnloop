# LearnLoop Frontend

Courses, lessons, progress tracking and timed quizzes. React + Vite, no UI library.

## Quick Start (Run with Backend)

To run the complete full-stack LearnLoop application:

### 1. Start the Backend (`learnloop-api`)
```bash
cd ../learnloop-api
npm install
npm run seed       # Idempotently seeds courses into SQLite
npm run dev        # Starts API on http://localhost:4000
```

### 2. Start the Frontend (`learnloop`)
In a separate terminal:
```bash
cd ../learnloop
npm install
cp .env.example .env    # Ensure VITE_API_URL=http://localhost:4000
npm run dev             # Starts Vite on http://localhost:5173
```

Open `http://localhost:5173` in your browser.

## Features
- **Course catalog**: Search, loading skeletons, empty states, and lesson outlines.
- **Progress tracking**: Completed lessons persist to SQLite across page refreshes and browser restarts.
- **Timed quizzes**: Countdown timer, state preservation during quiz navigation, auto-submit on timeout, and detailed answer review.
- **Authentication**: Optional login and account registration storing JWT token in `localStorage`, scoping progress to the user.
- **Offline / Standalone Fallback**: When `VITE_API_URL` is omitted, the frontend gracefully falls back to bundled data and `localStorage`.

## Directory Structure
```
src/
├── api.js         Data layer: hits backend API when VITE_API_URL is set
├── state.jsx      Progress context and useAsync hook
├── useQuiz.js     Quiz state machine (timing, responses, score calculation)
├── pages/
│   ├── CourseList.jsx    Catalog view with search filter
│   ├── CourseDetail.jsx  Lesson reader and completion toggle
│   ├── Quiz.jsx          Timed quiz interface and review
│   └── Auth.jsx          Minimal Sign In / Register modal view
├── ui.jsx         Shared progress bars and loading/error states
└── styles.css     Clean typography and responsive dark/light theme
```

## Connecting to Backend
Create `.env` inside `learnloop/`:
```env
VITE_API_URL=http://localhost:4000
```
When this variable is set, all course queries, progress updates, and quiz score submissions are routed directly to the Express backend.

## Production Build & Deploy
```bash
npm run build     # Outputs optimized static bundle into dist/
```
Deploy the `dist/` directory to Vercel, Netlify, Cloudflare Pages, or AWS S3.
