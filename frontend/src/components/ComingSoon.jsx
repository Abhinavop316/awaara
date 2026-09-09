import React from 'react';
import { ComingSoonCard } from './ComingSoonCard';

export const ComingSoon = ({ comingSoonList, onRegisterInterest }) => {
  return (
    <section id="coming" className="coming-section">
      <div className="container">
        <div className="section-head reveal">
          <h2>
            Not Planned Yet.
            <br />
            But Maybe Because of You.
          </h2>
          <p>
            Tell us where you want to go. If enough travelers are interested, we'll make it happen.
          </p>
        </div>
        <div className="coming-grid" id="comingGrid">
          {comingSoonList.map((item) => (
            <ComingSoonCard
              key={item.id}
              item={item}
              onRegisterInterest={onRegisterInterest}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
