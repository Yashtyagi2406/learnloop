import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import GradientBlinds from '../components/GradientBlinds';

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
      <div
        style={{
          width: '100%',
          height: '140px',
          position: 'relative',
          borderRadius: '14px 14px 0 0',
          overflow: 'hidden',
          background: '#0c0f1e'
        }}
      >
        <GradientBlinds
          gradientColors={['#FF9FFC', '#5227FF']}
          angle={0}
          noise={0.3}
          blindCount={12}
          blindMinWidth={45}
          spotlightRadius={0.5}
          spotlightSoftness={1}
          spotlightOpacity={1}
          mouseDampening={0.15}
          distortAmount={0}
          shineDirection="left"
          mixBlendMode="lighten"
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0, 0, 0, 0.25)',
            pointerEvents: 'none'
          }}
        >
          <span style={{ color: '#fff', fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.02em', textShadow: '0 2px 8px rgba(0,0,0,0.6)' }}>
            LearnLoop
          </span>
          <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.85rem' }}>
            Master skills step by step
          </span>
        </div>
      </div>
      <div className="panel fade" style={{ borderRadius: '0 0 14px 14px', borderTop: 'none' }}>
        <h2>{isLogin ? 'Sign in to LearnLoop' : 'Create an account'}</h2>
        <p style={{ color: 'var(--mute)', marginBottom: 20 }}>
          {isLogin
            ? 'Sign in to save and sync your learning progress.'
            : 'Register to start tracking your courses across devices.'}
        </p>

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
