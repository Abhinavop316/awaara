import React, { useState, useEffect } from 'react';
import { ModalWrapper } from '../common/ModalWrapper';
import { placeApi } from '../../services/placeApi';
import {
  MapPin,
  Calendar,
  Sparkles,
  Plus,
  Trash2,
  Image as ImageIcon,
  CheckCircle,
  Clock,
  Compass,
  DollarSign,
  Star,
  Layers,
  ChevronRight,
  Search,
  Check
} from 'lucide-react';

const INDIAN_STATES = [
  'Himachal Pradesh',
  'Jammu & Kashmir',
  'Rajasthan',
  'Kerala',
  'Goa',
  'Ladakh',
  'Uttarakhand',
  'Sikkim',
  'Meghalaya',
  'Karnataka',
  'Andaman & Nicobar',
  'Uttar Pradesh',
  'Tamil Nadu',
  'Maharashtra',
  'West Bengal',
  'Gujarat',
  'Madhya Pradesh',
  'Assam',
  'Punjab'
];

const CATEGORIES = [
  'Hill Station',
  'Heritage & Forts',
  'Beach & Coastal',
  'Spiritual & Pilgrimage',
  'Adventure & Treks',
  'Wildlife & Safari',
  'Lakes & Nature',
  'Romantic Getaway',
  'Cultural & City'
];

