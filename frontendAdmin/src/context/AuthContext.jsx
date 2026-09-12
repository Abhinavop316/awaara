import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [adminUser, setAdminUser] = useState(() => {
    const saved = localStorage.getItem('awaara_admin_auth');
    return saved ? JSON.parse(saved) : null;
  });

  const expectedUsername = import.meta.env.VITE_ADMIN_USERNAME || 'admin';
  const expectedPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123';
  const adminName = import.meta.env.VITE_ADMIN_NAME || 'Awaara Operations Lead';
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

  const login = async (username, password) => {
    try {
      // Try authenticating with backend API
      const response = await fetch(`${apiBaseUrl}/auth/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const userObj = {
          username: data.user?.email || username,
          name: data.user?.fullname || adminName,
          role: 'Operations Administrator',
          token: data.token,
          loginTime: new Date().toISOString()
        };
        setAdminUser(userObj);
        localStorage.setItem('awaara_admin_auth', JSON.stringify(userObj));
        if (data.token) {
          localStorage.setItem('awaara_admin_token', data.token);
        }
        return { success: true };
      }
    } catch (err) {
      console.warn('Backend authentication unreachable, evaluating local env credentials:', err.message);
    }

    // Fallback or offline environment match
    if (
      (username === expectedUsername || username === 'admin@awaara.com') &&
      password === expectedPassword
    ) {
      const userObj = {
        username,
        name: adminName,
        role: 'Operations Administrator',
        loginTime: new Date().toISOString()
      };
      setAdminUser(userObj);
      localStorage.setItem('awaara_admin_auth', JSON.stringify(userObj));
      return { success: true };
    }

    return {
      success: false,
      error: 'Invalid Administrator ID or Password. Check your .env configuration.'
    };
  };

  const logout = () => {
    setAdminUser(null);
    localStorage.removeItem('awaara_admin_auth');
    localStorage.removeItem('awaara_admin_token');
  };

  return (
    <AuthContext.Provider
      value={{
        adminUser,
        isAuthenticated: Boolean(adminUser),
        login,
        logout,
        expectedUsername
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
