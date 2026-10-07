# LearnLoop

A modern full-stack learning platform featuring interactive courses, structured lessons, progress tracking, and timed quizzes.

```
learnloop/
├── learnloop/        # React + Vite frontend application
└── learnloop-api/    # Node.js + Express + TypeScript + SQLite backend API
```

---

## Quick Start

### 1. Install & Start Backend
```bash
cd learnloop-api
npm install
npm run seed     # Initializes SQLite and seeds courses
npm run dev      # Runs API at http://localhost:4000
```

### 2. Install & Start Frontend
In a new terminal window:
```bash
cd learnloop
npm install
npm run dev      # Runs frontend at http://localhost:5173
```

Visit [http://localhost:5173](http://localhost:5173) in your browser.

---

## Tech Stack

### Frontend (`learnloop/`)
- **Framework**: React 18 with Vite
- **Routing**: React Router (HashRouter)
- **Styling**: Vanilla CSS design system with dark/light mode toggle
- **Persistence**: Real-time sync with backend API and offline fallback

### Backend (`learnloop-api/`)
- **Runtime & Language**: Node.js, TypeScript
- **Server**: Express with CORS & centralized error handling
- **Database**: SQLite via `better-sqlite3` (WAL mode, foreign keys enabled)
- **Validation**: Zod schema validation on write operations
- **Security**: JWT authentication with bcrypt password hashing
- **Testing**: Vitest + Supertest integration test suite

---

## Verification & Testing

### Running Backend Tests
```bash
cd learnloop-api
npm test
```

### End-to-End Verification
1. Start `learnloop-api` on port `4000`.
2. Start `learnloop` on port `5173`.
3. Open the app, mark lessons as completed.
4. Refresh the page: notice progress persists across refreshes and is stored in SQLite `progress` table.
5. Take a course quiz and complete it: score is recorded in SQLite `results` table.

---

## Production Deployment (Vercel + Render)

### 1. Deploy Backend to Render (Free)
1. Sign up / Log in to [render.com](https://render.com).
2. Click **New +** → **Blueprint** (or **Web Service**).
3. Connect your GitHub repository: `https://github.com/Yashtyagi2406/learnloop`.
4. Render will automatically detect `render.yaml`:
   - **Root Directory**: `learnloop-api`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
5. Click **Apply**. Once deployed, Render will provide your live API URL (e.g., `https://learnloop-api.onrender.com`).

### 2. Deploy Frontend to Vercel (Free)
1. Sign up / Log in to [vercel.com](https://vercel.com).
2. Click **Add New...** → **Project** and import `Yashtyagi2406/learnloop`.
3. Configure the project settings:
   - **Root Directory**: Click *Edit* and select `learnloop`.
   - **Framework Preset**: `Vite`
   - **Environment Variables**: Add `VITE_API_URL` set to your Render backend URL (e.g. `https://learnloop-api.onrender.com`).
4. Click **Deploy**.
5. Your live LearnLoop platform will be deployed with full SSL and global CDN!

