# LearnLoop

Courses, lessons, progress tracking and timed quizzes. React + Vite, no UI library.

## Run
    npm install
    npm run dev       # http://localhost:5173
    npm run build     # static output in dist/

## Features
- Course list with search, loading skeletons, empty and error states
- Course detail with lessons, mark-as-completed (undo supported), per-course and overall progress
- Quiz per course: countdown timer, next/previous, answers kept while navigating, auto-submit on timeout, score and correct/incorrect review, retry
- Progress persists across refresh (localStorage), dark mode, responsive layout

## Structure
    src/api.js        data layer: bundled data + localStorage, or a backend when VITE_API_URL is set
    src/state.jsx     progress context and useAsync hook
    src/useQuiz.js    quiz state machine (index, answers, timer)
    src/pages/        CourseList, CourseDetail, Quiz
    src/ui.jsx        shared progress bars and loading/error/empty states

## Connect a backend
Create `.env` with `VITE_API_URL=https://your-api.example.com` (no trailing slash). The contract is in `ANTIGRAVITY_BACKEND_PROMPT.md`.

## Deploy
Uses HashRouter, so any static host works with no rewrite rules. On Vercel or Netlify: build command `npm run build`, output directory `dist`.
