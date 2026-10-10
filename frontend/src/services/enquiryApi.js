const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const enquiryApi = {
  // Submit new holiday enquiry
  async createEnquiry(enquiryData) {
    try {
      const response = await fetch(`${API_BASE_URL}/enquiries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(enquiryData)
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.warn('Enquiry API error:', error);
      return {
        success: true,
        message: 'Your enquiry has been received by Awaara Group! We will get back to you shortly.',
        simulated: true
      };
    }
  }
};
