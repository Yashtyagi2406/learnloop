import { getDatabase } from './connection.js';
import { initializeSchema, DEFAULT_USER_ID } from './schema.js';

interface LessonData {
  id: string;
  title: string;
  content: string;
}

interface QuestionData {
  q: string;
  options: string[];
  answer: number;
}

interface CourseData {
  id: string;
  title: string;
  level: string;
  description: string;
  lessons: LessonData[];
  quiz: {
    seconds: number;
    questions: QuestionData[];
  };
}

const q = (question: string, options: string[], answer: number): QuestionData => ({
  q: question,
  options,
  answer,
});

export const SEED_COURSES: CourseData[] = [
  {
    id: 'html-css',
    title: 'HTML and CSS Foundations',
    level: 'Beginner',
    description: 'Master semantic web architecture, responsive layouts, and the modern CSS box model.',
    lessons: [
      {
        id: 'l1',
        title: 'Semantic HTML',
        content: `Semantic HTML introduces markup elements that convey meaning about the role and structure of web content rather than just its visual appearance.

Key semantic landmarks include:
• <header> & <footer>: Represent introductory and closing page banners or section boundaries.
• <nav>: Designates major navigation links for the site or document.
• <main>: Encloses the central, unique content of the document.
• <article> & <section>: Enclose self-contained compositions or thematic content groupings.

\`\`\`html
<header>
  <h1>TechInsights</h1>
  <nav aria-label="Main Navigation">
    <a href="/">Home</a>
    <a href="/articles">Articles</a>
  </nav>
</header>
<main>
  <article>
    <h2>Modern Web Architecture</h2>
    <p>Exploring state machines and edge computing.</p>
  </article>
</main>
\`\`\`

💡 Pro Tip: Screen readers and search engine crawlers rely heavily on semantic landmarks. Always prefer standard elements like <button> and <a> over clickable <div> tags to maintain keyboard navigation and accessibility standards.`,
      },
      {
        id: 'l2',
        title: 'The Box Model',
        content: `In CSS, every HTML element is treated as an individual rectangular box. Mastering the relationship between these layers is fundamental to building precise layouts without unexpected overflow.

The 4 box layers from inside to outside are:
• Content: The core area where text, images, or nested elements reside.
• Padding: The transparent internal spacing that surrounds the content inside the border.
• Border: The rendered outline wrapping the padding and content.
• Margin: The external buffer clearing space between this box and adjacent elements.

By default, elements use 'content-box', meaning setting width applies only to content, and padding expands the total element size. Using 'border-box' keeps sizing predictable:

\`\`\`css
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
\`\`\`

💡 Pro Tip: Applying 'box-sizing: border-box' globally ensures that an element styled with 'width: 320px' will always stay exactly 320px wide, regardless of how much padding or border you add.`,
      },
      {
        id: 'l3',
        title: 'Flexbox and Grid',
        content: `Modern CSS provides two powerful layout engines designed to replace legacy floats and inline-block hacks: Flexbox for one-dimensional alignment and CSS Grid for two-dimensional structure.

Choosing between Flexbox and Grid:
• Flexbox (1D): Best for laying out items along a single axis (row or column). Excellent for navigation bars, card footers, toolbars, and vertical centering.
• CSS Grid (2D): Designed for coordinated macro page layouts that handle rows and columns simultaneously.

\`\`\`css
/* Responsive auto-fitting card grid */
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}

/* Flexbox centering utility */
.center-box {
  display: flex;
  justify-content: center;
  align-items: center;
}
\`\`\`

💡 Pro Tip: Combine them for best results! Use CSS Grid for your overall page layout and dashboard structure, and Flexbox inside components to align tags, titles, and action buttons.`,
      },
    ],
    quiz: {
      seconds: 90,
      questions: [
        q('Which tag best marks up main page navigation?', ['<div>', '<nav>', '<section>', '<span>'], 1),
        q("Which property adds space inside an element's border?", ['margin', 'gap', 'padding', 'outline'], 2),
        q('Which layout system is two-dimensional?', ['Flexbox', 'Grid', 'Float', 'Inline'], 1),
      ],
    },
  },
  {
    id: 'javascript',
    title: 'JavaScript Essentials',
    level: 'Beginner',
    description: 'Variables, closures, functional array pipelines, and asynchronous execution patterns.',
    lessons: [
      {
        id: 'l1',
        title: 'Variables and Scoping',
        content: `JavaScript manages data using primitive and reference types, with variable declarations governed by block vs. function scope.

Modern declaration keywords:
• const: Creates a block-scoped immutable binding. Use this as your default declaration for all variables.
• let: Creates a block-scoped variable that can be reassigned when state changes across loops or algorithms.
• var: Legacy function-scoped variable. Hoisted with undefined, making it prone to unexpected bugs. Avoid using var in modern code.

\`\`\`javascript
const user = { name: 'Aria', role: 'Engineer' };
// user = {}; // TypeError: Assignment to constant variable
user.role = 'Tech Lead'; // Allowed: mutates internal object property

let attemptCount = 0;
attemptCount += 1;
\`\`\`

💡 Pro Tip: Primitive types (numbers, strings, booleans, symbols) are immutable and passed by value. Objects and arrays are reference types passed by pointer. Default to 'const' for 95% of your code.`,
      },
      {
        id: 'l2',
        title: 'Functions and Array Pipelines',
        content: `In JavaScript, functions are first-class citizens: they can be stored in variables, passed into other functions as arguments, and returned from function calls.

Core functional programming patterns:
• Arrow Functions: Provide concise syntax and inherit 'this' lexically from their surrounding context.
• Closures: Functions remember and preserve access to their lexical scope even when invoked outside of it.
• Array Methods: Declarative methods like map(), filter(), and reduce() allow data transformations without mutation.

\`\`\`javascript
const metrics = [
  { id: 1, score: 88, active: true },
  { id: 2, score: 94, active: true },
  { id: 3, score: 45, active: false }
];

const activeAverage = metrics
  .filter(m => m.active)
  .map(m => m.score)
  .reduce((sum, score, _, arr) => sum + score / arr.length, 0);
\`\`\`

💡 Pro Tip: Pure functions produce the same output for given inputs and create zero side-effects. Keeping array pipelines pure makes your frontend logic predictable and easy to unit test.`,
      },
      {
        id: 'l3',
        title: 'Promises and Async/Await',
        content: `JavaScript executes in a single-threaded Event Loop. Asynchronous operations like network requests, file reading, and timers execute in background worker pools without freezing the UI thread.

The evolution of asynchronous JavaScript:
• Callbacks: The original pattern, which often led to difficult-to-maintain "callback hell".
• Promises: Objects representing the eventual completion or rejection of an async operation with .then(), .catch(), and .finally().
• Async/Await: Modern syntax built on top of Promises that allows asynchronous code to read sequentially like synchronous code.

\`\`\`javascript
async function fetchCourseDetails(courseId) {
  try {
    const response = await fetch(\`/api/courses/\${courseId}\`);
    if (!response.ok) {
      throw new Error(\`HTTP error \${response.status}\`);
    }
    const data = await response.json();
    return data;
  } catch (err) {
    console.error('Failed to load course:', err.message);
    throw err;
  }
}
\`\`\`

💡 Pro Tip: When you have multiple independent async tasks, run them concurrently using 'Promise.all([fetchUsers(), fetchCourses()])' rather than awaiting them one after another.`,
      },
    ],
    quiz: {
      seconds: 90,
      questions: [
        q('Which keyword declares a block-scoped, reassignable variable?', ['var', 'let', 'const', 'def'], 1),
        q('Which array method returns a new, transformed array?', ['forEach', 'push', 'map', 'splice'], 2),
        q('What does await do inside an async function?', ['Blocks the whole page', 'Pauses the function until a promise settles', 'Creates a thread', 'Cancels the promise'], 1),
      ],
    },
  },
  {
    id: 'react',
    title: 'React Basics',
    level: 'Intermediate',
    description: 'Component architecture, one-way data flow, state hooks, and side effect lifecycles.',
    lessons: [
      {
        id: 'l1',
        title: 'Components and JSX',
        content: `React models web interfaces as trees of isolated, modular components. JSX is a syntax extension for JavaScript that allows you to write HTML-like elements directly within your component logic.

Key architecture principles:
• Declarative UI: Describe what the interface should look like for a given state, and React handles efficient DOM updates.
• Component Purity: Components should behave as pure functions with respect to their inputs (props).
• Composition: Combine smaller, specialized components into complex interfaces rather than building large monolithic views.

\`\`\`jsx
function UserCard({ user, onSelect }) {
  return (
    <div className="user-card" onClick={() => onSelect(user.id)}>
      <img src={user.avatar} alt={user.name} className="avatar" />
      <div className="meta">
        <h3>{user.name}</h3>
        <span className="badge">{user.role}</span>
      </div>
    </div>
  );
}
\`\`\`

💡 Pro Tip: When rendering lists with .map(), always provide a unique and stable 'key' prop (such as an ID). Avoid using array indices as keys if the list can be filtered, reordered, or modified.`,
      },
      {
        id: 'l2',
        title: 'Props and State',
        content: `React enforces unidirectional data flow. Props pass data and callback functions down from parent to child, while state holds data that can mutate over time within a component.

Managing state effectively:
• Props are Read-Only: Child components must never mutate props received from a parent.
• State Triggers Renders: Calling a state setter schedules a re-render with the new state value.
• Functional Updaters: When new state depends on previous state, always use an updater function to prevent stale state bugs.

\`\`\`jsx
import { useState } from 'react';

function Counter({ initial = 0, step = 1 }) {
  const [count, setCount] = useState(initial);

  const increment = () => {
    // Updater function guarantees accurate latest state
    setCount(prev => prev + step);
  };

  return (
    <button className="btn" onClick={increment}>
      Current count: {count}
    </button>
  );
}
\`\`\`

💡 Pro Tip: "Lift state up" to the closest common ancestor whenever two sibling components need to share or coordinate the same state.`,
      },
      {
        id: 'l3',
        title: 'Effects and Lifecycles',
        content: `Rendering logic must remain pure. Side effects—such as fetching API data, establishing subscriptions, setting timers, or mutating the browser DOM—belong inside the useEffect hook.

Dependency array rules:
• No array: Effect executes after every single render cycle.
• Empty array []: Effect runs once after the component mounts.
• With dependencies [a, b]: Effect runs on mount and re-runs whenever any dependency value changes.

\`\`\`jsx
useEffect(() => {
  const controller = new AbortController();

  async function loadData() {
    try {
      const res = await fetch('/api/courses', { signal: controller.signal });
      const data = await res.json();
      setCourses(data);
    } catch (err) {
      if (err.name !== 'AbortError') console.error(err);
    }
  }

  loadData();
  // Cleanup function runs when component unmounts or before re-running effect
  return () => controller.abort();
}, []);
\`\`\`

💡 Pro Tip: Always return a cleanup function from your effects to remove event listeners, cancel timers, or abort in-flight network requests.`,
      },
    ],
    quiz: {
      seconds: 90,
      questions: [
        q('What do props let you do?', ["Mutate a parent's state", 'Pass data into a component', 'Create routes', 'Style components'], 1),
        q('Which hook stores local component state?', ['useEffect', 'useRef', 'useState', 'useMemo'], 2),
        q('When does useEffect with an empty dependency array run?', ['Every render', 'After the first render only', 'Never', 'Before render'], 1),
      ],
    },
  },
  {
    id: 'git',
    title: 'Git and GitHub',
    level: 'Beginner',
    description: 'Version control workflows, atomic commits, branch management, and pull request reviews.',
    lessons: [
      {
        id: 'l1',
        title: 'Commits and Branches',
        content: `Git is a distributed version control system that records snapshots of your codebase in a directed acyclic graph (DAG) of immutable commits.

The three Git areas:
• Working Directory: The sandbox containing your active project files.
• Staging Area (Index): The staging ground where you select and prepare changes for the next snapshot.
• Repository (.git): The permanent database containing your project's commit history.

\`\`\`bash
git status                     # Inspect modified and staged files
git add src/App.jsx            # Stage specific changes
git commit -m "feat: add auth" # Create a permanent snapshot
git checkout -b feature/quiz   # Create & switch to a new branch
\`\`\`

💡 Pro Tip: Practice atomic commits: each commit should represent one logical, focused change with a clear imperative message (e.g., 'feat: add timer warning indicator').`,
      },
      {
        id: 'l2',
        title: 'Merging and Conflicts',
        content: `When collaborating across feature branches, isolated work streams must eventually be integrated back into the main branch. Git provides merge and rebase strategies for this.

Integration strategies:
• Merge (git merge): Creates a three-way merge commit uniting both branches and preserving the exact chronological timeline.
• Rebase (git rebase): Replays your branch commits on top of the newest main commit, resulting in a clean, linear history.

\`\`\`
<<<<<<< HEAD
const theme = 'dark';
=======
const theme = 'system';
>>>>>>> feature/theme
\`\`\`

When conflicting edits happen on the exact same lines, Git pauses and writes conflict markers. Open the file, pick the desired code, delete the marker lines, stage the file with 'git add', and commit to finish.

💡 Pro Tip: Never rebase a public branch that other team members are actively pulling or building upon. Reserve rebasing for local feature branches before creating your pull request.`,
      },
      {
        id: 'l3',
        title: 'Pull Requests and Code Reviews',
        content: `A Pull Request (PR) on GitHub serves as a collaborative review hub where proposed changes are inspected, discussed, and validated before being merged into the production codebase.

Professional pull request workflow:
• Small Batch Sizes: Keep PRs focused (ideally under 300 lines of code) so reviewers can thoroughly spot edge cases and potential bugs.
• Meaningful Descriptions: Explain what problem the PR solves, link related issues, and attach visual previews or test steps.
• Automated CI Checks: Use GitHub Actions to automatically run linter checks, test suites, and build verifications on every pull request.

\`\`\`bash
git push -u origin feature/blinds-bg  # Publish branch to remote
# Then open GitHub to submit a Pull Request
\`\`\`

💡 Pro Tip: Open a 'Draft Pull Request' on GitHub early in your development cycle to solicit architecture feedback before writing the final implementation.`,
      },
    ],
    quiz: {
      seconds: 90,
      questions: [
        q('Which command records staged changes?', ['git push', 'git commit', 'git fetch', 'git pull'], 1),
        q('Which command creates a branch and switches to it?', ['git branch -d', 'git checkout -b', 'git merge', 'git stash'], 1),
        q('What is a pull request for?', ['Downloading code', 'Proposing and reviewing changes before merging', 'Deleting a branch', 'Reverting a commit'], 1),
      ],
    },
  },
];

