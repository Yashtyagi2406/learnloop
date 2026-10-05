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

const server = app.listen(port, () => {
  console.log(`LearnLoop API listening on http://localhost:${port}`);
  console.log(`Health check: http://localhost:${port}/health`);
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
