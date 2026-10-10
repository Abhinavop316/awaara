import React, { useState, useEffect } from 'react';
import { enquiryApi } from '../../services/enquiryApi';

export const PlaceEnquiryModal = ({ place, isOpen, onClose, onSuccessToast }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    timing: 'Next 30–60 Days',
    passengers: 2,
    departureCity: 'Delhi NCR',
    specialRequests: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleClose = () => {
    setIsSuccess(false);
    setErrorMessage('');
    onClose();
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  if (!isOpen || !place) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
      setErrorMessage('Please fill out your Name, Email, and Phone Number.');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        timing: formData.timing,
        passengers: Number(formData.passengers) || 1,
        departureCity: formData.departureCity,
        placeId: place._id || place.id || '',
        placeName: place.name,
        state: place.state || '',
        city: place.city || '',
        duration: place.days || `${place.durationDays || 5} Days`,
        estimatedPrice: place.price || 0,
        specialRequests: formData.specialRequests
      };

      const res = await enquiryApi.createEnquiry(payload);

      if (res && res.success) {
        setIsSuccess(true);
        if (onSuccessToast) {
          onSuccessToast(`Enquiry submitted for ${place.name}`);
        }
      } else {
        setErrorMessage(res?.message || 'Failed to submit enquiry. Please try again.');
      }
    } catch (err) {
      console.error('Enquiry submission error:', err);
      setErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop place-modal-backdrop" onClick={handleClose}>
      <div
        className="modal-card enquiry-modal-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <button
          className="modal-close place-modal-close"
          onClick={handleClose}
          aria-label="Close modal"
        >
          &times;
        </button>

        {isSuccess ? (
          /* SUCCESS STATE VIEW */
          <div className="enquiry-success-view">
            <div className="enquiry-success-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>

            <h3 className="enquiry-success-title">Enquiry Received</h3>
            <p className="enquiry-success-desc">
              Thank you, <strong>{formData.name}</strong>. We have received your enquiry for{' '}
              <strong>{place.name}</strong>.
            </p>

            <div className="enquiry-success-details-card">
              <div className="enquiry-summary-badge">Next Steps</div>
              <p className="enquiry-summary-text">
                Our holiday concierge team is reviewing your preferences and will get in touch on{' '}
                <strong>{formData.phone}</strong> with customized itinerary details and pricing.
              </p>
            </div>

            <button className="btn btn-primary enquiry-done-btn" onClick={handleClose}>
              Done
            </button>
          </div>
        ) : (
          /* ENQUIRY FORM VIEW */
          <div className="enquiry-form-container">
            {/* Header with Place Mini-Card */}
            <div className="enquiry-modal-header">
              <div className="enquiry-header-badge">
                <span>✨ Custom Holiday Enquiry</span>
              </div>
              <h2 className="enquiry-modal-title">Enquire for {place.name}</h2>
              <p className="enquiry-modal-sub">
                Tell us your travel dates and passenger count. We will send the complete customized
                itinerary and best available quote directly to your inbox!
              </p>

              <div className="enquiry-place-strip">
                <img
                  src={place.img}
                  alt={place.name}
                  className="enquiry-place-strip-thumb"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80';
                  }}
                />
                <div className="enquiry-place-strip-info">
                  <strong>{place.city}, {place.state}</strong>
                  <div className="strip-tags">
                    <span>⏱️ {place.days || `${place.durationDays || 5} Days`}</span>
                    <span>💰 From ₹{place.price?.toLocaleString('en-IN') || '11,999'}/person</span>
                  </div>
                </div>
              </div>
            </div>

            {errorMessage && (
              <div className="enquiry-error-banner">
                <span>⚠️ {errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="enquiry-form">
              <div className="enquiry-fields-grid">
                {/* Full Name */}
                <div className="enquiry-form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Aarav Sharma"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                {/* Email Address */}
                <div className="enquiry-form-group">
                  <label>Email Address *</label>
                  <input
                    type="email"
                    placeholder="e.g. aarav@gmail.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>

                {/* Phone Number */}
                <div className="enquiry-form-group">
                  <label>Phone Number *</label>
                  <input
                    type="tel"
                    placeholder="e.g. +91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                </div>

                {/* Number of Passengers */}
                <div className="enquiry-form-group">
                  <label>Number of Travelers *</label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={formData.passengers}
                    onChange={(e) => setFormData({ ...formData, passengers: e.target.value })}
                    required
                  />
                </div>

                {/* Travel Timing / Preferred Dates */}
                <div className="enquiry-form-group">
                  <label>Preferred Travel Timing / Month</label>
                  <input
                    type="text"
                    placeholder="e.g. Next Weekend, Diwali, or 15 Nov"
                    value={formData.timing}
                    onChange={(e) => setFormData({ ...formData, timing: e.target.value })}
                  />
                </div>

                {/* Departure / Pickup City */}
                <div className="enquiry-form-group">
                  <label>Departure / Pickup City</label>
                  <input
                    type="text"
                    placeholder="e.g. Delhi NCR, Mumbai, Bengaluru"
                    value={formData.departureCity}
                    onChange={(e) => setFormData({ ...formData, departureCity: e.target.value })}
                  />
                </div>
              </div>

              {/* Special Requests */}
              <div className="enquiry-form-group full-width">
                <label>Custom Requirements / Notes (Optional)</label>
                <textarea
                  rows="2"
                  placeholder="e.g. Luxury 5-star resort preference, vegetarian meals, airport transfer required..."
                  value={formData.specialRequests}
                  onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                ></textarea>
              </div>

              {/* Submit Button */}
              <div className="enquiry-modal-actions">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={handleClose}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary enquiry-submit-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="spinner-sm" style={{ borderColor: '#ffffff', borderRightColor: 'transparent' }}></div>
                      <span>Submitting Enquiry...</span>
                    </>
                  ) : (
                    <span>Submit Holiday Enquiry →</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
