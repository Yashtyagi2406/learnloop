import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isLogin) {
        await api.login(email, password);
      } else {
        await api.register(email, password);
      }
      navigate('/');
      window.location.reload();
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 440, margin: '40px auto' }}>
      <div className="panel fade">
        <div style={{ marginBottom: 20 }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--acc)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            LearnLoop
          </span>
          <h2 style={{ margin: '4px 0 6px' }}>{isLogin ? 'Sign in to LearnLoop' : 'Create an account'}</h2>
          <p style={{ color: 'var(--mute)', margin: 0 }}>
            {isLogin
              ? 'Sign in to save and sync your learning progress.'
              : 'Register to start tracking your courses across devices.'}
          </p>
        </div>

        {error && (
          <div
            style={{
              padding: '10px 14px',
              borderRadius: 6,
              background: 'color-mix(in srgb, var(--bad) 12%, transparent)',
              border: '1px solid var(--bad)',
              color: 'var(--bad)',
              marginBottom: 16,
              fontSize: '0.95rem',
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 14 }}>
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontSize: '0.9rem', fontWeight: 600 }}>
              Email address
            </label>
            <input
              type="email"
              className="search"
              style={{ width: '100%', maxWidth: 'none' }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: 6, fontSize: '0.9rem', fontWeight: 600 }}>
              Password
            </label>
            <input
              type="password"
              className="search"
              style={{ width: '100%', maxWidth: 'none' }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>

          <div style={{ marginTop: 10 }}>
            <button
              type="submit"
              className="btn"
              style={{ width: '100%' }}
              disabled={loading}
            >
              {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </div>
        </form>

        <div style={{ marginTop: 20, textAlign: 'center', fontSize: '0.9rem' }}>
          {isLogin ? (
            <span>
              Don't have an account?{' '}
              <button
                type="button"
                className="btn ghost"
                style={{ padding: '4px 8px', fontSize: '0.9rem', border: 'none', color: 'var(--acc)' }}
                onClick={() => {
                  setIsLogin(false);
                  setError(null);
                }}
              >
                Register
              </button>
            </span>
          ) : (
            <span>
              Already have an account?{' '}
              <button
                type="button"
                className="btn ghost"
                style={{ padding: '4px 8px', fontSize: '0.9rem', border: 'none', color: 'var(--acc)' }}
                onClick={() => {
                  setIsLogin(true);
                  setError(null);
                }}
              >
                Sign in
              </button>
            </span>
          )}
        </div>


      </div>
    </div>
  );
}
