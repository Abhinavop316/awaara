const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const placeApi = {
  // Fetch all holiday destinations
  async getAllPlaces(params = {}) {
    try {
      const cleanParams = {};
      Object.keys(params).forEach((key) => {
        const val = params[key];
        if (val !== undefined && val !== null && val !== '' && val !== 'All' && val !== 'undefined') {
          cleanParams[key] = val;
        }
      });
      const query = new URLSearchParams(cleanParams).toString();
      const response = await fetch(`${API_BASE_URL}/places${query ? `?${query}` : ''}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.warn('Backend Place API error:', error.message);
      return { success: false, error: error.message };
    }
  },

  // Get place by ID
  async getPlaceById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/places/${id}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.warn('Backend getPlaceById error:', error.message);
      return { success: false, error: error.message };
    }
  },

  // Create new place / holiday package with itinerary
  async createPlace(placeData) {
    try {
      const response = await fetch(`${API_BASE_URL}/places`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(placeData)
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.warn('Backend createPlace error:', error.message);
      return { success: false, error: error.message };
    }
  },

  // Update a place
  async updatePlace(id, placeData) {
    try {
      const response = await fetch(`${API_BASE_URL}/places/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(placeData)
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.warn('Backend updatePlace error:', error.message);
      return { success: false, error: error.message };
    }
  },

  // Delete a place
  async deletePlace(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/places/${id}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.warn('Backend deletePlace error:', error.message);
      return { success: false, error: error.message };
    }
  },

  // Seed default places
  async seedPlaces() {
    try {
      const response = await fetch(`${API_BASE_URL}/places/seed`, {
        method: 'POST'
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.warn('Backend seedPlaces error:', error.message);
      return { success: false, error: error.message };
    }
  }
};
