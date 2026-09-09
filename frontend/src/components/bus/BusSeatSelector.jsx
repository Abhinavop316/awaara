import React, { useState } from 'react';

/**
 * Interactive Bus Seat Selector for Frontend Booking
 * Clean armchair seat selection without price tags:
 * - Steering Wheel at top right
 * - Realistic armchair SVG seats with green outline for available seats
 * - Grey filled armchair for Sold seats
 * - Highlighted active state when selected
 * - Displays Seat Number underneath (or "Sold" / "Ladies")
 */
export const BusSeatSelector = ({
  selectedSeats = [],
  onSeatToggle,
  requiredSeatsCount = 1,
  busLayout,
  occupiedSeats = []
}) => {
  const [activeDeck, setActiveDeck] = useState('lower');

  // If no custom busLayout passed, generate standard 2+2 layout
  const layout = busLayout || getDefaultBookingLayout();
  const currentGrid =
    activeDeck === 'upper' && layout.hasUpperDeck
      ? layout.decks?.upper || []
      : layout.decks?.lower || [];


  return (
    <div className="seat-selector-container">
      {/* Deck Selector for Multi-Deck Sleeper / Volvo Buses */}
      {layout.hasUpperDeck && (
        <div className="deck-switcher-row">
          <button
            type="button"
            className={`deck-pill ${activeDeck === 'lower' ? 'active' : ''}`}
            onClick={() => setActiveDeck('lower')}
          >
            Lower Deck (Seater)
          </button>
          <button
            type="button"
            className={`deck-pill ${activeDeck === 'upper' ? 'active' : ''}`}
            onClick={() => setActiveDeck('upper')}
          >
            Upper Deck (Berths)
          </button>
        </div>
      )}

      {/* Bus Chassis Viewport */}
      <div className="client-bus-chassis">
        {/* Front Cockpit with Steering Wheel */}
        <div className="client-bus-cockpit">
          <span className="front-indicator">FRONT</span>
          <div className="steering-wrapper" title="Driver Cockpit">
            <svg className="steering-icon" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="22" cy="22" r="18" stroke="#8a94a6" strokeWidth="2.8" />
              <circle cx="22" cy="22" r="5" fill="#8a94a6" />
              <path d="M8 18H17M27 18H36M22 27V40" stroke="#8a94a6" strokeWidth="2.8" strokeLinecap="round" />
              <circle cx="22" cy="22" r="1.5" fill="#ffffff" />
            </svg>
          </div>
        </div>

        {/* Seats Grid */}
        <div
          className="client-seat-grid"
          style={{
            gridTemplateColumns: `repeat(${layout.cols || 5}, minmax(0, 1fr))`
          }}
        >
          {currentGrid.map((row, rIdx) =>
            row.map((cell, cIdx) => {
              if (!cell || cell.type === 'empty') {
                return (
                  <div key={`empty-${rIdx}-${cIdx}`} className="seat-slot-empty">
                    <div className="aisle-track" />
                  </div>
                );
              }

              const isSold =
                cell.status === 'booked' ||
                cell.status === 'sold' ||
                (Array.isArray(occupiedSeats) && occupiedSeats.includes(cell.seatNumber));
              const isBlocked = cell.status === 'blocked';
              const isFemale = cell.status === 'female';
              const isSleeper = cell.type === 'sleeper';
              const isSelected = selectedSeats.some((s) => s.id === cell.id || s.seatNumber === cell.seatNumber);

              let label = cell.seatNumber || '';
              if (isSold) label = 'Sold';
              else if (isBlocked) label = 'Blocked';
              else if (isFemale) label = 'Ladies';


              return (
                <div
                  key={cell.id || `seat-${rIdx}-${cIdx}`}
                  className={`client-seat-cell ${isSleeper ? 'type-sleeper' : 'type-seater'} ${
                    isSold ? 'status-sold' : isBlocked ? 'status-blocked' : isFemale ? 'status-female' : 'status-available'
                  } ${isSelected ? 'is-selected' : ''}`}
                  onClick={() => {
                    if (!isSold && !isBlocked) {
                      onSeatToggle(cell);
                    }
                  }}
                  title={
                    isSold
                      ? `Seat ${cell.seatNumber} (Sold)`
                      : isBlocked
                      ? `Seat ${cell.seatNumber} (Blocked)`
                      : `Seat ${cell.seatNumber}${isFemale ? ' (Ladies Only)' : ''}`
                  }
                >
                  <div className="seat-glyph-wrapper">
                    {isSleeper ? (
                      /* Sleeper Berth SVG */
                      <svg className="seat-svg sleeper-svg" viewBox="0 0 38 68" fill="none">
                        <rect x="2" y="2" width="34" height="64" rx="6" className="seat-frame" strokeWidth="2" />
                        <rect x="6" y="6" width="26" height="16" rx="4" className="seat-pillow" strokeWidth="1.5" />
                        <line x1="6" y1="28" x2="32" y2="28" className="seat-inner-line" strokeWidth="1.5" strokeDasharray="2 2" />
                        <line x1="6" y1="46" x2="32" y2="46" className="seat-inner-line" strokeWidth="1.5" strokeDasharray="2 2" />
                      </svg>
                    ) : (
                      /* Armchair Bus Seat SVG */
                      <svg className="seat-svg armchair-svg" viewBox="0 0 44 48" fill="none">
                        <path
                          d="M10 6C10 3.79086 11.7909 2 14 2H30C32.2091 2 34 3.79086 34 6V16C36.7614 16 39 18.2386 39 21V38C39 40.2091 37.2091 42 35 42H9C6.79086 42 5 40.2091 5 38V21C5 18.2386 7.23858 16 10 16V6Z"
                          className="seat-outline"
                          strokeWidth="2.5"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M13 13C13 10.7909 14.7909 9 17 9H27C29.2091 9 31 10.7909 31 13V29C31 32.3137 28.3137 35 25 35H19C15.6863 35 13 32.3137 13 29V13Z"
                          className="seat-cushion"
                          strokeWidth="2.2"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M11 42V45C11 46.1046 11.8954 47 13 47H31C32.1046 47 33 46.1046 33 45V42"
                          className="seat-base-tab"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                    )}

                    {/* Subtle seat number inside */}
                    <span className="seat-tag-number">{cell.seatNumber}</span>
                  </div>

                  {/* Seat number / Sold label beneath chair */}
                  <span className={`seat-bottom-label ${isSold ? 'label-sold' : isFemale ? 'label-female' : 'label-seatno'}`}>
                    {label}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Seat Selection Legend */}
      <div className="seat-selection-legend">
        <div className="legend-item">
          <div className="legend-sample available"></div>
          <span>Available</span>
        </div>
        <div className="legend-item">
          <div className="legend-sample selected"></div>
          <span>Selected</span>
        </div>
        <div className="legend-item">
          <div className="legend-sample sold"></div>
          <span>Sold</span>
        </div>
        <div className="legend-item">
          <div className="legend-sample female"></div>
          <span>Ladies</span>
        </div>
      </div>

      {/* Selected Seats summary bar */}
      <div className="selected-seats-summary-pill">
        <div>
          <span className="summary-title">Selected Seats:</span>{' '}
          <strong>
            {selectedSeats.length > 0
              ? selectedSeats.map((s) => s.seatNumber).join(', ')
              : 'None selected'}
          </strong>
        </div>
        <div className="seats-count-badge">
          {selectedSeats.length} / {requiredSeatsCount} Seats Picked
        </div>
      </div>
    </div>
  );
};

// Generates the reference 2+2 layout with 11 rows, 5 columns
function getDefaultBookingLayout() {
  const rows = 11;
  const cols = 5;
  const grid = [];
  let seatCounter = 1;

  for (let r = 0; r < rows; r++) {
    const rowCells = [];
    const isBackRow = r === rows - 1;

    for (let c = 0; c < cols; c++) {
      let isAisle = false;
      if (!isBackRow) {
        if (c === 2) isAisle = true;
        if (r === 0 && c === 1) isAisle = true; // Row 1 entrance
      }

      if (isAisle) {
        rowCells.push({
          id: `cell-${r}-${c}`,
          type: 'empty',
          seatNumber: '',
          status: 'available',
          isAisle: true
        });
      } else {
        const seatNo = `L${seatCounter++}`;

        // Match sample sold seats (Row 0 right pair, Row 5 right window)
        let initialStatus = 'available';
        if (r === 0 && (c === 3 || c === 4)) {
          initialStatus = 'booked';
        } else if (r === 5 && c === 4) {
          initialStatus = 'booked';
        }

        rowCells.push({
          id: `cell-${r}-${c}`,
          type: 'seater',
          seatNumber: seatNo,
          status: initialStatus,
          isAisle: false
        });
      }
    }
    grid.push(rowCells);
  }

  return {
    rows,
    cols,
    hasUpperDeck: false,
    decks: {
      lower: grid,
      upper: []
    }
  };
}
