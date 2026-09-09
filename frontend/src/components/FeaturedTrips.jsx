import React from 'react';
import { TripCard } from './TripCard';

export const FeaturedTrips = ({ trips, onSelectTrip, onClearFilters }) => {
  return (
    <section id="trips">
      <div className="container">
        <div className="section-head reveal">
          <h2>Your Next Chapter Starts Here.</h2>
          <p>Handpicked journeys designed for people who'd rather collect memories than things.</p>
        </div>

        {trips.length > 0 ? (
          <div className="trip-grid" id="tripGrid">
            {trips.map((trip) => (
              <TripCard key={trip.id} trip={trip} onSelectTrip={onSelectTrip} />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <p style={{ color: '#6b6459', fontSize: '16px', marginBottom: '18px' }}>
              No trips match those filters yet — try widening your search.
            </p>
            {onClearFilters && (
              <button className="btn btn-outline" onClick={onClearFilters}>
                Show All Trips
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
