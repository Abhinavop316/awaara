import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export const LoginScreen = () => {
  const { login, expectedUsername } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Please enter both Administrator ID and Password.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const result = login(username.trim(), password);
      if (!result.success) {
        setError(result.error);
        setIsLoading(false);
      }
    }, 400);
  };

  const handleQuickFill = () => {
    setUsername(import.meta.env.VITE_ADMIN_USERNAME || 'admin');
    setPassword(import.meta.env.VITE_ADMIN_PASSWORD || 'admin123');
    setError('');
  };

  return (
    <div className="login-wrap">
      <div className="login-card">
        <div className="login-logo">AWAARA</div>
        <p className="login-sub">Trip, Fleet & Bus Layout Administration</p>

        <div className="login-demo-box">
          <div style={{ fontWeight: 700, marginBottom: '4px', color: 'var(--coral-dark)' }}>
            🔐 Authentication from .env
          </div>
          <div>Admin ID: <code>{expectedUsername}</code></div>
          <button
            type="button"
            className="btn btn-sm btn-outline"
            style={{ marginTop: '8px', width: '100%' }}
            onClick={handleQuickFill}
          >
            ⚡ Quick-Fill Credentials
          </button>
        </div>

        {error && (
          <div
            style={{
              background: '#ffe5e5',
              border: '1px solid #f5c2c7',
              color: '#842029',
              padding: '12px 16px',
              borderRadius: '8px',
              fontSize: '13px',
              marginBottom: '20px'
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '18px' }}>
            <label>Administrator ID</label>
            <input
              type="text"
              placeholder="e.g. admin"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoFocus
            />
          </div>

          <div className="form-group" style={{ marginBottom: '26px' }}>
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '14px', fontSize: '15px' }}
            disabled={isLoading}
          >
            {isLoading ? 'Verifying...' : 'Sign In to Operations →'}
          </button>
        </form>
      </div>
    </div>
  );
};