export function seed(db = getDatabase()): void {
  initializeSchema(db);

  const seedTransaction = db.transaction(() => {
    const upsertCourse = db.prepare(`
      INSERT INTO courses (id, title, level, description, quiz_seconds, order_index)
      VALUES (?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        title = excluded.title,
        level = excluded.level,
        description = excluded.description,
        quiz_seconds = excluded.quiz_seconds,
        order_index = excluded.order_index
    `);

    const deleteLessons = db.prepare('DELETE FROM lessons WHERE course_id = ?');
    const insertLesson = db.prepare(`
      INSERT INTO lessons (id, course_id, title, content, order_index)
      VALUES (?, ?, ?, ?, ?)
    `);

    const deleteQuestions = db.prepare('DELETE FROM questions WHERE course_id = ?');
    const insertQuestion = db.prepare(`
      INSERT INTO questions (course_id, q, options, answer, order_index)
      VALUES (?, ?, ?, ?, ?)
    `);

    SEED_COURSES.forEach((course, courseIndex) => {
      upsertCourse.run(
        course.id,
        course.title,
        course.level,
        course.description,
        course.quiz.seconds,
        courseIndex
      );

      deleteLessons.run(course.id);
      course.lessons.forEach((lesson, lessonIndex) => {
        insertLesson.run(
          lesson.id,
          course.id,
          lesson.title,
          lesson.content,
          lessonIndex
        );
      });

      deleteQuestions.run(course.id);
      course.quiz.questions.forEach((question, qIndex) => {
        insertQuestion.run(
          course.id,
          question.q,
          JSON.stringify(question.options),
          question.answer,
          qIndex
        );
      });
    });
  });

  seedTransaction();
}

// Allow direct execution via npm run seed or tsx
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('Seeding database...');
  seed();
  console.log('Database seeded successfully.');
}
