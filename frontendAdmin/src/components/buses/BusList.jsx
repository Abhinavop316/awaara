import React, { useState } from 'react';
import { useAdminData } from '../../context/AdminDataContext';
import {
  Bus,
  Edit2,
  Trash2,
  MapPin,
  Clock,
  Users,
  Wind,
  ChevronRight,
  ArrowLeft,
  Navigation,
  CheckCircle2
} from 'lucide-react';

export const BusList = ({ onEditBus, onOpenNewBus, showToast }) => {
  const { buses, deleteBus } = useAdminData();
  const [selectedMobileBus, setSelectedMobileBus] = useState(null);

  const handleDelete = (id, number) => {
    if (window.confirm(`Are you sure you want to remove Bus "${number}" from fleet?`)) {
      deleteBus(id);
      if (selectedMobileBus?.id === id) {
        setSelectedMobileBus(null);
      }
      showToast(`Bus ${number} removed.`);
    }
  };

  // If a bus is selected on mobile, show the Dedicated Mobile Bus Details Page
  if (selectedMobileBus) {
    const isAc =
      selectedMobileBus.acType === 'Non-AC' ||
      selectedMobileBus.name?.toLowerCase().includes('non-ac')
        ? 'Non-AC'
        : 'AC';

    return (
      <div className="mobile-bus-detail-page">
        {/* Top Back Navigation Bar */}
        <div className="mobile-detail-nav">
          <button
            className="mobile-back-btn"
            onClick={() => setSelectedMobileBus(null)}
            aria-label="Back to bus list"
          >
            <ArrowLeft size={18} />
            <span>Back to Fleet</span>
          </button>
          <span className="mobile-detail-nav-title">Bus Details</span>
        </div>

        {/* Bus Hero Header Card */}
        <div className="mobile-detail-hero">
          <div className="mobile-detail-hero-top">
            <div className="mobile-bus-icon-circle">
              <Bus size={24} />
            </div>
            <div className="mobile-bus-hero-titles">
              <span className="mobile-bus-badge-label">REGISTRATION NO.</span>
              <h2 className="mobile-bus-number-plate">{selectedMobileBus.busNumber}</h2>
            </div>
          </div>

          <div className="mobile-bus-badges-row">
            <span className={`bus-ac-pill ${isAc === 'AC' ? 'is-ac' : 'is-nonac'}`}>
              <Wind size={12} />
              {isAc} Coach
            </span>
            <span className="bus-seats-pill">
              <Users size={12} />
              {selectedMobileBus.totalSeats || 40} Seats
            </span>
            <span className="bus-status-pill">● {selectedMobileBus.status || 'Active'}</span>
          </div>
        </div>

        {/* Journey Route & Timings Card */}
        <div className="mobile-detail-card">
          <h3 className="mobile-card-title">
            <Navigation size={16} color="var(--coral)" /> Route & Schedule
          </h3>

          <div className="mobile-route-timeline">
            {/* Departure */}
            <div className="timeline-node">
              <div className="timeline-dot start"></div>
              <div className="timeline-info">
                <span className="timeline-label">DEPARTURE</span>
                <strong className="timeline-city">{selectedMobileBus.source}</strong>
                <div className="timeline-time">
                  <Clock size={12} />
                  <span>{selectedMobileBus.departureTime || '20:00'}</span>
                </div>
              </div>
            </div>

            <div className="timeline-connector"></div>

            {/* Destination */}
            <div className="timeline-node">
              <div className="timeline-dot end"></div>
              <div className="timeline-info">
                <span className="timeline-label">DESTINATION</span>
                <strong className="timeline-city">{selectedMobileBus.destination}</strong>
                <div className="timeline-time">
                  <Clock size={12} />
                  <span>{selectedMobileBus.arrivalTime || '08:00 (Next Day)'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Boarding Points */}
        <div className="mobile-detail-card">
          <h3 className="mobile-card-title">
            <MapPin size={16} color="var(--sage-dark)" /> Boarding Points
          </h3>
          <div className="mobile-stops-list">
            {(selectedMobileBus.boardingPoints || []).length > 0 ? (
              selectedMobileBus.boardingPoints.map((point, index) => (
                <div key={index} className="mobile-stop-item">
                  <div className="stop-marker boarding">{index + 1}</div>
                  <div className="stop-text">{point}</div>
                </div>
              ))
            ) : (
              <p className="no-stops-text">No specific boarding points configured.</p>
            )}
          </div>
        </div>

        {/* Dropping Points */}
        <div className="mobile-detail-card">
          <h3 className="mobile-card-title">
            <MapPin size={16} color="var(--coral)" /> Dropping Points
          </h3>
          <div className="mobile-stops-list">
            {(selectedMobileBus.droppingPoints || []).length > 0 ? (
              selectedMobileBus.droppingPoints.map((point, index) => (
                <div key={index} className="mobile-stop-item">
                  <div className="stop-marker dropping">{index + 1}</div>
                  <div className="stop-text">{point}</div>
                </div>
              ))
            ) : (
              <p className="no-stops-text">No specific dropping points configured.</p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mobile-detail-actions">
          <button
            className="btn btn-outline mobile-action-btn"
            onClick={() => {
              onEditBus(selectedMobileBus);
            }}
          >
            <Edit2 size={16} /> Edit Bus Details
          </button>
          <button
            className="btn btn-danger mobile-action-btn"
            onClick={() => handleDelete(selectedMobileBus.id, selectedMobileBus.busNumber)}
          >
            <Trash2 size={16} /> Remove Bus
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="panel-card">
      <div className="panel-head">
        <div>
          <h2>Active Bus Fleet ({buses.length})</h2>
          <p>Manage bus number plates, departure & destination routes, timings, seat capacity, and stops</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={onOpenNewBus}>
          + Register New Bus
        </button>
      </div>

      {/* Desktop View: Full Data Table */}
      <div className="data-table-wrap desktop-bus-table">
        <table className="data-table">
          <thead>
            <tr>
              <th>Bus No. Plate</th>
              <th>Route (Departure → Destination)</th>
              <th>Timings (Dept / Arrival)</th>
              <th>No. of Seats</th>
              <th>AC / Non-AC</th>
              <th>Boarding & Dropping Points</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {buses.map((bus) => {
              const isAc =
                bus.acType === 'Non-AC' || bus.name?.toLowerCase().includes('non-ac')
                  ? 'Non-AC'
                  : 'AC';

              return (
                <tr key={bus.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div
                        style={{
                          width: '38px',
                          height: '38px',
                          borderRadius: '8px',
                          background: 'var(--ivory-dim)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--coral)'
                        }}
                      >
                        <Bus size={18} />
                      </div>
                      <div>
                        <strong style={{ fontSize: '15px', letterSpacing: '0.4px' }}>
                          {bus.busNumber}
                        </strong>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '13.5px'
                      }}
                    >
                      <MapPin size={13} color="var(--coral)" />
                      <strong>{bus.source}</strong>
                      <span>→</span>
                      <strong>{bus.destination}</strong>
                    </div>
                  </td>
                  <td>
                    <div
                      style={{
                        fontSize: '13px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <Clock size={12} />
                      <span>{bus.departureTime}</span>
                      <span style={{ color: '#7a7267' }}>—</span>
                      <span>{bus.arrivalTime}</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Users size={13} color="var(--sage-dark)" />
                      <strong style={{ color: 'var(--charcoal)', fontSize: '13.5px' }}>
                        {bus.totalSeats || 40} Seats
                      </strong>
                    </div>
                  </td>
                  <td>
                    <span
                      style={{
                        padding: '3px 10px',
                        borderRadius: '999px',
                        fontSize: '11.5px',
                        fontWeight: 700,
                        background: isAc === 'AC' ? '#e0f2fe' : '#f1f5f9',
                        color: isAc === 'AC' ? '#0369a1' : '#475569',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <Wind size={11} />
                      {isAc}
                    </span>
                  </td>
                  <td>
                    <div
                      style={{
                        fontSize: '12px',
                        color: '#4a453e',
                        maxWidth: '240px',
                        lineHeight: 1.4
                      }}
                    >
                      <div>
                        <strong>Boarding:</strong>{' '}
                        {(bus.boardingPoints || []).join(', ') || 'N/A'}
                      </div>
                      <div>
                        <strong>Dropping:</strong>{' '}
                        {(bus.droppingPoints || []).join(', ') || 'N/A'}
                      </div>
                    </div>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <button
                        className="btn btn-sm btn-outline"
                        onClick={() => onEditBus(bus)}
                        title="Edit Bus Details"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(bus.id, bus.busNumber)}
                        title="Remove Bus"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile View: Clickable Bus Cards */}
      <div className="mobile-bus-list">
        {buses.map((bus) => {
          const isAc =
            bus.acType === 'Non-AC' || bus.name?.toLowerCase().includes('non-ac')
              ? 'Non-AC'
              : 'AC';

          return (
            <div
              key={bus.id}
              className="mobile-bus-card"
              onClick={() => setSelectedMobileBus(bus)}
              role="button"
              tabIndex={0}
            >
              <div className="mobile-bus-card-head">
                <div className="mobile-bus-card-main">
                  <div className="mobile-bus-card-icon">
                    <Bus size={20} />
                  </div>
                  <div>
                    <h3 className="mobile-bus-card-number">{bus.busNumber}</h3>
                    <div className="mobile-bus-card-route">
                      <MapPin size={12} color="var(--coral)" />
                      <span>{bus.source} → {bus.destination}</span>
                    </div>
                  </div>
                </div>
                <div className="mobile-bus-chevron">
                  <ChevronRight size={18} />
                </div>
              </div>

              <div className="mobile-bus-card-footer">
                <div className="mobile-bus-card-tags">
                  <span className={`bus-tag ${isAc === 'AC' ? 'tag-ac' : 'tag-nonac'}`}>
                    <Wind size={11} /> {isAc}
                  </span>
                  <span className="bus-tag tag-seats">
                    <Users size={11} /> {bus.totalSeats || 40} Seats
                  </span>
                </div>
                <div className="mobile-bus-card-time">
                  <Clock size={11} /> {bus.departureTime || '20:00'}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
