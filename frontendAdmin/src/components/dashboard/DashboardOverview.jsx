import React from 'react';
import { useAdminData } from '../../context/AdminDataContext';
import { StatCard } from '../common/StatCard';
import { formatCurrency } from '../../utils/formatters';
import {
  Compass,
  Bus,
  Users,
  CreditCard,
  PlusCircle,
  Grid,
  MapPin,
  ArrowRight
} from 'lucide-react';

export const DashboardOverview = ({
  onNavigateTab,
  onOpenNewTrip,
  onOpenNewBus
}) => {
  const { trips, buses, bookings, templates } = useAdminData();

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
          title="REGISTERED BUS FLEET"
          value={buses.length}
          subtext="Covering North & West corridors"
          icon={<Bus size={22} />}
        />
        <StatCard
          title="CONFIRMED PASSENGERS"
          value={bookings.length}
          subtext="Verified digital boarding passes"
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
          <h2 style={{ color: 'var(--ivory)', fontSize: '24px', marginBottom: '6px' }}>
            Interactive Bus Seat Layout Studio
          </h2>
          <p style={{ color: 'rgba(250, 246, 239, 0.75)', fontSize: '14.5px', maxWidth: '560px' }}>
            Design and customize custom coach seating layouts, double-decker sleeper berths, and seat surcharge tiers.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            className="btn btn-primary"
            onClick={() => onNavigateTab('layout-studio')}
          >
            <Grid size={15} /> Launch Layout Studio →
          </button>
        </div>
      </div>

      {/* Grid of 2 Panes: Upcoming Trips & Active Buses */}
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
            {trips.slice(0, 4).map((trip) => {
              const bus = buses.find((b) => b.id === trip.busId);

              return (
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
              );
            })}
          </div>
        </div>

        {/* Pane 2: Registered Buses */}
        <div className="panel-card dashboard-pane-buses" style={{ marginBottom: 0 }}>
          <div className="panel-head">
            <div>
              <h2>Active Fleet Coaches</h2>
              <p>Bus routes and templates</p>
            </div>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => onNavigateTab('buses')}
            >
              View Fleet <ArrowRight size={13} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {buses.slice(0, 4).map((bus) => (
              <div
                key={bus.id}
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
                    <Bus size={14} color="var(--coral)" />
                    <strong style={{ fontSize: '14px' }}>{bus.busNumber}</strong>
                  </div>
                  <div style={{ fontSize: '12px', color: '#7a7267', marginTop: '2px' }}>
                    {bus.source} → {bus.destination}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <strong style={{ fontSize: '13px', color: 'var(--charcoal)' }}>
                    {bus.totalSeats} Seats
                  </strong>
                  <div style={{ fontSize: '11px', color: 'var(--sage-dark)', fontWeight: 600 }}>
                    {bus.departureTime}
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
