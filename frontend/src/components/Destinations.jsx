import React from 'react';
import { DESTINATIONS_DATA } from '../data/tripsData';

export const Destinations = ({ onSelectDestination }) => {
  return (
    <section id="destinations">
      <div className="container">
        <div className="section-head reveal">
          <h2>Popular Destinations.</h2>
          <p>Where fellow travelers are headed next.</p>
        </div>
        <div className="dest-grid reveal">
          {DESTINATIONS_DATA.map((dest) => (
            <div
              key={dest.name}
              className={`dest-item ${dest.className}`}
              onClick={() => onSelectDestination(dest.name)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onSelectDestination(dest.name);
                }
              }}
            >
              <img
                src={dest.img}
                alt={dest.name}
                loading="lazy"
                onError={(e) => {
                  e.target.src =
                    'https://images.unsplash.com/photo-1500835556837-99ac94a94552?auto=format&fit=crop&w=900&q=80';
                }}
              />
              <div className="dest-label">
                <h3>{dest.name}</h3>
                <div className="dest-explore">Explore Destination →</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
