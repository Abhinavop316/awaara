import React, { useState, useEffect } from 'react';
import { ModalWrapper } from './ModalWrapper';
import { useAuth } from '../../context/AuthContext';

export const UserProfileModal = ({ isOpen, onClose, showToast }) => {
  const { user, updateProfile, logout, isLoading } = useAuth();

  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    phone: '',
    gender: 'other',
    age: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });

  const [saveStatus, setSaveStatus] = useState({ success: null, message: '' });

  useEffect(() => {
    if (user) {
      setFormData({
        fullname: user.fullname || '',
        email: user.email || '',
        phone: user.phone || '',
        gender: user.gender || 'other',
        age: user.age ? String(user.age) : '',
        address: user.address || '',
        city: user.city || '',
        state: user.state || '',
        pincode: user.pincode || ''
      });
      setSaveStatus({ success: null, message: '' });
    }
  }, [user, isOpen]);

  if (!isOpen || !user) return null;

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaveStatus({ success: null, message: '' });

    const payload = {
      fullname: formData.fullname.trim(),
      phone: formData.phone.trim(),
      gender: formData.gender,
      age: formData.age ? Number(formData.age) : undefined,
      address: formData.address.trim(),
      city: formData.city.trim(),
      state: formData.state.trim(),
      pincode: formData.pincode.trim()
    };

    const res = await updateProfile(payload);
    if (res.success) {
      setSaveStatus({ success: true, message: 'Profile updated successfully!' });
      if (showToast) showToast('Profile details updated!');
      setTimeout(() => {
        onClose();
      }, 1200);
    } else {
      setSaveStatus({ success: false, message: res.message || 'Failed to save changes.' });
    }
  };

  const handleLogoutClick = () => {
    logout();
    if (showToast) showToast('Logged out successfully.');
    onClose();
  };

  const initials = user.fullname
    ? user.fullname
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'AW';

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} maxWidth="580px">
      <div className="profile-modal-wrapper">
        {/* User Card Header */}
        <div className="profile-hero-card">
          <div className="profile-avatar-circle">{initials}</div>
          <div className="profile-hero-info">
            <h2 className="profile-user-name">{user.fullname || 'Awaara Traveler'}</h2>
            <p className="profile-user-email">{user.email}</p>
            <div className="profile-badge-row">
              <span className="profile-verified-badge">✓ Verified Member</span>
              <span className="profile-tier-badge">✦ Explorer Tier</span>
            </div>
          </div>
        </div>

        {saveStatus.message && (
          <div
            className={`profile-alert ${
              saveStatus.success ? 'profile-alert-success' : 'profile-alert-error'
            }`}
          >
            {saveStatus.success ? '✓ ' : '⚠ '}
            {saveStatus.message}
          </div>
        )}

        <form onSubmit={handleSave} className="profile-form-body">
          <div className="profile-form-grid">
            <div className="profile-field full">
              <label>Full Name</label>
              <input
                type="text"
                value={formData.fullname}
                onChange={(e) => handleChange('fullname', e.target.value)}
                placeholder="Your Full Name"
                required
              />
            </div>

            <div className="profile-field">
              <label>Email Address</label>
              <input type="email" value={formData.email} disabled className="input-disabled" title="Email cannot be changed" />
            </div>

            <div className="profile-field">
              <label>Phone Number</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="e.g. 9876543210"
              />
            </div>

            <div className="profile-field">
              <label>Gender</label>
              <select
                value={formData.gender}
                onChange={(e) => handleChange('gender', e.target.value)}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other / Prefer not to say</option>
              </select>
            </div>

            <div className="profile-field">
              <label>Age</label>
              <input
                type="number"
                min="10"
                max="110"
                value={formData.age}
                onChange={(e) => handleChange('age', e.target.value)}
                placeholder="e.g. 26"
              />
            </div>

            <div className="profile-field full">
              <label>Street Address / City Area</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                placeholder="Flat / House / Landmark"
              />
            </div>

            <div className="profile-field">
              <label>City</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => handleChange('city', e.target.value)}
                placeholder="e.g. Mumbai"
              />
            </div>

            <div className="profile-field">
              <label>State</label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => handleChange('state', e.target.value)}
                placeholder="e.g. Maharashtra"
              />
            </div>
          </div>

          <div className="profile-actions-footer">
            <button
              type="button"
              className="profile-logout-btn"
              onClick={handleLogoutClick}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
              Log Out
            </button>

            <div className="profile-save-btns">
              <button type="button" className="profile-cancel-btn" onClick={onClose}>
                Cancel
              </button>
              <button
                type="submit"
                className={`profile-submit-btn ${isLoading ? 'is-loading' : ''}`}
                disabled={isLoading}
              >
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </div>
    </ModalWrapper>
  );
};
