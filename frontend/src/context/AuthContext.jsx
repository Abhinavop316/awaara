import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/authApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('awaara_user_token') || null);
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('awaara_user_info');
    return saved ? JSON.parse(saved) : null;
  });
  const [isLoading, setIsLoading] = useState(false);

  // Verify session on mount if token exists
  useEffect(() => {
    const verifySession = async () => {
      if (!token) return;
      try {
        const response = await authApi.getMe(token);
        if (response && response.success && response.user) {
          setUser(response.user);
          localStorage.setItem('awaara_user_info', JSON.stringify(response.user));
        } else {
          // Token expired or invalid
          logout();
        }
      } catch (err) {
        console.warn('Session verification failed:', err);
      }
    };

    verifySession();
  }, [token]);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const response = await authApi.login({ email, password });
      if (response && response.success && response.token) {
        setToken(response.token);
        setUser(response.user);
        localStorage.setItem('awaara_user_token', response.token);
        localStorage.setItem('awaara_user_info', JSON.stringify(response.user));
        return { success: true, message: response.message || 'Logged in successfully!' };
      }
      return { success: false, message: response.message || 'Invalid email or password.' };
    } catch (err) {
      return { success: false, message: 'Login failed. Please try again.' };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData) => {
    setIsLoading(true);
    try {
      const response = await authApi.register(userData);
      if (response && response.success && response.token) {
        setToken(response.token);
        setUser(response.user);
        localStorage.setItem('awaara_user_token', response.token);
        localStorage.setItem('awaara_user_info', JSON.stringify(response.user));
        return { success: true, message: response.message || 'Account created successfully!' };
      }
      return { success: false, message: response.message || 'Registration failed.' };
    } catch (err) {
      return { success: false, message: 'Registration error. Please try again.' };
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (profileData) => {
    if (!token) return { success: false, message: 'Not logged in.' };
    setIsLoading(true);
    try {
      const response = await authApi.updateProfile(token, profileData);
      if (response && response.success && response.user) {
        setUser(response.user);
        localStorage.setItem('awaara_user_info', JSON.stringify(response.user));
        return { success: true, message: 'Profile updated successfully!' };
      }
      return { success: false, message: response.message || 'Failed to update profile.' };
    } catch (err) {
      return { success: false, message: 'Update error.' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('awaara_user_token');
    localStorage.removeItem('awaara_user_info');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(token && user),
        isLoading,
        login,
        register,
        updateProfile,
        logout
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
