const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const tripApi = {
  // Fetch all trips from backend
  async getAllTrips() {
    try {
      const response = await fetch(`${API_BASE_URL}/trips`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.warn('Backend trip API error (falling back to local cache):', error.message);
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
      console.warn('Backend getTripById error:', error.message);
      return { success: false, error: error.message };
    }
  },

  // Create a new trip
  async createTrip(tripData) {
    try {
      const response = await fetch(`${API_BASE_URL}/trips`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(tripData)
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.warn('Backend createTrip error:', error.message);
      return { success: false, error: error.message };
    }
  },

  // Update a trip
  async updateTrip(id, tripData) {
    try {
      const response = await fetch(`${API_BASE_URL}/trips/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(tripData)
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.warn('Backend updateTrip error:', error.message);
      return { success: false, error: error.message };
    }
  },

  // Delete a trip
  async deleteTrip(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/trips/${id}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.warn('Backend deleteTrip error:', error.message);
      return { success: false, error: error.message };
    }
  },

  // Seed default trips in backend
  async seedTrips() {
    try {
      const response = await fetch(`${API_BASE_URL}/trips/seed`, {
        method: 'POST'
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.warn('Backend seedTrips error:', error.message);
      return { success: false, error: error.message };
    }
  }
};
