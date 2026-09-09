const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const authApi = {
  // Register a new user
  async register(userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.warn('Register API error:', error);
      return { success: false, message: 'Network error or backend server is not running.' };
    }
  },

  // Login user
  async login(credentials) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.warn('Login API error:', error);
      return { success: false, message: 'Network error or backend server is not running.' };
    }
  },

  // Get current user profile (with Bearer Token)
  async getMe(token) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.warn('GetMe API error:', error);
      return { success: false, message: 'Failed to verify user session.' };
    }
  },

  // Update user profile
  async updateProfile(token, profileData) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.warn('Update Profile API error:', error);
      return { success: false, message: 'Failed to update profile.' };
    }
  }
};
