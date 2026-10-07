import dotenv from 'dotenv';
import { getDatabase } from './db/connection.js';
import { initializeSchema } from './db/schema.js';
import { seed } from './db/seed.js';
import { createApp } from './app.js';

dotenv.config();

const port = Number(process.env.PORT) || 4000;
const db = getDatabase();

// Ensure schema is created
initializeSchema(db);

// Auto-seed if courses table is empty
const courseCountRow = db.prepare('SELECT COUNT(*) as count FROM courses').get() as { count: number };
if (courseCountRow.count === 0) {
  console.log('No courses found, auto-seeding database...');
  seed(db);
}

const app = createApp(db);

const server = app.listen(port, '0.0.0.0', () => {
  console.log(`LearnLoop API listening on port ${port}`);
  console.log(`Health check: http://0.0.0.0:${port}/health`);

  // Keep-alive self-ping: prevents Render free tier from sleeping after 15 min inactivity.
  // Pings own /health endpoint every 10 minutes.
  const selfPingUrl = process.env.RENDER_EXTERNAL_URL
    ? `${process.env.RENDER_EXTERNAL_URL}/health`
    : `http://0.0.0.0:${port}/health`;

  if (process.env.NODE_ENV === 'production') {
    const PING_INTERVAL_MS = 10 * 60 * 1000; // 10 minutes
    setInterval(() => {
      fetch(selfPingUrl)
        .then(() => console.log(`[keep-alive] pinged ${selfPingUrl}`))
        .catch((err: Error) => console.warn(`[keep-alive] ping failed: ${err.message}`));
    }, PING_INTERVAL_MS);
    console.log(`[keep-alive] Self-ping enabled every 10 minutes → ${selfPingUrl}`);
  }
});

// Graceful shutdown
process.on('SIGINT', () => {
  server.close(() => {
    db.close();
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  server.close(() => {
    db.close();
    process.exit(0);
  });
});
