const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const tripApi = {
  // Fetch all trips from backend
  async getAllTrips() {
    try {
      const response = await fetch(`${API_BASE_URL}/trips`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.warn('Public Trip API error (falling back to local cache/data):', error.message);
      return { success: false, error: error.message };
    }
  },

  // Get trip by ID
  async getTripById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/trips/${id}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.warn('Public GetTripById error:', error.message);
      return { success: false, error: error.message };
    }
  }
};
