import React, { useState } from 'react';
import { ModalWrapper } from './ModalWrapper';
import { formatCurrency } from '../../utils/formatters';
import { ITINERARY_DAYS } from '../../data/tripsData';

export const TripDetailModal = ({ trip, isOpen, onClose, onBookTrip, onJoinWaitlist }) => {
  const [openItineraryIndex, setOpenItineraryIndex] = useState(null);

  if (!trip) return null;

  const toggleItinerary = (index) => {
    setOpenItineraryIndex(openItineraryIndex === index ? null : index);
  };

  const renderBadge = () => {
    if (trip.status === 'open') {
      return (
        <span className="badge badge-open" style={{ position: 'static', display: 'inline-flex' }}>
          <span className="badge-dot"></span>BOOKING OPEN
        </span>
      );
    }
    if (trip.status === 'limited') {
      return (
        <span className="badge badge-limited" style={{ position: 'static', display: 'inline-flex' }}>
          <span className="badge-dot"></span>LIMITED SEATS
        </span>
      );
    }
    if (trip.status === 'soldout') {
      return (
        <span className="badge badge-soldout" style={{ position: 'static', display: 'inline-flex' }}>
          <span className="badge-dot"></span>SOLD OUT
        </span>
      );
    }
    return null;
  };

  const handleActionClick = () => {
    if (trip.status === 'soldout') {
      onJoinWaitlist(trip);
    } else {
      onBookTrip(trip);
    }
  };

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose}>
      <div className="trip-detail-media">
        <img
          src={trip.img}
          alt={trip.name}
          onError={(e) => {
            e.target.src =
              'https://images.unsplash.com/photo-1500835556837-99ac94a94552?auto=format&fit=crop&w=900&q=80';
          }}
        />
      </div>

      <div className="trip-detail-body">
        <div className="td-top">
          <div>
            {renderBadge()}
            <h2 style={{ marginTop: '12px' }}>{trip.name}</h2>
          </div>
          <div className="td-price">
            {formatCurrency(trip.price)}
            <div style={{ fontSize: '12px', fontWeight: '400', color: '#8a8175', textAlign: 'right' }}>
              per person
            </div>
          </div>
        </div>

        <div className="td-meta">
          <span>📅 {trip.dates}</span>
          <span>🕒 {trip.duration}</span>
          <span>👥 {trip.seats > 0 ? `${trip.seats} seats left` : 'Sold out'}</span>
        </div>

        <div className="td-section">
          <h4>HIGHLIGHTS</h4>
          <ul className="td-highlights">
            <li>Scenic boutique stays</li>
            <li>Handcrafted local experiences</li>
            <li>Experienced tour leaders</li>
            <li>Curated group activities</li>
          </ul>
        </div>

        <div className="td-section">
          <h4>ITINERARY</h4>
          <div id="itineraryList">
            {ITINERARY_DAYS.map((dayDesc, idx) => {
              const isOpenDay = openItineraryIndex === idx;
              return (
                <div className="itinerary-item" key={idx}>
                  <button className="itinerary-q" onClick={() => toggleItinerary(idx)}>
                    <span>Day {idx + 1}</span>
                    <span className="faq-plus" style={{ transform: isOpenDay ? 'rotate(45deg)' : 'rotate(0deg)' }}>
                      +
                    </span>
                  </button>
                  <div className={`itinerary-a ${isOpenDay ? 'open' : ''}`}>
                    <p>{dayDesc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="td-section">
          <h4>WHAT'S INCLUDED</h4>
          <div className="incl-grid">
            <ul className="incl-list">
              <li>
                <span className="incl-yes">✓</span> Handpicked Stay
              </li>
              <li>
                <span className="incl-yes">✓</span> On-ground Transportation
              </li>
              <li>
                <span className="incl-yes">✓</span> Selected Gourmet Meals
              </li>
              <li>
                <span className="incl-yes">✓</span> Guided Activities
              </li>
            </ul>
            <ul className="incl-list">
              <li>
                <span className="incl-no">×</span> Personal expenses
              </li>
              <li>
                <span className="incl-no">×</span> Travel Insurance
              </li>
              <li>
                <span className="incl-no">×</span> Optional individual activities
              </li>
            </ul>
          </div>
        </div>

        <button
          className="btn btn-primary btn-full"
          onClick={handleActionClick}
          style={{ padding: '17px' }}
        >
          {trip.status === 'soldout' ? 'Join Waitlist' : 'Book This Trip'}
        </button>
      </div>
    </ModalWrapper>
  );
};
