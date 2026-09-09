import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [adminUser, setAdminUser] = useState(() => {
    const saved = localStorage.getItem('awaara_admin_auth');
    return saved ? JSON.parse(saved) : null;
  });

  const expectedUsername = import.meta.env.VITE_ADMIN_USERNAME || 'admin';
  const expectedPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123';
  const adminName = import.meta.env.VITE_ADMIN_NAME || 'Awaara Operations Lead';

  const login = (username, password) => {
    if (username === expectedUsername && password === expectedPassword) {
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