export const PlaceModal = ({ isOpen, onClose, placeToEdit, showToast, onSaveSuccess }) => {
  const [activeSection, setActiveSection] = useState('basic'); // 'basic' | 'itinerary' | 'sights' | 'inclusions'

  const [formData, setFormData] = useState({
    name: '',
    state: 'Himachal Pradesh',
    city: '',
    category: 'Hill Station',
    days: '4 Days / 3 Nights',
    durationDays: 4,
    price: 12999,
    bestTimeToVisit: 'October to May',
    rating: 4.8,
    img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80',
    galleryText: '',
    overview: '',
    highlightsText: '',
    attractionsText: '',
    inclusionsText: 'Deluxe hotel / resort accommodation\nDaily breakfast and dinner\nDedicated AC vehicle for all sightseeing\nSightseeing permits & tolls\n24/7 on-trip assistance',
    exclusionsText: 'Personal expenses and tips\nAdventure sports / optional activities\nFlight or train fare to arrival point',
    coordinates: { lat: 0, lng: 0 }
  });

  const [itinerary, setItinerary] = useState([
    {
      day: 1,
      title: 'Arrival & Local Sightseeing',
      description: 'Check-in to resort, relax and explore local bazaars and heritage sights.',
      activities: ['Local Market', 'Sunset Point'],
      meals: 'Dinner Included',
      stay: '4-Star Resort'
    },
    {
      day: 2,
      title: 'Full Day Iconic Attractions Tour',
      description: 'Visit the main cultural, scenic and adventure landmarks of the destination.',
      activities: ['Main Sightseeing', 'Valley View', 'Photo Stop'],
      meals: 'Breakfast & Dinner',
      stay: '4-Star Resort'
    },
    {
      day: 3,
      title: 'Nature Excursion & Cultural Exploration',
      description: 'Explore scenic waterfalls, nature trails, and authentic regional cuisine.',
      activities: ['Nature Walk', 'Cultural Show'],
      meals: 'Breakfast & Dinner',
      stay: '4-Star Resort'
    },
    {
      day: 4,
      title: 'Souvenir Shopping & Departure',
      description: 'Morning breakfast followed by souvenir shopping and onward journey departure.',
      activities: ['Handicraft Shopping', 'Departure Transfer'],
      meals: 'Breakfast Included',
      stay: 'Check-out'
    }
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync state when placeToEdit changes
  useEffect(() => {
    if (placeToEdit) {
      setFormData({
        name: placeToEdit.name || '',
        state: placeToEdit.state || 'Himachal Pradesh',
        city: placeToEdit.city || '',
        category: placeToEdit.category || 'Hill Station',
        days: placeToEdit.days || `${placeToEdit.durationDays || 4} Days / ${(placeToEdit.durationDays || 4) - 1} Nights`,
        durationDays: placeToEdit.durationDays || 4,
        price: placeToEdit.price || 12999,
        bestTimeToVisit: placeToEdit.bestTimeToVisit || 'October to May',
        rating: placeToEdit.rating || 4.8,
        img: placeToEdit.img || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80',
        galleryText: Array.isArray(placeToEdit.gallery) ? placeToEdit.gallery.join('\n') : '',
        overview: placeToEdit.overview || '',
        highlightsText: Array.isArray(placeToEdit.highlights) ? placeToEdit.highlights.join('\n') : '',
        attractionsText: Array.isArray(placeToEdit.attractions) ? placeToEdit.attractions.join(', ') : '',
        inclusionsText: Array.isArray(placeToEdit.inclusions) ? placeToEdit.inclusions.join('\n') : 'Deluxe hotel accommodation\nDaily breakfast and dinner\nSightseeing cab',
        exclusionsText: Array.isArray(placeToEdit.exclusions) ? placeToEdit.exclusions.join('\n') : 'Personal expenses\nFlights',
        coordinates: placeToEdit.coordinates || { lat: 0, lng: 0 }
      });

      if (Array.isArray(placeToEdit.itinerary) && placeToEdit.itinerary.length > 0) {
        setItinerary(placeToEdit.itinerary);
      }
    } else {
      // Reset defaults
      setFormData({
        name: '',
        state: 'Himachal Pradesh',
        city: '',
        category: 'Hill Station',
        days: '4 Days / 3 Nights',
        durationDays: 4,
        price: 12999,
        bestTimeToVisit: 'October to May',
        rating: 4.8,
        img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80',
        galleryText: '',
        overview: '',
        highlightsText: '',
        attractionsText: '',
        inclusionsText: 'Deluxe hotel / resort accommodation\nDaily breakfast and dinner\nDedicated AC vehicle for all sightseeing\nSightseeing permits & tolls\n24/7 on-trip assistance',
        exclusionsText: 'Personal expenses and tips\nAdventure sports / optional activities\nFlight or train fare to arrival point',
        coordinates: { lat: 0, lng: 0 }
      });
      setItinerary([
        {
          day: 1,
          title: 'Arrival & Local Sightseeing',
          description: 'Check-in to resort, relax and explore local bazaars and heritage sights.',
          activities: ['Local Market', 'Sunset Point'],
          meals: 'Dinner Included',
          stay: '4-Star Resort'
        },
        {
          day: 2,
          title: 'Full Day Iconic Attractions Tour',
          description: 'Visit the main cultural, scenic and adventure landmarks of the destination.',
          activities: ['Main Sightseeing', 'Valley View', 'Photo Stop'],
          meals: 'Breakfast & Dinner',
          stay: '4-Star Resort'
        },
        {
          day: 3,
          title: 'Nature Excursion & Cultural Exploration',
          description: 'Explore scenic waterfalls, nature trails, and authentic regional cuisine.',
          activities: ['Nature Walk', 'Cultural Show'],
          meals: 'Breakfast & Dinner',
          stay: '4-Star Resort'
        },
        {
          day: 4,
          title: 'Souvenir Shopping & Departure',
          description: 'Morning breakfast followed by souvenir shopping and onward journey departure.',
          activities: ['Handicraft Shopping', 'Departure Transfer'],
          meals: 'Breakfast Included',
          stay: 'Check-out'
        }
      ]);
    }
    setActiveSection('basic');
  }, [placeToEdit, isOpen]);

  // Itinerary helpers
  const handleAddDay = () => {
    const nextDayNum = itinerary.length + 1;
    const newDay = {
      day: nextDayNum,
      title: `Day ${nextDayNum}: Sightseeing & Exploration`,
      description: 'Explore breathtaking viewpoints, nature walks, and local cuisine.',
      activities: ['Sightseeing', 'Scenic Drive'],
      meals: 'Breakfast & Dinner Included',
      stay: 'Comfort Mountain Resort'
    };
    const updated = [...itinerary, newDay];
    setItinerary(updated);
    setFormData((prev) => ({
      ...prev,
      durationDays: updated.length,
      days: `${updated.length} Days / ${updated.length - 1} Nights`
    }));
  };

  const handleRemoveDay = (index) => {
    if (itinerary.length <= 1) {
      if (showToast) showToast('A holiday must have at least 1 day itinerary.');
      return;
    }
    const filtered = itinerary.filter((_, i) => i !== index).map((day, i) => ({
      ...day,
      day: i + 1
    }));
    setItinerary(filtered);
    setFormData((prev) => ({
      ...prev,
      durationDays: filtered.length,
      days: `${filtered.length} Days / ${filtered.length - 1} Nights`
    }));
  };

  const handleDayChange = (index, field, value) => {
    const updated = [...itinerary];
    updated[index] = { ...updated[index], [field]: value };
    setItinerary(updated);
  };

  const handleActivitiesStringChange = (index, str) => {
    const acts = str.split(',').map((s) => s.trim()).filter(Boolean);
    const updated = [...itinerary];
    updated[index] = { ...updated[index], activities: acts };
    setItinerary(updated);
  };

  const handleAddSightToAttractions = (sightName) => {
    const currentList = formData.attractionsText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    if (!currentList.includes(sightName)) {
      currentList.push(sightName);
      setFormData((prev) => ({
        ...prev,
        attractionsText: currentList.join(', ')
      }));
      if (showToast) showToast(`Added "${sightName}" to attractions list!`);
    }
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.city.trim() || !formData.state.trim()) {
      if (showToast) showToast('Destination Name, State, and City are required.');
      return;
    }

    setIsSubmitting(true);

    const payload = {
      name: formData.name.trim(),
      state: formData.state.trim(),
      city: formData.city.trim(),
      category: formData.category,
      days: formData.days || `${itinerary.length} Days / ${itinerary.length - 1} Nights`,
      durationDays: itinerary.length,
      price: Number(formData.price) || 0,
      bestTimeToVisit: formData.bestTimeToVisit.trim() || 'October to May',
      rating: Number(formData.rating) || 4.8,
      img: formData.img.trim(),
      gallery: formData.galleryText.split('\n').map((s) => s.trim()).filter(Boolean),
      overview: formData.overview.trim(),
      highlights: formData.highlightsText.split('\n').map((s) => s.trim()).filter(Boolean),
      attractions: formData.attractionsText.split(',').map((s) => s.trim()).filter(Boolean),
      inclusions: formData.inclusionsText.split('\n').map((s) => s.trim()).filter(Boolean),
      exclusions: formData.exclusionsText.split('\n').map((s) => s.trim()).filter(Boolean),
      coordinates: formData.coordinates,
      itinerary
    };

    try {
      let result;
      if (placeToEdit && (placeToEdit._id || placeToEdit.id)) {
        const id = placeToEdit._id || placeToEdit.id;
        result = await placeApi.updatePlace(id, payload);
      } else {
        result = await placeApi.createPlace(payload);
      }

      if (result && result.success) {
        if (showToast) showToast(placeToEdit ? 'Holiday Destination updated! 🚀' : 'New Holiday Destination created! 🎉');
        if (onSaveSuccess) onSaveSuccess(result.place || payload);
        onClose();
      } else {
        if (showToast) showToast(result.message || 'Failed to save holiday destination.');
      }
    } catch (err) {
      console.error('Error saving place:', err);
      if (showToast) showToast('Error saving destination.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title={placeToEdit ? 'Edit Holiday Destination & Itinerary' : 'Create New Holiday Destination'}
      subtitle="Configure destination details, Day-by-Day itinerary, duration, pricing, and sightseeing spots"
      maxWidth="900px"
    >
      {/* Navigation Sections */}
      <div className="modal-subnav-tabs">
        <button
          type="button"
          className={`subnav-tab-btn ${activeSection === 'basic' ? 'active' : ''}`}
          onClick={() => setActiveSection('basic')}
        >
          <Compass size={15} />
          1. Destination & Pricing
        </button>
        <button
          type="button"
          className={`subnav-tab-btn ${activeSection === 'itinerary' ? 'active' : ''}`}
          onClick={() => setActiveSection('itinerary')}
        >
          <Calendar size={15} />
          2. Day-by-Day Itinerary ({itinerary.length} Days)
        </button>
        <button
          type="button"
          className={`subnav-tab-btn ${activeSection === 'sights' ? 'active' : ''}`}
          onClick={() => setActiveSection('sights')}
        >
          <MapPin size={15} />
          3. Sights & Attractions
        </button>
        <button
          type="button"
          className={`subnav-tab-btn ${activeSection === 'inclusions' ? 'active' : ''}`}
          onClick={() => setActiveSection('inclusions')}
        >
          <Layers size={15} />
          4. Inclusions & Media
        </button>
      </div>

      <form onSubmit={handleSubmit} className="place-modal-form">
        {/* SECTION 1: BASIC & PRICING */}
        {activeSection === 'basic' && (
          <div className="form-section-body">
            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">
                  Destination / Package Name <span className="req">*</span>
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Manali & Rohtang Pass Alpine Escape"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Category / Theme <span className="req">*</span>
                </label>
                <select
                  className="form-select"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-grid-3">
              <div className="form-group">
                <label className="form-label">
                  State in India <span className="req">*</span>
                </label>
                <select
                  className="form-select"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                >
                  {INDIAN_STATES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">
                  City / Location <span className="req">*</span>
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Manali, Udaipur, Leh..."
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Price / Budget (₹) <span className="req">*</span>
                </label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="14999"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                  min="0"
                />
              </div>
            </div>

            <div className="form-grid-3">
              <div className="form-group">
                <label className="form-label">Duration Label</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. 5 Days / 4 Nights"
                  value={formData.days}
                  onChange={(e) => setFormData({ ...formData, days: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Best Time to Visit</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. October to June"
                  value={formData.bestTimeToVisit}
                  onChange={(e) => setFormData({ ...formData, bestTimeToVisit: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Rating (1 - 5)</label>
                <input
                  type="number"
                  step="0.1"
                  className="form-input"
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                  min="1"
                  max="5"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Overview & Summary Description</label>
              <textarea
                className="form-textarea"
                rows="3"
                placeholder="Describe what makes this holiday experience iconic, scenic, and unique..."
                value={formData.overview}
                onChange={(e) => setFormData({ ...formData, overview: e.target.value })}
              />
            </div>
          </div>
        )}

        {/* SECTION 2: DAY BY DAY ITINERARY BUILDER */}
        {activeSection === 'itinerary' && (
          <div className="form-section-body">
            <div className="itinerary-header-bar">
              <div>
                <h4 style={{ margin: 0, fontSize: '15px' }}>
                  Day-by-Day Travel Schedule ({itinerary.length} Days Total)
                </h4>
                <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#777' }}>
                  Define activities, meals, and overnight stays for every single day of this holiday.
                </p>
              </div>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={handleAddDay}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <Plus size={15} /> Add Another Day
              </button>
            </div>

            <div className="itinerary-builder-list">
              {itinerary.map((dayItem, idx) => (
                <div key={idx} className="admin-day-card">
                  <div className="admin-day-header">
                    <span className="admin-day-badge">Day {dayItem.day || idx + 1}</span>
                    <input
                      type="text"
                      className="form-input day-title-input"
                      placeholder={`Day ${idx + 1} Title (e.g. Arrival in Manali & Old Manali Exploration)`}
                      value={dayItem.title}
                      onChange={(e) => handleDayChange(idx, 'title', e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="btn-delete-day"
                      onClick={() => handleRemoveDay(idx)}
                      title="Remove Day"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="form-group" style={{ marginTop: '10px' }}>
                    <label className="form-label" style={{ fontSize: '12px' }}>
                      Day Description / Itinerary Notes
                    </label>
                    <textarea
                      className="form-textarea"
                      rows="2"
                      placeholder="Detail the morning, afternoon, and evening plan for this day..."
                      value={dayItem.description}
                      onChange={(e) => handleDayChange(idx, 'description', e.target.value)}
                    />
                  </div>

                  <div className="form-grid-3" style={{ marginTop: '10px' }}>
                    <div className="form-group">
                      <label className="form-label" style={{ fontSize: '12px' }}>
                        Key Activities (Comma separated)
                      </label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. Solang Ropeway, Paragliding"
                        value={Array.isArray(dayItem.activities) ? dayItem.activities.join(', ') : ''}
                        onChange={(e) => handleActivitiesStringChange(idx, e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label" style={{ fontSize: '12px' }}>
                        Meals Included
                      </label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. Breakfast & Dinner Included"
                        value={dayItem.meals || ''}
                        onChange={(e) => handleDayChange(idx, 'meals', e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label" style={{ fontSize: '12px' }}>
                        Overnight Stay / Hotel
                      </label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. Mountain View Resort"
                        value={dayItem.stay || ''}
                        onChange={(e) => handleDayChange(idx, 'stay', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 3: SIGHTS & ATTRACTIONS */}
        {activeSection === 'sights' && (
          <div className="form-section-body">
            <div className="form-group">
              <label className="form-label">
                Featured Attractions & Key Sights (Comma separated)
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Rohtang Pass, Solang Valley, Hadimba Temple, Atal Tunnel, Mall Road"
                value={formData.attractionsText}
                onChange={(e) => setFormData({ ...formData, attractionsText: e.target.value })}
              />
              <span className="form-hint">
                These iconic sights appear as badges on the holiday place card and detail modal.
              </span>
            </div>

            <div className="form-group">
              <label className="form-label">
                Trip Highlights (One per line)
              </label>
              <textarea
                className="form-textarea"
                rows="4"
                placeholder="Luxury Resort stay with Himalayan view&#10;Solang Valley Paragliding & snow activities&#10;Old Manali cafe hopping&#10;Jogini Waterfall trek"
                value={formData.highlightsText}
                onChange={(e) => setFormData({ ...formData, highlightsText: e.target.value })}
              />
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Latitude Coordinate</label>
                <input
                  type="number"
                  step="any"
                  className="form-input"
                  value={formData.coordinates.lat}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      coordinates: { ...formData.coordinates, lat: parseFloat(e.target.value) || 0 }
                    })
                  }
                />
              </div>

              <div className="form-group">
                <label className="form-label">Longitude Coordinate</label>
                <input
                  type="number"
                  step="any"
                  className="form-input"
                  value={formData.coordinates.lng}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      coordinates: { ...formData.coordinates, lng: parseFloat(e.target.value) || 0 }
                    })
                  }
                />
              </div>
            </div>
          </div>
        )}

        {/* SECTION 4: INCLUSIONS & MEDIA */}
        {activeSection === 'inclusions' && (
          <div className="form-section-body">
            <div className="form-group">
              <label className="form-label">
                Primary Hero Banner Image URL <span className="req">*</span>
              </label>
              <input
                type="url"
                className="form-input"
                placeholder="https://images.unsplash.com/..."
                value={formData.img}
                onChange={(e) => setFormData({ ...formData, img: e.target.value })}
                required
              />
              {formData.img && (
                <div className="image-preview-box" style={{ marginTop: '10px' }}>
                  <img
                    src={formData.img}
                    alt="Preview"
                    style={{ maxHeight: '140px', borderRadius: '8px', objectFit: 'cover' }}
                  />
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">
                Gallery Image URLs (One URL per line)
              </label>
              <textarea
                className="form-textarea"
                rows="3"
                placeholder="https://images.unsplash.com/photo-1...&#10;https://images.unsplash.com/photo-2..."
                value={formData.galleryText}
                onChange={(e) => setFormData({ ...formData, galleryText: e.target.value })}
              />
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Inclusions (One per line)</label>
                <textarea
                  className="form-textarea"
                  rows="4"
                  value={formData.inclusionsText}
                  onChange={(e) => setFormData({ ...formData, inclusionsText: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Exclusions (One per line)</label>
                <textarea
                  className="form-textarea"
                  rows="4"
                  value={formData.exclusionsText}
                  onChange={(e) => setFormData({ ...formData, exclusionsText: e.target.value })}
                />
              </div>
            </div>
          </div>
        )}

        {/* Modal Actions */}
        <div className="modal-actions-bar">
          <button type="button" className="btn btn-outline" onClick={onClose}>
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? 'Saving Holiday Place...'
              : placeToEdit
              ? 'Update Destination & Itinerary'
              : 'Publish Holiday Destination'}
          </button>
        </div>
      </form>
    </ModalWrapper>
  );
};
