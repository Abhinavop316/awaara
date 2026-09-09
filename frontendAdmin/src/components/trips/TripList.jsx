import React, { useState, useEffect } from 'react';
import { useAdminData } from '../../context/AdminDataContext';
import { formatCurrency } from '../../utils/formatters';
import { CustomSelect } from '../common/CustomSelect';
import {
  Edit2,
  Trash2,
  Bus,
  MapPin,
  Calendar,
  Users,
  ArrowLeft,
  ChevronRight,
  Clock,
  Compass,
  Sparkles,
  DollarSign,
  Filter
} from 'lucide-react';

export const TripList = ({ onEditTrip, onOpenNewTrip, onOpenNewBus, showToast }) => {
  const { trips, buses, deleteTrip, updateTrip } = useAdminData();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedTripDetails, setSelectedTripDetails] = useState(null);

  // Responsive screen size detection (Mobile <= 900px)
  const [isMobileScreen, setIsMobileScreen] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth <= 900 : false
  );

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 900;
      setIsMobileScreen(mobile);
      if (!mobile && selectedTripDetails) {
        setSelectedTripDetails(null);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [selectedTripDetails]);

  const filteredTrips = trips.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.source.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || t.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleStatusToggle = (trip) => {
    const nextStatus =
      trip.status === 'open'
        ? 'limited'
        : trip.status === 'limited'
        ? 'soldout'
        : 'open';
    updateTrip(trip.id, { status: nextStatus });
    if (selectedTripDetails?.id === trip.id) {
      setSelectedTripDetails({ ...selectedTripDetails, status: nextStatus });
    }
    showToast(`Status updated to ${nextStatus.toUpperCase()}`);
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteTrip(id);
      if (selectedTripDetails?.id === id) {
        setSelectedTripDetails(null);
      }
      showToast(`Trip "${name}" deleted.`);
    }
  };

  // Dedicated Trip Details Section / View — ONLY on mobile screen size (<= 900px)
  if (selectedTripDetails && isMobileScreen) {
    const assignedBus = buses.find((b) => b.id === selectedTripDetails.busId);
    const capacityCount = assignedBus ? (assignedBus.totalSeats || selectedTripDetails.seats || 40) : (selectedTripDetails.seats || 40);

    return (
      <div className="mobile-trip-detail-page">
        {/* Top Back Navigation Bar */}
        <div className="mobile-detail-nav">
          <button
            className="mobile-back-btn"
            onClick={() => setSelectedTripDetails(null)}
            aria-label="Back to trips catalog"
          >
            <ArrowLeft size={18} />
            <span>Back to Trips Catalog</span>
          </button>
          <span className="mobile-detail-nav-title">Trip Details</span>
        </div>

        {/* Hero Cover Image & Header Card */}
        <div className="trip-detail-hero-card">
          <div className="trip-hero-img-wrap">
            <img
              src={selectedTripDetails.img}
              alt={selectedTripDetails.name}
              className="trip-hero-img"
              onError={(e) => {
                e.target.src =
                  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80';
              }}
            />
            <div className="trip-hero-overlay">
              <span className={`badge-pill badge-${selectedTripDetails.status}`}>
                ● {selectedTripDetails.status?.toUpperCase()}
              </span>
            </div>
          </div>

          <div className="trip-hero-content">
            <h2 className="trip-hero-title">{selectedTripDetails.name}</h2>
            <div className="trip-hero-route">
              <MapPin size={15} color="var(--coral)" />
              <span>
                {selectedTripDetails.source || 'Delhi NCR'} → {selectedTripDetails.destination}
              </span>
            </div>
            {selectedTripDetails.highlight && (
              <p className="trip-hero-highlight">
                <Sparkles size={14} color="var(--coral)" />
                {selectedTripDetails.highlight}
              </p>
            )}
          </div>
        </div>

        {/* Key Trip Parameters Grid */}
        <div className="trip-detail-stats-grid">
          <div className="trip-stat-card">
            <span className="stat-card-label">PRICE PER PERSON</span>
            <strong className="stat-card-value price">
              {formatCurrency(selectedTripDetails.price)}
            </strong>
          </div>

          <div className="trip-stat-card">
            <span className="stat-card-label">DATES & SCHEDULE</span>
            <strong className="stat-card-value">
              {selectedTripDetails.dates || 'Upcoming 2026'}
            </strong>
          </div>

          <div className="trip-stat-card">
            <span className="stat-card-label">DURATION</span>
            <strong className="stat-card-value">
              {selectedTripDetails.duration || '5 Days'}
            </strong>
          </div>

          <div className="trip-stat-card">
            <span className="stat-card-label">AVAILABLE CAPACITY</span>
            <strong className="stat-card-value" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Users size={16} color="#0e7033" />
              <span>{capacityCount} Seats Bookable</span>
            </strong>
            {assignedBus && (
              <span style={{ fontSize: '11px', color: '#0e7033', fontWeight: '600', marginTop: '2px' }}>
                ⚡ Auto-detected from {assignedBus.busNumber}
              </span>
            )}
          </div>
        </div>

        {/* Assigned Bus Coach Card */}
        <div className="mobile-detail-card">
          <h3 className="mobile-card-title">
            <Bus size={17} color="var(--coral)" /> Assigned Fleet Coach
          </h3>
          {assignedBus ? (
            <div className="assigned-bus-summary">
              <div className="assigned-bus-top">
                <div>
                  <span className="bus-no-plate">{assignedBus.busNumber}</span>
                  <div className="bus-model-name">{assignedBus.name}</div>
                </div>
                <span className="bus-ac-pill is-ac">
                  {assignedBus.acType || 'AC Coach'}
                </span>
              </div>
              <div className="assigned-bus-route">
                <MapPin size={13} color="#7a7267" />
                <span>
                  {assignedBus.source} → {assignedBus.destination}
                </span>
              </div>
              <div className="assigned-bus-timings">
                <Clock size={13} color="#7a7267" />
                <span>
                  Departure: {assignedBus.departureTime || '20:00'} · Arrival:{' '}
                  {assignedBus.arrivalTime || '08:00 (Next Day)'}
                </span>
              </div>
            </div>
          ) : (
            <div className="unassigned-bus-box">
              <p>No bus coach is assigned to this trip run yet.</p>
            </div>
          )}
        </div>

        {/* Experience & Month Details */}
        <div className="mobile-detail-card">
          <h3 className="mobile-card-title">
            <Compass size={17} color="var(--sage-dark)" /> Experience Category
          </h3>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '8px' }}>
            <span className="pill-tag">{selectedTripDetails.experience || 'Adventure'}</span>
            <span className="pill-tag">Travel Month: {selectedTripDetails.month || 'Nov'}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mobile-detail-actions">
          <button
            className="btn btn-primary mobile-action-btn"
            onClick={() => {
              onEditTrip(selectedTripDetails);
            }}
          >
            <Edit2 size={16} /> Edit Trip Details
          </button>
          <button
            className="btn btn-outline mobile-action-btn"
            onClick={() => handleStatusToggle(selectedTripDetails)}
          >
            Toggle Status ({selectedTripDetails.status?.toUpperCase()})
          </button>
          <button
            className="btn btn-danger mobile-action-btn"
            onClick={() => handleDelete(selectedTripDetails.id, selectedTripDetails.name)}
          >
            <Trash2 size={16} /> Delete Trip
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="panel-card">
      <div className="panel-head">
        <div>
          <h2>Curated Trips Catalog ({trips.length})</h2>
          <p>Manage destinations, pricing, bus assignments, and live availability</p>
        </div>
        <button
          className="btn btn-primary btn-sm"
          onClick={() => {
            if (buses.length === 0) {
              if (onOpenNewBus) onOpenNewBus();
              showToast('Please register a bus coach in Fleet Management first!');
            } else {
              onOpenNewTrip();
            }
          }}
        >
          + Create New Trip
        </button>
      </div>

      {/* Fleet Alert Banner if 0 buses registered */}
      {buses.length === 0 && (
        <div
          style={{
            background: '#fff7ed',
            border: '1.5px solid #fdba74',
            borderRadius: 'var(--radius-md)',
            padding: '14px 18px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '14px',
            flexWrap: 'wrap'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Bus size={20} color="#ea580c" />
            <span style={{ fontSize: '13.5px', color: '#9a3412', fontWeight: '600' }}>
              💡 Fleet Setup Required: Add a bus coach first so trips can automatically detect seating layouts & capacity.
            </span>
          </div>
          <button
            className="btn btn-sm btn-primary"
            onClick={onOpenNewBus}
            style={{ padding: '6px 14px', fontSize: '12.5px' }}
          >
            + Register Bus in Fleet
          </button>
        </div>
      )}

      {/* Filter and Search toolbar */}
      <div
        style={{
          display: 'flex',
          gap: '14px',
          marginBottom: '20px',
          flexWrap: 'wrap',
          alignItems: 'center'
        }}
      >
        <div style={{ flex: 1, minWidth: '240px' }}>
          <input
            type="text"
            placeholder="🔍 Search by trip title, source, or destination..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: 'var(--radius-sm)',
              border: '1.5px solid var(--line-strong)',
              fontSize: '14px',
              background: '#fff'
            }}
          />
        </div>

        <div style={{ width: '210px' }}>
          <CustomSelect
            value={filterStatus}
            onChange={(val) => setFilterStatus(val)}
            icon={Filter}
            options={[
              { value: 'all', label: 'All Statuses' },
              { value: 'open', label: 'Booking Open', color: '#16a34a' },
              { value: 'limited', label: 'Limited Seats', color: '#ea580c' },
              { value: 'soldout', label: 'Sold Out', color: '#dc2626' }
            ]}
          />
        </div>
      </div>

      {/* Desktop Trips Table */}
      <div className="data-table-wrap desktop-trip-table">
        <table className="data-table">
          <thead>
            <tr>
              <th>Trip & Route</th>
              <th>Dates & Duration</th>
              <th>Price (Per Person)</th>
              <th>Assigned Bus</th>
              <th>Available Seats</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTrips.map((trip) => {
              const assignedBus = buses.find((b) => b.id === trip.busId);

              return (
                <tr
                  key={trip.id}
                  onClick={() => onEditTrip(trip)}
                  style={{ cursor: 'pointer' }}
                  title="Click to edit trip details"
                >
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img
                        src={trip.img}
                        alt={trip.name}
                        style={{
                          width: '48px',
                          height: '40px',
                          borderRadius: '6px',
                          objectFit: 'cover'
                        }}
                        onError={(e) => {
                          e.target.src =
                            'https://images.unsplash.com/photo-1500835556837-99ac94a94552?auto=format&fit=crop&w=900&q=80';
                        }}
                      />
                      <div>
                        <strong style={{ color: 'var(--charcoal)' }}>{trip.name}</strong>
                        <div style={{ fontSize: '12px', color: '#7a7267', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <MapPin size={12} />
                          {trip.source || 'Delhi'} → {trip.destination || trip.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: '13.5px' }}>{trip.dates}</div>
                    <div style={{ fontSize: '12px', color: '#7a7267' }}>{trip.duration}</div>
                  </td>
                  <td>
                    <strong style={{ color: 'var(--coral-dark)' }}>
                      {formatCurrency(trip.price)}
                    </strong>
                  </td>
                  <td>
                    {assignedBus ? (
                      <div style={{ fontSize: '12.5px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Bus size={14} color="var(--sage-dark)" />
                        <span>{assignedBus.busNumber}</span>
                      </div>
                    ) : (
                      <span style={{ fontSize: '12px', color: '#a0988e' }}>Unassigned</span>
                    )}
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Users size={14} />
                      <span>{trip.seats} seats</span>
                    </div>
                  </td>
                  <td>
                    <button
                      className={`badge-pill badge-${trip.status}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStatusToggle(trip);
                      }}
                      title="Click to toggle status"
                    >
                      ● {trip.status.toUpperCase()}
                    </button>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div
                      style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(trip.id, trip.name)}
                        title="Delete Trip"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {filteredTrips.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '36px', color: '#7a7267' }}>
                  No trips match the search criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Trips List: Clickable Cards */}
      <div className="mobile-trip-list">
        {filteredTrips.map((trip) => (
          <div
            key={trip.id}
            className="mobile-trip-card"
            onClick={() => setSelectedTripDetails(trip)}
            role="button"
            tabIndex={0}
          >
            <div className="mobile-trip-card-left">
              <img
                src={trip.img}
                alt={trip.name}
                className="mobile-trip-thumb"
                onError={(e) => {
                  e.target.src =
                    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80';
                }}
              />
              <div className="mobile-trip-info">
                <strong className="mobile-trip-title">{trip.name}</strong>
                <div className="mobile-trip-sub">
                  <MapPin size={12} color="var(--coral)" />
                  <span>
                    {trip.source || 'Delhi'} → {trip.destination || trip.name}
                  </span>
                </div>
                <div className="mobile-trip-dates-row">
                  <span className="mobile-trip-dates">{trip.dates}</span>
                  <span className="mobile-trip-duration">· {trip.duration}</span>
                </div>
              </div>
            </div>

            <div className="mobile-trip-card-right">
              <div className="mobile-trip-price">{formatCurrency(trip.price)}</div>
              <span className={`badge-pill badge-${trip.status} mobile-pill`}>
                ● {trip.status?.toUpperCase()}
              </span>
              <ChevronRight size={16} color="#948c80" style={{ marginTop: '4px' }} />
            </div>
          </div>
        ))}
        {filteredTrips.length === 0 && (
          <div style={{ textAlign: 'center', padding: '32px 16px', color: '#7a7267' }}>
            No trips found matching your filter.
          </div>
        )}
      </div>
    </div>
  );
};

