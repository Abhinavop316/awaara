import React, { useState, useEffect, useRef } from 'react';
import { ModalWrapper } from '../common/ModalWrapper';
import { CustomSelect } from '../common/CustomSelect';
import { useAdminData } from '../../context/AdminDataContext';
import { countBookableSeats } from '../../utils/layoutHelpers';
import {
  Bus,
  AlertTriangle,
  CheckCircle,
  MapPin,
  Users,
  Sparkles,
  Plus,
  ChevronDown,
  Search,
  Check,
  ArrowRight,
  UploadCloud,
  Image as ImageIcon,
  Link as LinkIcon,
  X,
  FileImage,
  Calendar,
  Compass
} from 'lucide-react';

export const TripModal = ({ isOpen, onClose, tripToEdit, showToast, onOpenNewBus }) => {
  const { buses, templates, addTrip, updateTrip } = useAdminData();

  // Helper to compute total bookable seats for any bus object
  const getBusSeatCount = (bus) => {
    if (!bus) return 40;
    if (bus.totalSeats && Number(bus.totalSeats) > 0) return Number(bus.totalSeats);
    if (bus.templateId) {
      const tpl = templates.find((t) => t.id === bus.templateId);
      if (tpl) {
        const count = countBookableSeats(tpl);
        if (count > 0) return count;
      }
    }
    return 40;
  };

  const [formData, setFormData] = useState({
    name: '',
    source: 'Delhi NCR',
    destination: '',
    price: 19999,
    dates: '10–15 Nov 2026',
    duration: '5 Days',
    status: 'open',
    highlight: 'Curated experience',
    seats: 40,
    busId: '',
    month: 'Nov',
    experience: 'Adventure',
    img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80'
  });

  // Custom Bus Selector Dropdown state
  const [isBusDropdownOpen, setIsBusDropdownOpen] = useState(false);
  const [busSearchTerm, setBusSearchTerm] = useState('');
  const dropdownRef = useRef(null);

  // Image Upload Mode state ('upload' | 'url')
  const [imageInputMode, setImageInputMode] = useState('upload');
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const fileInputRef = useRef(null);

  // Selected bus object for live info display
  const selectedBus = buses.find((b) => b.id === formData.busId) || null;

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsBusDropdownOpen(false);
      }
    };
    if (isBusDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isBusDropdownOpen]);

  useEffect(() => {
    if (tripToEdit) {
      const busForEdit = buses.find((b) => b.id === tripToEdit.busId);
      const detectedSeats = busForEdit ? getBusSeatCount(busForEdit) : (tripToEdit.seats || 40);

      setFormData({
        ...tripToEdit,
        seats: detectedSeats
      });
    } else {
      const defaultBus = buses[0] || null;
      const initialSeats = defaultBus ? getBusSeatCount(defaultBus) : 40;

      setFormData({
        name: '',
        source: defaultBus?.source || 'Delhi NCR',
        destination: defaultBus?.destination || '',
        price: 19999,
        dates: '10–15 Nov 2026',
        duration: '5 Days',
        status: 'open',
        highlight: 'Curated luxury travel experience',
        seats: initialSeats,
        busId: defaultBus?.id || '',
        month: 'Nov',
        experience: 'Adventure',
        img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80'
      });
    }
  }, [tripToEdit, isOpen, buses, templates]);

  // Handler when admin changes the assigned bus coach
  const handleSelectBus = (bus) => {
    if (bus) {
      const detectedSeats = getBusSeatCount(bus);
      setFormData((prev) => ({
        ...prev,
        busId: bus.id,
        seats: detectedSeats,
        source: prev.source === 'Delhi NCR' && bus.source ? bus.source : prev.source,
        destination: (!prev.destination || prev.destination === '') && bus.destination ? bus.destination : prev.destination
      }));
      setIsBusDropdownOpen(false);
      showToast(`⚡ Auto-detected ${detectedSeats} seats from ${bus.busNumber}`);
    }
  };

  const filteredBuses = buses.filter((b) => {
    const q = busSearchTerm.toLowerCase();
    return (
      b.busNumber?.toLowerCase().includes(q) ||
      b.name?.toLowerCase().includes(q) ||
      b.source?.toLowerCase().includes(q) ||
      b.destination?.toLowerCase().includes(q)
    );
  });

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

    if (buses.length === 0) {
      alert('Please add a bus in Fleet Management first before creating a trip.');
      return;
    }

    if (!formData.busId) {
      alert('Please select an assigned bus coach for this trip.');
      return;
    }

    if (!formData.name.trim() || !formData.destination.trim()) {
      alert('Please fill out Trip Name and Destination.');
      return;
    }

    // Ensure seat count is locked to the assigned bus
    const bus = buses.find((b) => b.id === formData.busId);
    const finalSeats = bus ? getBusSeatCount(bus) : Number(formData.seats) || 40;

    const payload = {
      ...formData,
      seats: finalSeats
    };

    if (tripToEdit) {
      updateTrip(tripToEdit.id, payload);
      showToast(`Trip "${formData.name}" updated successfully (${finalSeats} seats)!`);
    } else {
      addTrip(payload);
      showToast(`New trip "${formData.name}" created with ${finalSeats} detected seats!`);
    }

    onClose();
  };

  // If no buses exist yet, display an empty state prompting the admin to add a bus first
  if (buses.length === 0) {
    return (
      <ModalWrapper
        isOpen={isOpen}
        onClose={onClose}
        title="Bus Registration Required"
        subtitle="A fleet coach must be added first before configuring trips"
        maxWidth="620px"
      >
        <div className="modal-body" style={{ padding: '32px 24px', textAlign: 'center' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'rgba(224, 102, 63, 0.12)',
              color: 'var(--coral)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 18px'
            }}
          >
            <Bus size={32} />
          </div>

          <h3 style={{ fontSize: '20px', color: 'var(--charcoal)', marginBottom: '8px' }}>
            No Buses Found in Fleet
          </h3>
          <p style={{ fontSize: '14.5px', color: '#7a7267', lineHeight: 1.6, maxWidth: '440px', margin: '0 auto 24px' }}>
            To create a trip, you must first register a bus coach. The trip will automatically detect available seats, AC specifications, and timing from that bus.
          </p>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                onClose();
                if (onOpenNewBus) onOpenNewBus();
              }}
            >
              <Plus size={16} /> Register New Bus First
            </button>
          </div>
        </div>
      </ModalWrapper>
    );
  }

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title={tripToEdit ? `Edit Trip: ${tripToEdit.name}` : 'Create New Curated Trip'}
      subtitle="Select an assigned bus coach to automatically detect seating layout and available seats"
      maxWidth="780px"
    >
      <form onSubmit={handleSubmit}>
        <div className="modal-body">
          {/* STEP 1: CUSTOM LUXURY BUS PICKER */}
          <div className="bus-select-hero-box" ref={dropdownRef}>
            <div className="bus-select-header">
              <div className="bus-select-title">
                <Bus size={18} color="var(--coral)" />
                <strong>Step 1: Assign Fleet Bus Coach *</strong>
              </div>
              {selectedBus && (
                <span className="bus-seats-badge">
                  <CheckCircle size={14} />
                  {formData.seats} Seats Auto-Detected
                </span>
              )}
            </div>

            {/* Custom Interactive Bus Card Trigger */}
            <div
              className={`custom-bus-trigger ${isBusDropdownOpen ? 'is-active' : ''}`}
              onClick={() => setIsBusDropdownOpen(!isBusDropdownOpen)}
              role="button"
              tabIndex={0}
            >
              {selectedBus ? (
                <div className="trigger-bus-info">
                  <div className="trigger-bus-top">
                    <span className="plate-badge">{selectedBus.busNumber}</span>
                    <strong className="trigger-bus-name">{selectedBus.name}</strong>
                    <span className="trigger-ac-tag">{selectedBus.acType || 'AC'}</span>
                  </div>
                  <div className="trigger-bus-sub">
                    <span className="trigger-route">
                      <MapPin size={13} color="var(--coral)" />
                      {selectedBus.source} <ArrowRight size={12} style={{ display: 'inline', margin: '0 2px' }} /> {selectedBus.destination}
                    </span>
                    <span className="trigger-seats-tag">
                      <Users size={12} /> {formData.seats} Bookable Seats
                    </span>
                  </div>
                </div>
              ) : (
                <div className="trigger-placeholder">
                  <Bus size={18} color="#8c8275" />
                  <span>Click to select an assigned coach from fleet...</span>
                </div>
              )}

              <div className="trigger-chevron-wrap">
                <span className="trigger-change-text">{selectedBus ? 'Change' : 'Select'}</span>
                <ChevronDown
                  size={18}
                  style={{
                    transform: isBusDropdownOpen ? 'rotate(180deg)' : 'none',
                    transition: 'transform 0.2s ease'
                  }}
                />
              </div>
            </div>

            {/* Custom Animated Bus Selection Dropdown Menu */}
            {isBusDropdownOpen && (
              <div className="custom-bus-dropdown-panel">
                {/* Search Bar inside Dropdown */}
                <div className="bus-dropdown-search">
                  <Search size={15} color="#8c8275" />
                  <input
                    type="text"
                    placeholder="Search coach by number plate, name, or city..."
                    value={busSearchTerm}
                    onChange={(e) => setBusSearchTerm(e.target.value)}
                    autoFocus
                    onClick={(e) => e.stopPropagation()}
                  />
                  {busSearchTerm && (
                    <button
                      type="button"
                      className="search-clear-btn"
                      onClick={() => setBusSearchTerm('')}
                    >
                      ×
                    </button>
                  )}
                </div>

                {/* Bus List Items */}
                <div className="bus-dropdown-list">
                  {filteredBuses.map((bus) => {
                    const busSeats = getBusSeatCount(bus);
                    const isSelected = bus.id === formData.busId;

                    return (
                      <div
                        key={bus.id}
                        className={`bus-option-card ${isSelected ? 'selected' : ''}`}
                        onClick={() => handleSelectBus(bus)}
                      >
                        <div className="bus-option-left">
                          <div className="bus-option-header-row">
                            <span className="plate-badge">{bus.busNumber}</span>
                            <strong className="bus-option-name">{bus.name}</strong>
                            <span className="bus-option-ac">{bus.acType || 'AC'}</span>
                          </div>
                          <div className="bus-option-route">
                            <MapPin size={12} color="var(--coral)" />
                            <span>
                              {bus.source} → {bus.destination}
                            </span>
                          </div>
                        </div>

                        <div className="bus-option-right">
                          <span className="bus-option-seats">
                            <Users size={12} /> {busSeats} Seats
                          </span>
                          {isSelected && (
                            <span className="bus-option-check">
                              <Check size={14} color="#ffffff" />
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {filteredBuses.length === 0 && (
                    <div className="bus-dropdown-empty">
                      No matching buses found for "{busSearchTerm}".
                    </div>
                  )}
                </div>

                {/* Footer to add another bus */}
                <div className="bus-dropdown-footer">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline"
                    style={{ width: '100%', justifyContent: 'center', fontSize: '13px' }}
                    onClick={() => {
                      setIsBusDropdownOpen(false);
                      onClose();
                      if (onOpenNewBus) onOpenNewBus();
                    }}
                  >
                    <Plus size={14} /> + Register New Fleet Coach
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* STEP 2: TRIP DETAILS FORM */}
          <div className="form-grid" style={{ marginTop: '20px' }}>
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
                onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                required
              />
            </div>

            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>Available Seats (Auto-Detected)</span>
                <span style={{ fontSize: '11px', color: '#0e7033', fontWeight: '700' }}>
                  ✓ Synced with Bus
                </span>
              </label>
              <input
                type="number"
                value={formData.seats}
                readOnly
                disabled
                style={{
                  background: 'var(--ivory-dim)',
                  fontWeight: '700',
                  color: 'var(--charcoal)',
                  cursor: 'not-allowed'
                }}
                title="Available seats are automatically detected from the assigned fleet coach layout"
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
            {tripToEdit ? 'Save Trip Changes' : 'Create Trip with Auto Seats'}
          </button>
        </div>
      </form>
    </ModalWrapper>
  );
};



