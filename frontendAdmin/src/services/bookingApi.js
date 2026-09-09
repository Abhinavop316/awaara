const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const bookingApi = {
  // Get all bookings for manifest with optional trip, status, or search filters
  async getAllBookings(params = {}) {
    try {
      const query = new URLSearchParams();
      if (params.tripId && params.tripId !== 'all') query.append('tripId', params.tripId);
      if (params.status && params.status !== 'all') query.append('status', params.status);
      if (params.search) query.append('search', params.search);

      const url = `${API_BASE_URL}/bookings${query.toString() ? `?${query.toString()}` : ''}`;
      const response = await fetch(url);
      const data = await response.json();
      return data;
    } catch (error) {
      console.warn('Get all bookings API error:', error);
      return { success: false, bookings: [] };
    }
  },

  // Cancel booking from admin panel
  async cancelBooking(bookingId) {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}/cancel`, {
        method: 'PUT'
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.warn('Cancel booking API error:', error);
      return { success: false, message: 'Network error cancelling booking.' };
    }
  }
};
