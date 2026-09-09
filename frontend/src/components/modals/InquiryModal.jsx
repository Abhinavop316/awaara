import React, { useState, useEffect } from 'react';
import { ModalWrapper } from './ModalWrapper';

export const InquiryModal = ({ destination, isOpen, onClose, onExplorePlanned, onGoHome }) => {
  const [step, setStep] = useState(1);
  const [month, setMonth] = useState('');
  const [group, setGroup] = useState('');
  const [formData, setFormData] = useState({ name: '', mobile: '', email: '' });
  const [errors, setErrors] = useState({});
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setMonth('');
      setGroup('');
      setFormData({ name: '', mobile: '', email: '' });
      setErrors({});
      setIsSuccess(false);
    }
  }, [isOpen, destination]);

  if (!destination) return null;

  const months = ['October', 'November', 'December', 'January', 'February', 'Flexible'];
  const groups = ['1 (Solo)', '2 (Couple)', '3–5 (Small Group)', '6+ (Large Group)'];

  const validateDetails = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Please enter your name.';
    if (!/^\d{7,}$/.test(formData.mobile.replace(/\D/g, '')))
      newErrors.mobile = 'Please enter a valid mobile number.';
    if (!/^\S+@\S+\.\S+$/.test(formData.email))
      newErrors.email = 'Please enter a valid email address.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNotifySubmit = () => {
    if (!validateDetails()) return;

    const inquiryRecord = {
      destination: destination.name,
      month,
      group,
      name: formData.name,
      mobile: formData.mobile,
      email: formData.email,
      date: new Date().toISOString()
    };

    const inquiries = JSON.parse(localStorage.getItem('awaara_inquiries') || '[]');
    inquiries.push(inquiryRecord);
    localStorage.setItem('awaara_inquiries', JSON.stringify(inquiries));

    setIsSuccess(true);
  };

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose}>
      {!isSuccess && step === 1 && (
        <div className="booking-body">
          <h3>Tell Us You're Interested</h3>
          <div className="policy-box" style={{ marginTop: 0 }}>
            Destination selected: <strong>{destination.name}</strong> ({destination.season})
          </div>
          <p style={{ fontSize: '14.5px', color: '#6b6459', margin: '14px 0 24px', lineHeight: 1.6 }}>
            {destination.desc}
          </p>
          <div className="booking-nav" style={{ justifyContent: 'flex-end' }}>
            <button className="btn btn-primary" onClick={() => setStep(2)}>
              Continue
            </button>
          </div>
        </div>
      )}

      {!isSuccess && step === 2 && (
        <div className="booking-body">
          <h3>When would you like to travel?</h3>
          <div className="inquiry-options">
            {months.map((m) => (
              <button
                key={m}
                className={`opt-btn ${month === m ? 'selected' : ''}`}
                onClick={() => setMonth(m)}
              >
                {m}
              </button>
            ))}
          </div>
          <div className="booking-nav">
            <span className="link-back" onClick={() => setStep(1)}>
              ← Back
            </span>
            <button
              className="btn btn-primary"
              disabled={!month}
              onClick={() => setStep(3)}
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {!isSuccess && step === 3 && (
        <div className="booking-body">
          <h3>Who's coming?</h3>
          <div className="inquiry-options">
            {groups.map((g) => (
              <button
                key={g}
                className={`opt-btn ${group === g ? 'selected' : ''}`}
                onClick={() => setGroup(g)}
              >
                {g}
              </button>
            ))}
          </div>
          <div className="booking-nav">
            <span className="link-back" onClick={() => setStep(2)}>
              ← Back
            </span>
            <button
              className="btn btn-primary"
              disabled={!group}
              onClick={() => setStep(4)}
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {!isSuccess && step === 4 && (
        <div className="booking-body">
          <h3>Your Details</h3>
          <div className="form-grid">
            <div className={`form-field full ${errors.name ? 'error' : ''}`}>
              <label>Full Name *</label>
              <input
                type="text"
                placeholder="Enter your name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              {errors.name && <span className="error-msg">{errors.name}</span>}
            </div>

            <div className={`form-field ${errors.mobile ? 'error' : ''}`}>
              <label>Mobile Number *</label>
              <input
                type="tel"
                placeholder="+91 98765 43210"
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
              />
              {errors.mobile && <span className="error-msg">{errors.mobile}</span>}
            </div>

            <div className={`form-field ${errors.email ? 'error' : ''}`}>
              <label>Email Address *</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              {errors.email && <span className="error-msg">{errors.email}</span>}
            </div>
          </div>

          <div className="booking-nav">
            <span className="link-back" onClick={() => setStep(3)}>
              ← Back
            </span>
            <button className="btn btn-primary" onClick={handleNotifySubmit}>
              Notify Me
            </button>
          </div>
        </div>
      )}

      {isSuccess && (
        <div className="success-wrap">
          <div style={{ fontSize: '44px', marginBottom: '10px' }}>✨</div>
          <h2>You're on the list!</h2>
          <p className="sub">We'll let you know the moment this trip goes live.</p>

          <div className="success-card">
            <div className="success-row">
              <span>Destination</span>
              <strong>{destination.name}</strong>
            </div>
            <div className="success-row">
              <span>Preferred month</span>
              <span>{month}</span>
            </div>
            <div className="success-row">
              <span>Travelers</span>
              <span>{group}</span>
            </div>
            <div className="success-row">
              <span>Notification channels</span>
              <span>Email & WhatsApp</span>
            </div>
          </div>

          <div className="success-btns">
            <button
              className="btn btn-dark"
              onClick={() => {
                onClose();
                onExplorePlanned();
              }}
            >
              Explore Planned Trips
            </button>
            <button
              className="btn btn-outline"
              onClick={() => {
                onClose();
                onGoHome();
              }}
            >
              Back Home
            </button>
          </div>
        </div>
      )}
    </ModalWrapper>
  );
};
