import React, { useState } from 'react';
import { useAdminData } from '../../context/AdminDataContext';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { CustomSelect } from '../common/CustomSelect';
import { Download, Users, Bus, Mail, Phone, Ticket, RefreshCw, Search, Filter } from 'lucide-react';

export const BookingsManifest = ({ showToast }) => {
  const { bookings, trips, buses, refreshBookings, isSyncingBookings } = useAdminData();
  const [selectedTripFilter, setSelectedTripFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBookings = bookings.filter((b) => {
    if (selectedTripFilter !== 'all' && b.tripId !== selectedTripFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = (b.id || '').toLowerCase().includes(q);
      const matchName = (b.passengerName || '').toLowerCase().includes(q);
      const matchEmail = (b.email || '').toLowerCase().includes(q);
      const matchPhone = (b.phone || '').toLowerCase().includes(q);
      const matchTrip = (b.tripName || '').toLowerCase().includes(q);
      const matchSeat = (b.seatsBooked || []).some((s) => s.toLowerCase().includes(q));
      return matchId || matchName || matchEmail || matchPhone || matchTrip || matchSeat;
    }
    return true;
  });

  const handleManualRefresh = async () => {
    if (refreshBookings) {
      await refreshBookings();
      showToast('Synced latest bookings & seat manifest from database!');
    }
  };

  const handleExportCSV = () => {
    if (filteredBookings.length === 0) {
      alert('No bookings to export.');
      return;
    }

    const headers = [
      'Booking Reference',
      'Passenger Name',
      'Email',
      'Phone',
      'Trip Destination',
      'Coach Plate',
      'Allocated Seats',
      'Amount Paid (INR)',
      'Status',
      'Booking Date'
    ];

    const rows = filteredBookings.map((b) => [
      b.id,
      `"${b.passengerName}"`,
      b.email,
      b.phone,
      `"${b.tripName}"`,
      b.busNumber || 'N/A',
      `"${(b.seatsBooked || []).join(', ')}"`,
      b.totalAmount,
      b.status,
      new Date(b.bookingDate).toLocaleDateString('en-IN')
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
    showToast('Passenger manifest exported as CSV.');
  };

  return (
    <div className="panel-card">
      <div className="panel-head">
        <div>
          <h2>Passenger Bookings & Fleet Manifest</h2>
          <p>Real-time passenger manifest, confirmed ticket allocations, and seat rosters</p>
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
              { value: 'all', label: 'All Trips & Runs' },
              ...trips.map((t) => ({
                value: t.id,
                label: `${t.name} (${t.dates})`
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
              placeholder="Search by Passenger, Seat No, Ref ID, Phone..."
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
              <th>Booking ID</th>
              <th>Passenger Details</th>
              <th>Trip / Destination</th>
              <th>Assigned Bus</th>
              <th>Booked Seats</th>
              <th>Total Amount</th>
              <th>Status</th>
              <th>Booking Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.map((b) => {
              const bus = buses.find((item) => item.id === b.busId);

              return (
                <tr key={b.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Ticket size={14} color="var(--coral)" />
                      <strong>{b.id}</strong>
                    </div>
                  </td>
                  <td>
                    <strong>{b.passengerName}</strong>
                    <div style={{ fontSize: '12px', color: '#7a7267', display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '2px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Mail size={11} /> {b.email}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Phone size={11} /> {b.phone}
                      </span>
                    </div>
                  </td>
                  <td>
                    <strong>{b.tripName}</strong>
                  </td>
                  <td>
                    {bus ? (
                      <div style={{ fontSize: '12.5px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Bus size={13} color="var(--sage-dark)" />
                        <span>{bus.busNumber}</span>
                      </div>
                    ) : (
                      <span style={{ fontSize: '12px', color: '#a0988e' }}>—</span>
                    )}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                      {b.seatsBooked.map((s) => (
                        <span
                          key={s}
                          style={{
                            background: 'var(--coral)',
                            color: '#fff',
                            fontSize: '11px',
                            fontWeight: 700,
                            padding: '2px 7px',
                            borderRadius: '4px'
                          }}
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td>
                    <strong style={{ color: 'var(--coral-dark)' }}>
                      {formatCurrency(b.totalAmount)}
                    </strong>
                  </td>
                  <td>
                    <span className="badge-pill badge-open">● {b.status}</span>
                  </td>
                  <td style={{ fontSize: '12.5px', color: '#7a7267' }}>
                    {formatDate(b.bookingDate)}
                  </td>
                </tr>
              );
            })}
            {filteredBookings.length === 0 && (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '36px', color: '#7a7267' }}>
                  No passenger bookings found for this filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
