import React from 'react';
import { REVIEWS } from '../data/tripsData';

export const Reviews = () => {
  return (
    <section id="reviews">
      <div className="container">
        <div className="section-head center reveal" style={{ marginLeft: 'auto', marginRight: 'auto' }}>
          <h2>Stories From The Road.</h2>
        </div>
        <div className="reviews-wrap">
          {REVIEWS.map((r, i) => (
            <div className="review-card reveal" key={i}>
              <span className="stars">★★★★★</span>
              <p className="quote">"{r.quote}"</p>
              <div className="review-who">{r.author}</div>
              <div className="review-trip">{r.trip}</div>
            </div>
          ))}
        </div>
        <p className="demo-note reveal">Verified traveler stories from past community getaways.</p>
      </div>
    </section>
  );
};
