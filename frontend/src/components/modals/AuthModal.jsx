import React, { useState, useEffect } from 'react';
import { ModalWrapper } from './ModalWrapper';
import { useAuth } from '../../context/AuthContext';

export const AuthModal = ({ isOpen, onClose, initialMode = 'login', onSuccess, showToast }) => {
  const { login, register, isLoading } = useAuth();
  const [mode, setMode] = useState(initialMode); // 'login' | 'register'
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const [formErrors, setFormErrors] = useState({});
  const [serverError, setServerError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setShowPassword(false);
      setShowConfirmPassword(false);
      setFormData({
        fullname: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
      });
      setFormErrors({});
      setServerError('');
    }
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: '' }));
    }
    setServerError('');
  };

  const validate = () => {
    const errors = {};
    if (!formData.email.trim()) {
      errors.email = 'Email address is required.';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address.';
    }

    if (!formData.password) {
      errors.password = 'Password is required.';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters.';
    }

    if (mode === 'register') {
      if (!formData.fullname.trim()) {
        errors.fullname = 'Full name is required.';
      }
      if (formData.phone && !/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
        errors.phone = 'Please enter a valid 10-digit phone number.';
      }
      if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match.';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    if (mode === 'login') {
      const res = await login(formData.email, formData.password);
      if (res.success) {
        if (showToast) showToast(res.message || 'Welcome back to Awaara!');
        if (onSuccess) onSuccess();
        onClose();
      } else {
        setServerError(res.message || 'Invalid email or password. Please try again.');
      }
    } else {
      const payload = {
        fullname: formData.fullname.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        password: formData.password
      };
      const res = await register(payload);
      if (res.success) {
        if (showToast) showToast('Account created! Welcome to Awaara.');
        if (onSuccess) onSuccess();
        onClose();
      } else {
        setServerError(res.message || 'Registration failed.');
      }
    }
  };

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} maxWidth="480px">
      <div className="auth-modal-wrapper">
        {/* Header Section with smooth mode animation */}
        <div className="auth-header">
          <div className="auth-pill-badge">
            <span className="sparkle">✦</span> AWAARA TRAVEL PASS <span className="sparkle">✦</span>
          </div>
          <div key={`header-${mode}`} className="auth-header-anim">
            <h2 className="auth-title">
              {mode === 'login' ? 'Welcome Back' : 'Create an Account'}
            </h2>
            <p className="auth-subtitle">
              {mode === 'login'
                ? 'Sign in to access your bookings, seat choices & trips.'
                : 'Join fellow explorers and unlock effortless travel booking.'}
            </p>
          </div>
        </div>

        {/* Tab Switcher with sliding active pill */}
        <div className="auth-tabs-container">
          <div className={`auth-tab-slider ${mode === 'register' ? 'slide-right' : ''}`} />
          <button
            type="button"
            className={`auth-tab-option ${mode === 'login' ? 'active' : ''}`}
            onClick={() => {
              setMode('login');
              setServerError('');
              setFormErrors({});
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`auth-tab-option ${mode === 'register' ? 'active' : ''}`}
            onClick={() => {
              setMode('register');
              setServerError('');
              setFormErrors({});
            }}
          >
            Create Account
          </button>
        </div>

        {serverError && (
          <div className="auth-error-alert">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            <span>{serverError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form-body">
          {/* 1. Full Name (Collapsible with smooth height transition) */}
          <div className={`auth-collapsible-wrap ${mode === 'register' ? 'is-expanded' : ''}`}>
            <div className="auth-collapsible-content">
              <div className={`auth-input-group ${formErrors.fullname ? 'has-error' : ''}`}>
                <label>Full Name *</label>
                <div className="auth-input-container">
                  <span className="auth-input-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                  </span>
                  <input
                    type="text"
                    placeholder="e.g. Aarav Sharma"
                    value={formData.fullname}
                    onChange={(e) => handleChange('fullname', e.target.value)}
                    tabIndex={mode === 'register' ? 0 : -1}
                  />
                </div>
                {formErrors.fullname && <span className="auth-field-error">{formErrors.fullname}</span>}
              </div>
            </div>
          </div>

          {/* 2. Email Address (Always visible) */}
          <div className={`auth-input-group ${formErrors.email ? 'has-error' : ''}`}>
            <label>Email Address *</label>
            <div className="auth-input-container">
              <span className="auth-input-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              </span>
              <input
                type="email"
                placeholder="e.g. aarav@example.com"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
              />
            </div>
            {formErrors.email && <span className="auth-field-error">{formErrors.email}</span>}
          </div>

          {/* 3. Phone Number (Collapsible with smooth height transition) */}
          <div className={`auth-collapsible-wrap ${mode === 'register' ? 'is-expanded' : ''}`}>
            <div className="auth-collapsible-content">
              <div className={`auth-input-group ${formErrors.phone ? 'has-error' : ''}`}>
                <label>Phone Number (Optional)</label>
                <div className="auth-input-container">
                  <span className="auth-input-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                  </span>
                  <input
                    type="tel"
                    placeholder="e.g. 9876543210"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    tabIndex={mode === 'register' ? 0 : -1}
                  />
                </div>
                {formErrors.phone && <span className="auth-field-error">{formErrors.phone}</span>}
              </div>
            </div>
          </div>

          {/* 4. Password (Always visible) */}
          <div className={`auth-input-group ${formErrors.password ? 'has-error' : ''}`}>
            <label>Password *</label>
            <div className="auth-input-container">
              <span className="auth-input-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
              />
              <button
                type="button"
                className="auth-pwd-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                ) : (
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                )}
              </button>
            </div>
            {formErrors.password && <span className="auth-field-error">{formErrors.password}</span>}
          </div>

          {/* 5. Confirm Password (Collapsible with smooth height transition) */}
          <div className={`auth-collapsible-wrap ${mode === 'register' ? 'is-expanded' : ''}`}>
            <div className="auth-collapsible-content">
              <div className={`auth-input-group ${formErrors.confirmPassword ? 'has-error' : ''}`}>
                <label>Confirm Password *</label>
                <div className="auth-input-container">
                  <span className="auth-input-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                  </span>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => handleChange('confirmPassword', e.target.value)}
                    tabIndex={mode === 'register' ? 0 : -1}
                  />
                  <button
                    type="button"
                    className="auth-pwd-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? (
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                    ) : (
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    )}
                  </button>
                </div>
                {formErrors.confirmPassword && (
                  <span className="auth-field-error">{formErrors.confirmPassword}</span>
                )}
              </div>
            </div>
          </div>

          <button
            type="submit"
            className={`auth-submit-btn ${isLoading ? 'is-loading' : ''}`}
            disabled={isLoading}
          >
            <span key={`btn-text-${mode}`} className="auth-btn-text-anim">
              {mode === 'login' ? 'Sign In to Account →' : 'Create My Account →'}
            </span>
          </button>
        </form>

        <div className="auth-footer-area">
          <div className="auth-divider">
            <span>or</span>
          </div>

          <div key={`footer-${mode}`} className="auth-switch-prompt auth-footer-anim">
            {mode === 'login' ? (
              <p>
                Don't have an account yet?{' '}
                <button
                  type="button"
                  className="auth-inline-link"
                  onClick={() => {
                    setMode('register');
                    setServerError('');
                  }}
                >
                  Sign Up
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  className="auth-inline-link"
                  onClick={() => {
                    setMode('login');
                    setServerError('');
                  }}
                >
                  Sign In
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
};

