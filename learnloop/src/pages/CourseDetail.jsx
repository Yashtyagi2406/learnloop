import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../api';
import { useAsync, useProgress } from '../state';
import { Loading, ErrorBox } from '../ui';

function renderBlock(block, bIdx) {
  const trimmed = block.trim();
  if (!trimmed) return null;

  // Code Block
  if (trimmed.startsWith('```') && trimmed.endsWith('```')) {
    const codeLines = trimmed.slice(3, -3).split('\n');
    const firstLine = codeLines[0].trim().toLowerCase();
    const isLang = ['html', 'css', 'javascript', 'jsx', 'bash', 'js', 'json'].includes(firstLine);
    const code = isLang ? codeLines.slice(1).join('\n') : codeLines.join('\n');
    return (
      <div key={bIdx} className="code-container">
        {isLang && <div className="code-lang-tag">{firstLine}</div>}
        <pre className="code-block">
          <code>{code.trim()}</code>
        </pre>
      </div>
    );
  }

  // Callout Box
  if (trimmed.startsWith('💡') || trimmed.startsWith('⚠️')) {
    return (
      <div key={bIdx} className="lesson-callout">
        {trimmed}
      </div>
    );
  }

  // Bullet Lists
  const lines = trimmed.split('\n');
  const hasBullets = lines.some(l => l.trim().startsWith('•') || l.trim().startsWith('-'));
  if (hasBullets) {
    const introLines = [];
    const bulletItems = [];
    let inBullets = false;

    lines.forEach(line => {
      const lTrim = line.trim();
      if (lTrim.startsWith('•') || lTrim.startsWith('-')) {
        inBullets = true;
        bulletItems.push(lTrim.replace(/^[•\-]\s*/, ''));
      } else if (!inBullets) {
        if (lTrim) introLines.push(lTrim);
      } else if (lTrim) {
        bulletItems.push(lTrim);
      }
    });

    return (
      <div key={bIdx} className="lesson-section">
        {introLines.length > 0 && <p>{introLines.join(' ')}</p>}
        <ul className="lesson-list">
          {bulletItems.map((item, iIdx) => (
            <li key={iIdx}>{item}</li>
          ))}
        </ul>
      </div>
    );
  }

  // Standard Paragraph
  return <p key={bIdx}>{trimmed}</p>;
}

export default function CourseDetail() {
  const { id } = useParams();
  const { data: c, loading, error, retry } = useAsync(() => api.getCourse(id), [id]);
  const { isDone, toggle, count } = useProgress();
  const [idx, setIdx] = useState(0);

  if (loading) return <Loading n={1} />;
  if (error) {
    return (
      <>
        <Link to="/" className="back">← All courses</Link>
        <ErrorBox message={error} onRetry={retry} />
      </>
    );
  }

  const l = c.lessons[idx];
  const n = count(c.id);
  const totalLessons = c.lessons.length;
  const progressPercent = Math.round((n / totalLessons) * 100);
  const isLessonCompleted = isDone(c.id, l.id);

  const handleNext = () => {
    if (idx < totalLessons - 1) {
      setIdx(idx + 1);
      window.scrollTo({ top: 200, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    if (idx > 0) {
      setIdx(idx - 1);
      window.scrollTo({ top: 200, behavior: 'smooth' });
    }
  };

  return (
    <div className="course-detail-container">
      {/* Top Header Card */}
      <div className="course-header-card panel fade">
        <div className="course-header-top">
          <Link to="/" className="back">← All courses</Link>
          <span className="tag">{c.level}</span>
        </div>
        <h1>{c.title}</h1>
        <p className="lead">{c.description}</p>
        <div className="course-header-progress">
          <div className="course-progress-meta">
            <span>Overall Course Progress</span>
            <span><b>{n} of {totalLessons} completed</b> ({progressPercent}%)</span>
          </div>
          <div className="track">
            <div className="fill" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>
      </div>

      {/* Main 2-Column Split */}
      <div className="course-layout-split">
        {/* Sticky Left Sidebar */}
        <aside className="sidebar-col">
          <div className="sidebar-panel panel">
            <div className="sidebar-header">
              <h3>Curriculum</h3>
              <small>{totalLessons} lessons</small>
            </div>
            <nav className="lessons-nav" aria-label="Course lessons">
              {c.lessons.map((x, i) => {
                const done = isDone(c.id, x.id);
                const isActive = i === idx;
                return (
                  <button
                    key={x.id}
                    className={`lesson-nav-item ${isActive ? 'on' : ''}`}
                    onClick={() => setIdx(i)}
                  >
                    <span className={`dot ${done ? 'ok' : ''}`}>
                      {done ? '✓' : i + 1}
                    </span>
                    <div className="lesson-nav-info">
                      <span className="lesson-nav-title">{x.title}</span>
                      <small className="lesson-nav-status">{done ? 'Completed' : `Module 0${i + 1}`}</small>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Persistent Sidebar Quiz Card */}
          <div className="sidebar-quiz-card panel">
            <div className="quiz-card-badge">🏆 Course Assessment</div>
            <h4>Ready to test your skills?</h4>
            <p>Take the timed multiple-choice quiz to validate your understanding.</p>
            <Link className="btn quiz-cta-btn" to={`/courses/${c.id}/quiz`}>
              Start Course Quiz →
            </Link>
          </div>
        </aside>

        {/* Right Active Lesson Reader */}
        <main className="content-col">
          <article key={l.id} className="lesson-article panel fade">
            <div className="lesson-article-header">
              <div className="lesson-badge-row">
                <span className="module-pill">Module {idx + 1} of {totalLessons}</span>
                <span className={`status-pill ${isLessonCompleted ? 'completed' : 'pending'}`}>
                  {isLessonCompleted ? '✓ Completed' : 'In Progress'}
                </span>
              </div>
              <h2>{l.title}</h2>
            </div>

            <div className="lesson-body">
              {l.content.split('\n\n').map((block, bIdx) => renderBlock(block, bIdx))}
            </div>

            {/* Bottom Actions Bar */}
            <div className="lesson-article-footer">
              <div className="footer-action-left">
                <button
                  className={`btn ${isLessonCompleted ? 'ghost' : ''}`}
                  onClick={() => toggle(c.id, l.id)}
                >
                  {isLessonCompleted ? '✓ Completed (Click to Undo)' : 'Mark as Completed'}
                </button>
              </div>

              <div className="footer-action-nav">
                {idx > 0 && (
                  <button className="btn ghost" onClick={handlePrev}>
                    ← Previous
                  </button>
                )}
                {idx < totalLessons - 1 ? (
                  <button className="btn" onClick={handleNext}>
                    Next Module →
                  </button>
                ) : (
                  <Link className="btn" to={`/courses/${c.id}/quiz`}>
                    Take Quiz 🏆
                  </Link>
                )}
              </div>
            </div>
          </article>
        </main>
      </div>
    </div>
  );
}
