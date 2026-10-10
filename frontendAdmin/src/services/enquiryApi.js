const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export const enquiryApi = {
  // Fetch all enquiries with filters
  async getAllEnquiries(params = {}) {
    try {
      const query = new URLSearchParams(params).toString();
      const response = await fetch(`${API_BASE_URL}/enquiries?${query}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.warn("Backend enquiry API error:", error.message);
      return { success: false, error: error.message };
    }
  },

  // Update enquiry status
  async updateStatus(id, status, notes = "") {
    try {
      const response = await fetch(`${API_BASE_URL}/enquiries/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status, notes }),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.warn("Backend updateStatus error:", error.message);
      return { success: false, error: error.message };
    }
  },

  // Resend email confirmation
  async resendConfirmation(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/enquiries/${id}/resend`, {
        method: "POST",
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.warn("Backend resend error:", error.message);
      return { success: false, error: error.message };
    }
  },

  // Delete enquiry
  async deleteEnquiry(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/enquiries/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.warn("Backend delete enquiry error:", error.message);
      return { success: false, error: error.message };
    }
  },
};
