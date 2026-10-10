import React, { useState, useEffect, useCallback } from 'react';
import { placeApi } from '../../services/placeApi';
import {
  MapPin,
  Search,
  Plus,
  Edit2,
  Trash2,
  Calendar,
  Sparkles,
  RefreshCw,
  Eye,
  Star,
  Layers,
  Compass,
  Clock
} from 'lucide-react';

export const PlaceList = ({ onEditPlace, onOpenNewPlace, showToast }) => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [previewPlace, setPreviewPlace] = useState(null);

  const fetchPlaces = useCallback(async (isInitial = false) => {
    setLoading(true);
    try {
      const params = { limit: 100 };
      if (searchTerm && searchTerm.trim()) params.search = searchTerm.trim();
      if (selectedState && selectedState !== 'All') params.state = selectedState;
      if (selectedCategory && selectedCategory !== 'All') params.category = selectedCategory;

      const res = await placeApi.getAllPlaces(params);
      if (res && res.success && Array.isArray(res.places) && res.places.length > 0) {
        setPlaces(res.places);
      } else if (isInitial && (!res?.places || res.places.length === 0)) {
        // Auto-seed if database is empty on initial load
        const seedRes = await placeApi.seedPlaces();
        if (seedRes && seedRes.success && Array.isArray(seedRes.places)) {
          setPlaces(seedRes.places);
        } else {
          setPlaces([]);
        }
      } else {
        setPlaces(res?.places || []);
      }
    } catch (e) {
      console.error('Error fetching places in admin:', e);
      if (showToast) showToast('Failed to load holiday places.');
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedState, selectedCategory, showToast]);

  useEffect(() => {
    fetchPlaces(true);
  }, [fetchPlaces]);

  const handleDelete = async (place) => {
    const id = place._id || place.id;
    if (!window.confirm(`Are you sure you want to delete "${place.name}"?`)) return;

    try {
      const res = await placeApi.deletePlace(id);
      if (res && res.success) {
        if (showToast) showToast(`Deleted "${place.name}" successfully!`);
        fetchPlaces();
      } else {
        if (showToast) showToast(res.message || 'Failed to delete place.');
      }
    } catch (e) {
      console.error('Delete place error:', e);
      if (showToast) showToast('Failed to delete place.');
    }
  };

  const handleSeed = async () => {
    if (!window.confirm('Seed default curated holiday destinations across India?')) return;
    setLoading(true);
    try {
      const res = await placeApi.seedPlaces();
      if (res && res.success) {
        if (showToast) showToast(res.message || 'Seeded Indian holiday destinations! 🎉');
        fetchPlaces();
      }
    } catch (e) {
      console.error('Seed error:', e);
      if (showToast) showToast('Seed failed.');
    } finally {
      setLoading(false);
    }
  };

  // States list
  const statesList = [
    'All',
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
    'Uttar Pradesh'
  ];

  return (
    <div className="admin-places-view">
      {/* Top Header & Actions */}
      <div className="view-header-row">
        <div>
          <h2>Holiday Destinations & Itineraries</h2>
          <p className="view-subtitle">
            Manage India places to visit, Day-by-Day travel itineraries, duration, pricing, and sightseeing spots.
          </p>
        </div>

        <div className="view-header-actions">
          <button className="btn btn-outline btn-sm" onClick={handleSeed} title="Seed Default Destinations">
            <RefreshCw size={15} /> Seed Defaults
          </button>
          <button className="btn btn-primary" onClick={onOpenNewPlace}>
            <Plus size={16} /> Add Holiday Destination
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="admin-stats-grid" style={{ marginBottom: '24px' }}>
        <div className="stat-card">
          <div className="stat-icon-wrap" style={{ background: 'rgba(224, 102, 63, 0.12)', color: 'var(--coral)' }}>
            <Compass size={22} />
          </div>
          <div>
            <div className="stat-label">Total Holidays</div>
            <div className="stat-value">{places.length} Destinations</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrap" style={{ background: 'rgba(138, 154, 126, 0.15)', color: 'var(--sage-dark)' }}>
            <MapPin size={22} />
          </div>
          <div>
            <div className="stat-label">States Covered</div>
            <div className="stat-value">
              {new Set(places.map((p) => p.state)).size} Indian States
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrap" style={{ background: 'rgba(224, 172, 63, 0.15)', color: 'var(--gold)' }}>
            <Calendar size={22} />
          </div>
          <div>
            <div className="stat-label">Active Itineraries</div>
            <div className="stat-value">
              {places.reduce((acc, p) => acc + (p.itinerary?.length || p.durationDays || 0), 0)} Total Days
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="admin-table-filters">
        <div className="search-box">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search holiday name, city, state, or sights..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="filter-input"
          />
        </div>

        <select
          value={selectedState}
          onChange={(e) => setSelectedState(e.target.value)}
          className="filter-select"
        >
          {statesList.map((st) => (
            <option key={st} value={st}>
              {st === 'All' ? 'All States' : st}
            </option>
          ))}
        </select>

        <button className="btn btn-outline btn-sm" onClick={fetchPlaces}>
          <RefreshCw size={14} className={loading ? 'spin' : ''} /> Refresh
        </button>
      </div>

      {/* Places Cards Grid */}
      {loading ? (
        <div className="admin-loading-state">
          <div className="spinner"></div>
          <p>Loading holiday destinations & itineraries...</p>
        </div>
      ) : places.length > 0 ? (
        <div className="admin-places-grid">
          {places.map((place) => {
            const placeId = place._id || place.id;
            return (
              <div key={placeId} className="admin-place-card">
                <div className="admin-place-img-wrap">
                  <img src={place.img} alt={place.name} />
                  <span className="admin-category-badge">{place.category}</span>
                  <span className="admin-duration-badge">
                    <Clock size={12} /> {place.days || `${place.durationDays} Days`}
                  </span>
                </div>

                <div className="admin-place-content">
                  <div className="admin-place-header">
                    <div>
                      <div className="admin-place-location">
                        <MapPin size={13} /> {place.city}, {place.state}
                      </div>
                      <h3 className="admin-place-name">{place.name}</h3>
                    </div>
                  </div>

                  <p className="admin-place-overview">
                    {place.overview
                      ? place.overview.slice(0, 95) + '...'
                      : 'Curated holiday destination in India.'}
                  </p>

                  <div className="admin-itinerary-preview-badge">
                    <Calendar size={13} />
                    <span>
                      <strong>{place.itinerary?.length || place.durationDays || 4} Days</strong> Itinerary Included
                    </span>
                  </div>

                  {place.attractions && place.attractions.length > 0 && (
                    <div className="admin-sights-tags">
                      {place.attractions.slice(0, 3).map((a, i) => (
                        <span key={i} className="admin-sight-tag">
                          📍 {a}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="admin-place-footer">
                    <div className="admin-price">
                      <span className="price-label">Price / Person</span>
                      <strong>₹{place.price?.toLocaleString('en-IN')}</strong>
                    </div>

                    <div className="admin-card-actions">
                      <button
                        className="btn-icon-admin"
                        onClick={() => onEditPlace(place)}
                        title="Edit Holiday & Itinerary"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        className="btn-icon-admin danger"
                        onClick={() => handleDelete(place)}
                        title="Delete Destination"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="admin-empty-state">
          <Compass size={40} color="#999" />
          <h3>No Holiday Destinations Found</h3>
          <p>Create a new destination or seed defaults to populate Indian holidays.</p>
          <button className="btn btn-primary" onClick={handleSeed}>
            Seed Default Destinations
          </button>
        </div>
      )}
    </div>
  );
};
