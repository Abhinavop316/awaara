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
      {/* Action Header Toolbar (No duplicate title) */}
      <div className="admin-toolbar-row">
        <div className="toolbar-info">
          <div className="toolbar-badge">
            <Compass size={14} />
            <span>CATALOGUE MANAGEMENT</span>
          </div>
          <span className="toolbar-count">Showing <strong>{places.length}</strong> active holiday destinations</span>
        </div>

        <div className="toolbar-actions">
          <button className="btn btn-outline btn-sm" onClick={handleSeed} title="Seed Default Destinations">
            <RefreshCw size={14} className={loading ? 'spin' : ''} /> Seed Defaults
          </button>
          <button className="btn btn-primary btn-sm" onClick={onOpenNewPlace}>
            <Plus size={15} /> Add Holiday Destination
          </button>
        </div>
      </div>

      {/* 3 Executive KPI Cards */}
      <div className="admin-kpi-grid kpi-3-col">
        <div className="kpi-card">
          <div className="kpi-icon-wrap" style={{ background: 'rgba(224, 102, 63, 0.1)', color: 'var(--coral)' }}>
            <Compass size={22} />
          </div>
          <div className="kpi-body">
            <span className="kpi-label">TOTAL HOLIDAY PACKAGES</span>
            <div className="kpi-value">{places.length}</div>
            <span className="kpi-sub">Curated destinations ready for booking</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-wrap" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#059669' }}>
            <MapPin size={22} />
          </div>
          <div className="kpi-body">
            <span className="kpi-label">INDIAN STATES COVERED</span>
            <div className="kpi-value">{new Set(places.map((p) => p.state).filter(Boolean)).size || 12}</div>
            <span className="kpi-sub">North, South, East & West circuits</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-wrap" style={{ background: 'rgba(234, 179, 8, 0.12)', color: '#ca8a04' }}>
            <Calendar size={22} />
          </div>
          <div className="kpi-body">
            <span className="kpi-label">ITINERARY COVERAGE</span>
            <div className="kpi-value">
              {places.reduce((acc, p) => acc + (p.itinerary?.length || p.durationDays || 4), 0)} Days
            </div>
            <span className="kpi-sub">Total guided itinerary days</span>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="admin-filter-bar-card">
        <div className="filter-search-box">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search holiday packages, cities, states, or sights..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="filter-text-input"
          />
        </div>

        <div className="filter-controls-group">
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="filter-select-input"
          >
            {statesList.map((st) => (
              <option key={st} value={st}>
                {st === 'All' ? 'All States' : st}
              </option>
            ))}
          </select>

          <button className="btn btn-outline btn-sm filter-refresh-btn" onClick={() => fetchPlaces()} title="Refresh list">
            <RefreshCw size={14} className={loading ? 'spin' : ''} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Places Cards Grid */}
      {loading ? (
        <div className="admin-loading-state">
          <div className="spinner"></div>
          <p>Loading curated holiday destinations...</p>
        </div>
      ) : places.length > 0 ? (
        <div className="admin-places-grid">
          {places.map((place) => {
            const placeId = place._id || place.id;
            return (
              <div key={placeId} className="admin-place-card">
                <div className="admin-place-img-wrap">
                  <img
                    src={place.img}
                    alt={place.name}
                    loading="lazy"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                  <div className="place-img-gradient-overlay" />
                  <span className="admin-category-badge">{place.category || 'Holiday Package'}</span>
                  <span className="admin-duration-badge">
                    <Clock size={11} /> {place.days || `${place.durationDays || 5} Days`}
                  </span>
                </div>

                <div className="admin-place-content">
                  <div className="admin-place-header">
                    <div className="admin-place-location">
                      <MapPin size={12} />
                      <span>{place.city}, {place.state}</span>
                    </div>
                    <h3 className="admin-place-name" title={place.name}>{place.name}</h3>
                  </div>

                  <p className="admin-place-overview">
                    {place.overview
                      ? place.overview.slice(0, 110) + (place.overview.length > 110 ? '...' : '')
                      : 'Curated holiday destination in India with day-by-day sightseeing.'}
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
                      {place.attractions.length > 3 && (
                        <span className="admin-sight-more">+{place.attractions.length - 3}</span>
                      )}
                    </div>
                  )}

                  <div className="admin-place-footer">
                    <div className="admin-price">
                      <span className="price-label">Starting From</span>
                      <strong className="price-val">₹{place.price?.toLocaleString('en-IN') || '12,999'}</strong>
                      <span className="price-sub">/ person</span>
                    </div>

                    <div className="admin-card-actions">
                      <button
                        className="btn-admin-action"
                        onClick={() => onEditPlace(place)}
                        title="Edit Holiday & Itinerary"
                      >
                        <Edit2 size={15} />
                        <span>Edit</span>
                      </button>
                      <button
                        className="btn-admin-action danger"
                        onClick={() => handleDelete(place)}
                        title="Delete Destination"
                      >
                        <Trash2 size={15} />
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
