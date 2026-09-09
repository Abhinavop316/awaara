import React from 'react';
import { formatCurrency } from '../utils/formatters';

export const TripCard = ({ trip, onSelectTrip }) => {
  const renderBadge = () => {
    if (trip.status === 'open') {
      return (
        <span className="badge badge-open">
          <span className="badge-dot"></span>BOOKING OPEN
        </span>
      );
    }
    if (trip.status === 'limited') {
      return (
        <span className="badge badge-limited">
          <span className="badge-dot"></span>LIMITED SEATS
        </span>
      );
    }
    if (trip.status === 'soldout') {
      return (
        <span className="badge badge-soldout">
          <span className="badge-dot"></span>SOLD OUT
        </span>
      );
    }
    return null;
  };

  return (
    <div className="trip-card" onClick={() => onSelectTrip(trip)}>
      <div className="trip-media">
        <img
          src={trip.img}
          alt={trip.name}
          loading="lazy"
          onError={(e) => {
            e.target.src =
              'https://images.unsplash.com/photo-1500835556837-99ac94a94552?auto=format&fit=crop&w=900&q=80';
          }}
        />
        {renderBadge()}
      </div>
      <div className="trip-body">
        <div className="trip-top">
          <h3>{trip.name}</h3>
          <span className="trip-price">{formatCurrency(trip.price)}</span>
        </div>
        <div className="trip-meta">
          <span>{trip.dates}</span>
          <span>{trip.duration}</span>
        </div>
        <div className="trip-highlight">{trip.highlight}</div>
        <button
          className="btn btn-outline btn-full"
          onClick={(e) => {
            e.stopPropagation();
            onSelectTrip(trip);
          }}
        >
          {trip.status === 'soldout' ? 'Join Waitlist' : 'View Trip'}
        </button>
      </div>
    </div>
  );
};
