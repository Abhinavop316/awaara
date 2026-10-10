import React, { useState, useEffect, useRef } from 'react';
import { ModalWrapper } from '../common/ModalWrapper';
import { CustomSelect } from '../common/CustomSelect';
import { useAdminData } from '../../context/AdminDataContext';
import {
  MapPin,
  Users,
  Sparkles,
  UploadCloud,
  Link as LinkIcon,
  X,
  Calendar,
  Compass,
  Check
} from 'lucide-react';

export const TripModal = ({ isOpen, onClose, tripToEdit, showToast }) => {
  const { addTrip, updateTrip } = useAdminData();

  const [formData, setFormData] = useState({
    name: '',
    source: 'Delhi NCR',
    destination: '',
    price: 19999,
    dates: '10–15 Nov 2026',
    duration: '5 Days',
    status: 'open',
    highlight: 'Curated luxury travel experience',
    seats: 20,
    month: 'Nov',
    experience: 'Adventure',
    img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80'
  });

  // Image Upload Mode state ('upload' | 'url')
  const [imageInputMode, setImageInputMode] = useState('upload');
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (tripToEdit) {
      setFormData({
        ...tripToEdit,
        seats: tripToEdit.seats || 20
      });
    } else {
      setFormData({
        name: '',
        source: 'Delhi NCR',
        destination: '',
        price: 19999,
        dates: '10–15 Nov 2026',
        duration: '5 Days',
        status: 'open',
        highlight: 'Curated luxury travel experience',
        seats: 20,
        month: 'Nov',
        experience: 'Adventure',
        img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80'
      });
    }
  }, [tripToEdit, isOpen]);

  // Handle file drop / file pick conversion to Data URL
  const processImageFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (.jpg, .png, .webp, .svg).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      setFormData((prev) => ({ ...prev, img: dataUrl }));
      showToast('Image uploaded successfully!');
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processImageFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      processImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.destination.trim()) {
      alert('Please fill out Trip Name and Destination.');
      return;
    }

    const payload = {
      ...formData,
      price: Number(formData.price) || 19999,
      seats: Number(formData.seats) || 20
    };

    if (tripToEdit) {
      updateTrip(tripToEdit.id, payload);
      showToast(`Trip "${formData.name}" updated successfully!`);
    } else {
      addTrip(payload);
      showToast(`New trip "${formData.name}" created!`);
    }

    onClose();
  };

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title={tripToEdit ? `Edit Trip: ${tripToEdit.name}` : 'Create New Curated Trip'}
      subtitle="Configure departure dates, pricing, passenger capacity, and trip highlights"
      maxWidth="780px"
    >
      <form onSubmit={handleSubmit}>
        <div className="modal-body">
          <div className="form-grid">
            <div className="form-group full">
              <label>Trip Title / Name *</label>
              <input
                type="text"
                placeholder="e.g. Manali Alpine Retreat"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Departure City / Source *</label>
              <input
                type="text"
                placeholder="e.g. Delhi NCR"
                value={formData.source}
                onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Destination Location *</label>
              <input
                type="text"
                placeholder="e.g. Manali & Solang"
                value={formData.destination}
                onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Price Per Person (₹) *</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value, 10) || 0 })}
                required
              />
            </div>

            <div className="form-group">
              <label>Available Capacity (Seats / Travelers)</label>
              <input
                type="number"
                value={formData.seats}
                onChange={(e) => setFormData({ ...formData, seats: parseInt(e.target.value, 10) || 1 })}
                min="1"
                required
              />
            </div>

            <div className="form-group">
              <label>Trip Dates</label>
              <input
                type="text"
                placeholder="e.g. 15–20 Oct 2026"
                value={formData.dates}
                onChange={(e) => setFormData({ ...formData, dates: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Duration</label>
              <input
                type="text"
                placeholder="e.g. 5 Days / 4 Nights"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Booking Status</label>
              <CustomSelect
                value={formData.status}
                onChange={(val) => setFormData({ ...formData, status: val })}
                options={[
                  { value: 'open', label: 'Booking Open', color: '#16a34a', badge: 'Active' },
                  { value: 'limited', label: 'Limited Seats', color: '#ea580c', badge: 'Filling Fast' },
                  { value: 'soldout', label: 'Sold Out', color: '#dc2626', badge: 'Full' }
                ]}
              />
            </div>

            <div className="form-group">
              <label>Primary Experience Type</label>
              <CustomSelect
                value={formData.experience}
                onChange={(val) => setFormData({ ...formData, experience: val })}
                icon={Compass}
                options={[
                  { value: 'Adventure', label: 'Adventure' },
                  { value: 'Relaxation', label: 'Relaxation' },
                  { value: 'Culture', label: 'Culture' }
                ]}
              />
            </div>

            <div className="form-group">
              <label>Travel Month</label>
              <CustomSelect
                value={formData.month}
                onChange={(val) => setFormData({ ...formData, month: val })}
                icon={Calendar}
                options={[
                  { value: 'Oct', label: 'October 2026' },
                  { value: 'Nov', label: 'November 2026' },
                  { value: 'Dec', label: 'December 2026' },
                  { value: 'Jan', label: 'January 2027' },
                  { value: 'Feb', label: 'February 2027' }
                ]}
              />
            </div>

            <div className="form-group full">
              <label>Highlight Tagline</label>
              <input
                type="text"
                placeholder="e.g. Scenic mountain stays included"
                value={formData.highlight}
                onChange={(e) => setFormData({ ...formData, highlight: e.target.value })}
              />
            </div>

            {/* DUAL IMAGE UPLOADER: DRAG & DROP + LINK URL */}
            <div className="form-group full">
              <div className="image-uploader-label-row">
                <label style={{ margin: 0 }}>Cover Image</label>
                <div className="image-mode-tabs">
                  <button
                    type="button"
                    className={`image-tab-btn ${imageInputMode === 'upload' ? 'active' : ''}`}
                    onClick={() => setImageInputMode('upload')}
                  >
                    <UploadCloud size={13} /> Drag & Drop / File
                  </button>
                  <button
                    type="button"
                    className={`image-tab-btn ${imageInputMode === 'url' ? 'active' : ''}`}
                    onClick={() => setImageInputMode('url')}
                  >
                    <LinkIcon size={13} /> Image Link URL
                  </button>
                </div>
              </div>

              <div className="image-uploader-container">
                {/* Drag & Drop Mode */}
                {imageInputMode === 'upload' ? (
                  <div
                    className={`image-dropzone ${isDraggingOver ? 'is-dragover' : ''}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current && fileInputRef.current.click()}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileInputChange}
                      accept="image/*"
                      style={{ display: 'none' }}
                    />
                    <div className="dropzone-content">
                      <div className="dropzone-icon-circle">
                        <UploadCloud size={24} color="var(--coral)" />
                      </div>
                      <div className="dropzone-text">
                        <strong>Drag & drop an image here</strong> or <span className="browse-link">browse files</span>
                      </div>
                      <span className="dropzone-hint">Supports JPG, PNG, WEBP, or SVG</span>
                    </div>
                  </div>
                ) : (
                  /* URL Input Mode */
                  <div className="image-url-input-wrap">
                    <div className="url-input-icon-field">
                      <LinkIcon size={16} color="#8c8275" />
                      <input
                        type="url"
                        placeholder="Paste image web URL (e.g. https://images.unsplash.com/...)"
                        value={formData.img}
                        onChange={(e) => setFormData({ ...formData, img: e.target.value })}
                      />
                    </div>
                    <span className="dropzone-hint" style={{ marginTop: '6px', display: 'block' }}>
                      Paste any direct HTTPS image link to display as the cover banner
                    </span>
                  </div>
                )}

                {/* Live Preview Card */}
                {formData.img && (
                  <div className="image-live-preview-card">
                    <img
                      src={formData.img}
                      alt="Cover Preview"
                      className="preview-img-thumbnail"
                      onError={(e) => {
                        e.target.src =
                          'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80';
                      }}
                    />
                    <div className="preview-img-meta">
                      <div className="preview-badge-row">
                        <span className="preview-badge-status">
                          <Check size={11} /> Cover Image Ready
                        </span>
                        <span className="preview-badge-source">
                          {formData.img.startsWith('data:') ? 'Uploaded File' : 'External Link'}
                        </span>
                      </div>
                      <span className="preview-url-text">
                        {formData.img.startsWith('data:')
                          ? 'Local image encoded in high resolution'
                          : formData.img}
                      </span>
                    </div>
                    <button
                      type="button"
                      className="preview-remove-btn"
                      title="Clear image"
                      onClick={() => setFormData({ ...formData, img: '' })}
                    >
                      <X size={15} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-outline" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            {tripToEdit ? 'Save Trip Changes' : 'Create Curated Trip'}
          </button>
        </div>
      </form>
    </ModalWrapper>
  );
};
