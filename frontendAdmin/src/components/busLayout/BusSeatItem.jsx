import React from 'react';

/**
 * High-fidelity Bus Seat Component
 * Renders realistic armchair SVG seats matching clean modern aesthetic:
 * - Available: Emerald green outline with seat number beneath (e.g., L1, 1A)
 * - Sold: Soft grey filled armchair with "Sold" label beneath
 * - Selected: Vibrant highlighted green/coral state
 * - Female: Rose/pink outline with "Ladies" beneath
 * - Sleeper: Elongated rectangular berth with headrest contour
 */
export const BusSeatItem = ({
  cell,
  isSelected = false,
  isInteractive = true,
  onClick,
  onHover,
  size = 'normal', // 'normal' | 'compact' | 'large'
  theme = 'light' // 'light' | 'dark'
}) => {
  if (!cell || cell.type === 'empty') {
    return (
      <div className={`bus-seat-slot empty size-${size}`}>
        <div className="aisle-indicator"></div>
      </div>
    );
  }

  if (cell.type === 'restroom') {
    return (
      <div className={`bus-seat-slot restroom size-${size}`} title="Restroom / WC">
        <div className="restroom-box">
          <span className="restroom-icon">🚻</span>
          <span className="restroom-label">WC</span>
        </div>
      </div>
    );
  }

  const isSold = cell.status === 'booked' || cell.status === 'sold';
  const isBlocked = cell.status === 'blocked';
  const isFemale = cell.status === 'female';
  const isSleeper = cell.type === 'sleeper';

  // Get status or seat label
  let label = cell.seatNumber || '';
  if (isSold) label = 'Sold';
  else if (isBlocked) label = 'Blocked';
  else if (isFemale) label = 'Ladies';

  const handleClick = (e) => {
    if (isSold || isBlocked) return;
    if (onClick) onClick(cell, e);
  };

  return (
    <div
      className={`bus-seat-slot size-${size} ${isSleeper ? 'sleeper-slot' : 'seater-slot'} ${
        isSold ? 'status-sold' : isBlocked ? 'status-blocked' : isFemale ? 'status-female' : 'status-available'
      } ${isSelected ? 'is-selected' : ''} ${!isInteractive || isSold || isBlocked ? 'non-interactive' : ''}`}
      onClick={handleClick}
      title={`Seat ${cell.seatNumber || '—'} • ${isSold ? 'Sold' : isBlocked ? 'Blocked' : isFemale ? 'Ladies Only' : 'Available'}`}
    >
      <div className="seat-icon-wrapper">
        {isSleeper ? (
          /* Realistic Sleeper Berth SVG */
          <svg className="seat-svg sleeper-svg" viewBox="0 0 38 68" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Outer Berth Frame */}
            <rect
              x="2"
              y="2"
              width="34"
              height="64"
              rx="6"
              className="seat-frame"
              strokeWidth="2"
            />
            {/* Pillow / Headrest contour */}
            <rect
              x="6"
              y="6"
              width="26"
              height="16"
              rx="4"
              className="seat-pillow"
              strokeWidth="1.5"
            />
            {/* Berth division lines */}
            <line x1="6" y1="28" x2="32" y2="28" className="seat-inner-line" strokeWidth="1.5" strokeDasharray="2 2" />
            <line x1="6" y1="46" x2="32" y2="46" className="seat-inner-line" strokeWidth="1.5" strokeDasharray="2 2" />
          </svg>
        ) : (
          /* Realistic Armchair Bus Seat SVG matching the reference image */
          <svg className="seat-svg armchair-svg" viewBox="0 0 44 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Outer Armchair Body: Rounded Backrest top + flared armrest wings + base */}
            <path
              d="M10 6C10 3.79086 11.7909 2 14 2H30C32.2091 2 34 3.79086 34 6V16C36.7614 16 39 18.2386 39 21V38C39 40.2091 37.2091 42 35 42H9C6.79086 42 5 40.2091 5 38V21C5 18.2386 7.23858 16 10 16V6Z"
              className="seat-outline"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            {/* Inner U-shaped cushion curve contour */}
            <path
              d="M13 13C13 10.7909 14.7909 9 17 9H27C29.2091 9 31 10.7909 31 13V29C31 32.3137 28.3137 35 25 35H19C15.6863 35 13 32.3137 13 29V13Z"
              className="seat-cushion"
              strokeWidth="2.2"
              strokeLinejoin="round"
            />
            {/* Lower Base Connector */}
            <path
              d="M11 42V45C11 46.1046 11.8954 47 13 47H31C32.1046 47 33 46.1046 33 45V42"
              className="seat-base-tab"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        )}

        {/* Seat Number Tag Badge inside chair */}
        {cell.seatNumber && (
          <span className="seat-number-overlay">{cell.seatNumber}</span>
        )}
      </div>

      {/* Seat Number or Status Label beneath the chair */}
      <span className={`seat-price-label ${isSold ? 'label-sold' : isBlocked ? 'label-blocked' : isFemale ? 'label-female' : 'label-seatno'}`}>
        {label}
      </span>
    </div>
  );
};
