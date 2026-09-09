const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const bookingApi = {
  // Create a new seat booking
  async createBooking(payload, token = null) {
    try {
      const headers = {
        'Content-Type': 'application/json'
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}/bookings`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      return {
        ok: response.ok,
        status: response.status,
        ...data
      };
    } catch (error) {
      console.warn('Booking creation API error:', error);
      return {
        success: false,
        ok: false,
        message: 'Network error or backend service currently unreachable.'
      };
    }
  },

  // Lock seat(s) temporarily for 10 minutes
  async lockSeats({ tripId, seatNumbers, sessionId, busId = null }) {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings/lock-seats`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ tripId, seatNumbers, sessionId, busId })
      });

      const data = await response.json();
      return {
        ok: response.ok,
        status: response.status,
        ...data
      };
    } catch (error) {
      console.warn('Seat lock API error:', error);
      return {
        success: false,
        ok: false,
        message: 'Unable to connect to seat reservation server.'
      };
    }
  },

  // Release held seats
  async releaseSeats({ tripId, sessionId, seatNumbers = null }) {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings/release-seats`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ tripId, sessionId, seatNumbers })
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.warn('Release seats API error:', error);
      return { success: false };
    }
  },

  // Get occupied seats for a trip in real-time (including 10-min active locks by other sessions)
  async getOccupiedSeats(tripId, busId = null, sessionId = null) {
    try {
      let url = `${API_BASE_URL}/bookings/occupied-seats/${encodeURIComponent(tripId)}`;
      const params = new URLSearchParams();
      if (busId) params.append('busId', busId);
      if (sessionId) params.append('sessionId', sessionId);
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await fetch(url);
      const data = await response.json();
      return data;
    } catch (error) {
      console.warn('Get occupied seats API error:', error);
      return {
        success: false,
        occupiedSeats: []
      };
    }
  },


  // Get user's bookings (either by auth token or email)
  async getMyBookings(token = null, email = null) {
    try {
      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      let url = `${API_BASE_URL}/bookings/my-bookings`;
      if (email) {
        url += `?email=${encodeURIComponent(email)}`;
      }

      const response = await fetch(url, { headers });
      const data = await response.json();
      return data;
    } catch (error) {
      console.warn('Get my bookings API error:', error);
      return {
        success: false,
        bookings: []
      };
    }
  },

  // Cancel booking
  async cancelBooking(bookingId) {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}/cancel`, {
        method: 'PUT'
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.warn('Cancel booking API error:', error);
      return {
        success: false,
        message: 'Network error while cancelling booking.'
      };
    }
  }
};
