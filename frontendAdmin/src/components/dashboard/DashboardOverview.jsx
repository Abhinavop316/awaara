import React, { useState, useEffect } from 'react';
import { useAdminData } from '../../context/AdminDataContext';
import { StatCard } from '../common/StatCard';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { placeApi } from '../../services/placeApi';
import {
  Compass,
  Users,
  CreditCard,
  MapPin,
  ArrowRight,
  Sparkles,
  Ticket
} from 'lucide-react';

export const DashboardOverview = ({
  onNavigateTab,
  onOpenNewTrip
}) => {
  const { trips, bookings } = useAdminData();
  const [placesCount, setPlacesCount] = useState(8);

  useEffect(() => {
    placeApi.getAllPlaces().then((res) => {
      if (res && res.success && res.places) {
        setPlacesCount(res.total || res.places.length);
      }
    }).catch(() => {});
  }, []);

  const totalRevenue = bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
  const openTripsCount = trips.filter((t) => t.status === 'open' || t.status === 'limited').length;

  return (
    <div>
      {/* 4 KPI Metrics */}
      <div className="stats-grid">
        <StatCard
          title="ACTIVE CURATED TRIPS"
          value={trips.length}
          subtext={`${openTripsCount} open for booking`}
          icon={<Compass size={22} />}
        />
        <StatCard
          title="HOLIDAY DESTINATIONS"
          value={placesCount}
          subtext="Curated India holiday itineraries"
          icon={<MapPin size={22} />}
        />
        <StatCard
          title="CONFIRMED PASSENGERS"
          value={bookings.length}
          subtext="Verified traveler bookings"
          icon={<Users size={22} />}
        />
        <StatCard
          title="TOTAL REVENUE"
          value={formatCurrency(totalRevenue)}
          subtext="Processed via UPI & Cards"
          icon={<CreditCard size={22} />}
        />
      </div>

      {/* Quick Action Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #211d1a 0%, #38312b 100%)',
          color: 'var(--ivory)',
          borderRadius: 'var(--radius-lg)',
          padding: '28px 32px',
          marginBottom: '32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px',
          boxShadow: 'var(--shadow-lift)'
        }}
      >
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(224, 102, 63, 0.25)', color: 'var(--coral)', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', marginBottom: '8px' }}>
            <Sparkles size={13} />
            <span>ALL-INDIA HOLIDAYS PORTAL</span>
          </div>
          <h2 style={{ color: 'var(--ivory)', fontSize: '23px', marginBottom: '6px' }}>
            Curated India Holiday Packages & Itineraries
          </h2>
          <p style={{ color: 'rgba(250, 246, 239, 0.75)', fontSize: '14px', maxWidth: '580px', margin: 0 }}>
            Manage Day-by-Day travel plans, iconic attractions, verified hotel stays, and custom pricing across Indian states.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            className="btn btn-primary"
            onClick={() => onNavigateTab('holidays')}
          >
            <MapPin size={15} /> Manage Holiday Places →
          </button>
        </div>
      </div>

      {/* Grid of 2 Panes: Upcoming Trips & Recent Bookings */}
      <div className="dashboard-panes-grid">
        {/* Pane 1: Upcoming Trips */}
        <div className="panel-card dashboard-pane-trips" style={{ marginBottom: 0 }}>
          <div className="panel-head">
            <div>
              <h2>Upcoming Curated Trips</h2>
              <p>Top scheduled departures</p>
            </div>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => onNavigateTab('trips')}
            >
              View All <ArrowRight size={13} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {trips.slice(0, 4).map((trip) => (
              <div
                key={trip.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 14px',
                  background: 'var(--ivory-dim)',
                  borderRadius: 'var(--radius-sm)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img
                    src={trip.img}
                    alt={trip.name}
                    style={{ width: '42px', height: '36px', borderRadius: '6px', objectFit: 'cover' }}
                  />
                  <div>
                    <strong style={{ fontSize: '14px' }}>{trip.name}</strong>
                    <div style={{ fontSize: '12px', color: '#7a7267' }}>
                      {trip.dates} · {formatCurrency(trip.price)}
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span className={`badge-pill badge-${trip.status}`} style={{ fontSize: '11px' }}>
                    {trip.status.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pane 2: Recent Bookings */}
        <div className="panel-card" style={{ marginBottom: 0 }}>
          <div className="panel-head">
            <div>
              <h2>Recent Passenger Bookings</h2>
              <p>Live passenger manifest & reservations</p>
            </div>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => onNavigateTab('bookings')}
            >
              View Manifest <ArrowRight size={13} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {bookings.slice(0, 4).map((booking) => (
              <div
                key={booking.id}
                style={{
                  padding: '12px 14px',
                  background: 'var(--ivory-dim)',
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Ticket size={14} color="var(--coral)" />
                    <strong style={{ fontSize: '13.5px' }}>{booking.passengerName}</strong>
                  </div>
                  <div style={{ fontSize: '12px', color: '#7a7267', marginTop: '2px' }}>
                    {booking.tripName}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <strong style={{ fontSize: '13px', color: 'var(--charcoal)' }}>
                    {formatCurrency(booking.totalAmount)}
                  </strong>
                  <div style={{ fontSize: '11px', color: 'var(--sage-dark)', fontWeight: 600 }}>
                    {booking.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
