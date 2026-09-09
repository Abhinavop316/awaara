const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const busApi = {
  // Fetch all buses from backend
  async getAllBuses(params = {}) {
    try {
      const query = new URLSearchParams(params).toString();
      const url = `${API_BASE_URL}/buses${query ? `?${query}` : ''}`;
      const response = await fetch(url);
      const data = await response.json();
      return data;
    } catch (error) {
      console.warn('Backend bus API error (falling back to local cache):', error.message);
      return { success: false, error: error.message };
    }
  },

  // Get bus by ID
  async getBusById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/buses/${id}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.warn('Backend getBusById error:', error.message);
      return { success: false, error: error.message };
    }
  },

  // Create a new bus
  async createBus(busData) {
    try {
      const response = await fetch(`${API_BASE_URL}/buses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(busData)
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.warn('Backend createBus error:', error.message);
      return { success: false, error: error.message };
    }
  },

  // Update a bus
  async updateBus(id, busData) {
    try {
      const response = await fetch(`${API_BASE_URL}/buses/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(busData)
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.warn('Backend updateBus error:', error.message);
      return { success: false, error: error.message };
    }
  },

  // Delete a bus
  async deleteBus(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/buses/${id}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.warn('Backend deleteBus error:', error.message);
      return { success: false, error: error.message };
    }
  },

  // Seed default fleet in backend
  async seedBuses() {
    try {
      const response = await fetch(`${API_BASE_URL}/buses/seed`, {
        method: 'POST'
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.warn('Backend seedBuses error:', error.message);
      return { success: false, error: error.message };
    }
  }
};
