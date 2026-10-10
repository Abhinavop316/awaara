import React, { useState } from 'react';
import { useAdminData } from '../../context/AdminDataContext';
import { CustomSelect } from '../common/CustomSelect';
import { Download, Users, Mail, Phone, RefreshCw, Search, Filter, Compass, ExternalLink, Calendar, MapPin, X } from 'lucide-react';

export const BookingsManifest = ({ showToast, onEditTrip }) => {
  const { bookings, trips, refreshBookings, isSyncingBookings } = useAdminData();
  const [selectedTripFilter, setSelectedTripFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTripPreview, setSelectedTripPreview] = useState(null);

  const filteredBookings = bookings.filter((b) => {
    if (selectedTripFilter !== 'all' && b.tripId !== selectedTripFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = (b.passengerName || '').toLowerCase().includes(q);
      const matchEmail = (b.email || '').toLowerCase().includes(q);
      const matchPhone = (b.phone || '').toLowerCase().includes(q);
      const matchTrip = (b.tripName || '').toLowerCase().includes(q);
      const matchSeat = (b.seatsBooked || []).some((s) => s.toLowerCase().includes(q));
      return matchName || matchEmail || matchPhone || matchTrip || matchSeat;
    }
    return true;
  });

  const handleManualRefresh = async () => {
    if (refreshBookings) {
      await refreshBookings();
      if (showToast) showToast('Synced latest bookings manifest from database!');
    }
  };

  const handleTripClick = (b) => {
    // Find matching trip in trips list
    const foundTrip = trips.find(
      (t) => t.id === b.tripId || t._id === b.tripId || t.name?.toLowerCase() === b.tripName?.toLowerCase()
    );

    if (onEditTrip && foundTrip) {
      onEditTrip(foundTrip);
    } else if (foundTrip) {
      setSelectedTripPreview(foundTrip);
    } else {
      setSelectedTripPreview({
        name: b.tripName,
        destination: b.tripDestination || b.tripName,
        dates: b.tripDates || 'Scheduled Departure',
        price: b.totalAmount,
        seats: b.seatsBooked?.length || 1
      });
    }
  };

  const handleExportCSV = () => {
    if (filteredBookings.length === 0) {
      if (showToast) showToast('No bookings to export.');
      return;
    }

    const headers = [
      'Customer Name',
      'Phone Number',
      'Email ID',
      'Number of Passengers',
      'Trip Name'
    ];

    const rows = filteredBookings.map((b) => [
      `"${b.passengerName || 'Traveler'}"`,
      `"${b.phone || ''}"`,
      `"${b.email || ''}"`,
      (b.seatsBooked && b.seatsBooked.length > 0) ? b.seatsBooked.length : (b.passengers || 1),
      `"${b.tripName || 'Trip'}"`
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Awaara_Manifest_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    if (showToast) showToast('Passenger manifest exported as CSV.');
  };

  return (
    <div className="panel-card">
      <div className="panel-head">
        <div>
          <h2>Passenger Bookings & Manifest</h2>
          <p>Passenger contact directory and trip reservations</p>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button
            className={`btn btn-outline btn-sm ${isSyncingBookings ? 'is-loading' : ''}`}
            onClick={handleManualRefresh}
            title="Refresh from database"
          >
            <RefreshCw size={14} className={isSyncingBookings ? 'spin-animation' : ''} />
            {isSyncingBookings ? 'Syncing...' : 'Sync Live'}
          </button>
          <button className="btn btn-primary btn-sm" onClick={handleExportCSV}>
            <Download size={14} /> Export Manifest CSV
          </button>
        </div>
      </div>

      <div style={{ marginBottom: '20px', display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ width: '280px' }}>
          <CustomSelect
            value={selectedTripFilter}
            onChange={(val) => setSelectedTripFilter(val)}
            icon={Filter}
            options={[
              { value: 'all', label: 'All Trips & Departures' },
              ...trips.map((t) => ({
                value: t.id || t._id,
                label: `${t.name} (${t.dates || 'Upcoming'})`
              }))
            ]}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: '220px' }}>
          <div style={{ position: 'relative', width: '100%' }}>
            <Search
              size={15}
              style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#9e9589' }}
            />
            <input
              type="text"
              placeholder="Search by customer name, phone, email, or trip..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px 8px 32px',
                borderRadius: 'var(--radius-sm)',
                border: '1.5px solid var(--line-strong)',
                fontSize: '13.5px',
                background: '#fff'
              }}
            />
          </div>
        </div>
      </div>

      <div className="data-table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Customer Name</th>
              <th>Phone Number</th>
              <th>Email ID (Click to Send)</th>
              <th>No. of Passengers</th>
              <th>Trip Name (Click to View)</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.map((b) => {
              const passengerCount = (b.seatsBooked && b.seatsBooked.length > 0)
                ? b.seatsBooked.length
                : (b.passengers || 1);

              return (
                <tr key={b.id || b._id}>
                  {/* 1. Customer Name */}
                  <td>
                    <div style={{ fontWeight: '700', color: 'var(--charcoal)', fontSize: '14.5px' }}>
                      {b.passengerName || 'Traveler'}
                    </div>
                  </td>

                  {/* 2. Phone Number */}
                  <td>
                    {b.phone ? (
                      <a
                        href={`tel:${b.phone}`}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          color: 'var(--charcoal)',
                          textDecoration: 'none',
                          fontWeight: '600',
                          fontSize: '13.5px',
                          transition: 'color 0.2s ease'
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--coral)')}
                        onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--charcoal)')}
                        title={`Call ${b.phone}`}
                      >
                        <Phone size={13} color="var(--coral)" />
                        <span>{b.phone}</span>
                      </a>
                    ) : (
                      <span style={{ color: '#999', fontSize: '13px' }}>—</span>
                    )}
                  </td>

                  {/* 3. Email ID (Clickable mailto:) */}
                  <td>
                    {b.email ? (
                      <a
                        href={`mailto:${b.email}?subject=Regarding your Awaara booking for ${encodeURIComponent(b.tripName || 'Trip')}`}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          color: '#2563eb',
                          textDecoration: 'none',
                          fontWeight: '600',
                          fontSize: '13.5px',
                          padding: '4px 8px',
                          borderRadius: '6px',
                          background: 'rgba(37, 99, 235, 0.08)',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(37, 99, 235, 0.18)';
                          e.currentTarget.style.textDecoration = 'underline';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'rgba(37, 99, 235, 0.08)';
                          e.currentTarget.style.textDecoration = 'none';
                        }}
                        title={`Click to send email to ${b.email}`}
                      >
                        <Mail size={13} />
                        <span>{b.email}</span>
                      </a>
                    ) : (
                      <span style={{ color: '#999', fontSize: '13px' }}>—</span>
                    )}
                  </td>

                  {/* 4. No. of Passengers */}
                  <td>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        background: 'rgba(224, 102, 63, 0.12)',
                        color: 'var(--coral)',
                        fontWeight: '700',
                        fontSize: '13px',
                        padding: '4px 10px',
                        borderRadius: '999px'
                      }}
                    >
                      <Users size={13} />
                      <span>{passengerCount} {passengerCount === 1 ? 'Passenger' : 'Passengers'}</span>
                    </span>
                  </td>

                  {/* 5. Trip Name (Clickable) */}
                  <td>
                    <button
                      type="button"
                      onClick={() => handleTripClick(b)}
                      style={{
                        background: 'none',
                        border: 'none',
                        padding: 0,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        color: 'var(--charcoal)',
                        fontWeight: '700',
                        fontSize: '14px',
                        textAlign: 'left',
                        transition: 'color 0.2s ease'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--coral)')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--charcoal)')}
                      title="Click to view trip details"
                    >
                      <Compass size={14} color="var(--coral)" />
                      <span style={{ textDecoration: 'underline', textUnderlineOffset: '3px' }}>
                        {b.tripName || 'View Trip'}
                      </span>
                      <ExternalLink size={12} style={{ opacity: 0.6 }} />
                    </button>
                  </td>
                </tr>
              );
            })}

            {filteredBookings.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '36px', color: '#7a7267' }}>
                  No passenger bookings found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Trip Quick Info Modal Preview */}
      {selectedTripPreview && (
        <div className="modal-backdrop" onClick={() => setSelectedTripPreview(null)}>
          <div
            className="modal-card"
            style={{ maxWidth: '520px', width: '92%' }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="modal-close"
              onClick={() => setSelectedTripPreview(null)}
              aria-label="Close"
            >
              <X size={18} />
            </button>

            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'inline-block', background: 'rgba(224, 102, 63, 0.12)', color: 'var(--coral)', padding: '3px 10px', borderRadius: '20px', fontSize: '11.5px', fontWeight: '700', marginBottom: '8px' }}>
                TRIP DETAILS
              </div>
              <h3 style={{ fontSize: '22px', margin: '0 0 6px', color: 'var(--charcoal)' }}>
                {selectedTripPreview.name}
              </h3>
              <p style={{ margin: 0, fontSize: '14px', color: '#666', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={14} color="var(--coral)" />
                <span>{selectedTripPreview.destination || selectedTripPreview.name}</span>
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', background: '#f8fafc', padding: '16px', borderRadius: '12px', marginBottom: '20px', border: '1px solid #e2e8f0' }}>
              <div>
                <span style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', fontWeight: '700' }}>Dates / Schedule</span>
                <div style={{ fontSize: '13.5px', fontWeight: '600', color: '#1e293b', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Calendar size={13} /> {selectedTripPreview.dates || 'Upcoming 2026'}
                </div>
              </div>

              <div>
                <span style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', fontWeight: '700' }}>Price / Person</span>
                <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--coral)', marginTop: '2px' }}>
                  ₹{selectedTripPreview.price?.toLocaleString('en-IN') || '—'}
                </div>
              </div>

              <div>
                <span style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', fontWeight: '700' }}>Duration</span>
                <div style={{ fontSize: '13.5px', fontWeight: '600', color: '#1e293b', marginTop: '2px' }}>
                  {selectedTripPreview.duration || `${selectedTripPreview.durationDays || 5} Days`}
                </div>
              </div>

              <div>
                <span style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', fontWeight: '700' }}>Available Capacity</span>
                <div style={{ fontSize: '13.5px', fontWeight: '600', color: '#1e293b', marginTop: '2px' }}>
                  {selectedTripPreview.seats || 25} Travelers Capacity
                </div>
              </div>
            </div>

            {selectedTripPreview.highlight && (
              <div style={{ marginBottom: '20px', background: '#fefce8', border: '1px solid #fef08a', padding: '10px 14px', borderRadius: '10px', fontSize: '13px', color: '#713f12' }}>
                ✨ <strong>Highlight:</strong> {selectedTripPreview.highlight}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              {onEditTrip && (
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => {
                    const t = selectedTripPreview;
                    setSelectedTripPreview(null);
                    onEditTrip(t);
                  }}
                >
                  Open in Trip Manager →
                </button>
              )}
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => setSelectedTripPreview(null)}
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

