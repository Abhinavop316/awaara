import React, { useState } from 'react';
import { BusSeatItem } from './BusSeatItem';

export const SeatLayoutCanvas = ({
  layout,
  activeDeck,
  setActiveDeck,
  selectedCell,
  onSelectCell,
  steeringPosition = 'right' // 'right' | 'left'
}) => {
  const [canvasTheme, setCanvasTheme] = useState('light'); // 'light' | 'dark'

  const currentGrid =
    activeDeck === 'upper' && layout.hasUpperDeck
      ? layout.decks.upper || []
      : layout.decks.lower || [];

  return (
    <div className={`cabin-viewport theme-${canvasTheme}`}>
      {/* Top Viewport Header with Deck Switcher & Theme Control */}
      <div className="canvas-header-bar">
        {/* Deck Switcher for Multi-Deck Sleeper Buses */}
        {layout.hasUpperDeck ? (
          <div className="deck-tabs">
            <button
              className={`deck-tab ${activeDeck === 'lower' ? 'active' : ''}`}
              onClick={() => setActiveDeck('lower')}
            >
              Lower Deck (Main)
            </button>
            <button
              className={`deck-tab ${activeDeck === 'upper' ? 'active' : ''}`}
              onClick={() => setActiveDeck('upper')}
            >
              Upper Deck (Berths)
            </button>
          </div>
        ) : (
          <div className="single-deck-indicator">
            <span>Bus Cabin Layout (Single Deck)</span>
          </div>
        )}

        {/* View Controls */}
        <div className="canvas-mode-toggle">
          <button
            className={`mode-pill ${canvasTheme === 'light' ? 'active' : ''}`}
            onClick={() => setCanvasTheme('light')}
            title="Clean Light Chassis (Client Booking View)"
          >
            ☀️ Light View
          </button>
          <button
            className={`mode-pill ${canvasTheme === 'dark' ? 'active' : ''}`}
            onClick={() => setCanvasTheme('dark')}
            title="Dark Cabin Inspector"
          >
            🌙 Dark View
          </button>
        </div>
      </div>

      {/* Modern Bus Chassis Frame */}
      <div className="bus-chassis-wrapper">
        <div className="modern-bus-chassis">
          {/* Driver Cockpit Row with Steering Wheel */}
          <div className={`bus-cockpit ${steeringPosition === 'left' ? 'steering-left' : 'steering-right'}`}>
            <div className="cockpit-driver-zone">
              <svg className="steering-icon" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="22" cy="22" r="18" stroke="#8a94a6" strokeWidth="2.8" />
                <circle cx="22" cy="22" r="5" fill="#8a94a6" />
                <path d="M8 18H17M27 18H36M22 27V40" stroke="#8a94a6" strokeWidth="2.8" strokeLinecap="round" />
                <circle cx="22" cy="22" r="1.5" fill="#ffffff" />
              </svg>
            </div>
            <div className="cabin-deck-badge">
              {activeDeck === 'upper' ? 'UPPER DECK' : 'LOWER DECK'}
            </div>
          </div>

          {/* Seat Grid Matrix */}
          <div
            className="seat-matrix-grid"
            style={{
              gridTemplateColumns: `repeat(${layout.cols || 5}, minmax(0, 1fr))`
            }}
          >
            {currentGrid.map((row, rIdx) =>
              row.map((cell, cIdx) => {
                const isSelected =
                  selectedCell?.deck === activeDeck &&
                  selectedCell?.r === rIdx &&
                  selectedCell?.c === cIdx;

                return (
                  <div
                    key={cell.id || `cell-${rIdx}-${cIdx}`}
                    className={`seat-cell-wrapper ${isSelected ? 'cell-selected' : ''}`}
                    onClick={() =>
                      onSelectCell({
                        deck: activeDeck,
                        r: rIdx,
                        c: cIdx,
                        data: cell
                      })
                    }
                  >
                    <BusSeatItem
                      cell={cell}
                      isSelected={isSelected}
                      isInteractive={true}
                      showPrice={true}
                      theme={canvasTheme}
                    />
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Clean Status Legend */}
      <div className="canvas-bottom-legend">
        <div className="legend-entry">
          <svg width="18" height="18" viewBox="0 0 44 48" fill="none">
            <path
              d="M10 6C10 3.79 11.79 2 14 2H30C32.2 2 34 3.79 34 6V16C36.76 16 39 18.24 39 21V38C39 40.2 37.2 42 35 42H9C6.79 42 5 40.2 5 38V21C5 18.24 7.24 16 10 16V6Z"
              stroke="#0e7033"
              strokeWidth="3"
            />
            <path d="M13 13C13 10.79 14.79 9 17 9H27C29.2 9 31 10.79 31 13V29C31 32.31 28.31 35 25 35H19C15.69 35 13 32.31 13 29V13Z" stroke="#0e7033" strokeWidth="2.5" />
          </svg>
          <span>Available</span>
        </div>

        <div className="legend-entry">
          <svg width="18" height="18" viewBox="0 0 44 48" fill="none">
            <path
              d="M10 6C10 3.79 11.79 2 14 2H30C32.2 2 34 3.79 34 6V16C36.76 16 39 18.24 39 21V38C39 40.2 37.2 42 35 42H9C6.79 42 5 40.2 5 38V21C5 18.24 7.24 16 10 16V6Z"
              fill="#d1d5db"
            />
          </svg>
          <span>Sold / Booked</span>
        </div>

        <div className="legend-entry">
          <svg width="18" height="18" viewBox="0 0 44 48" fill="none">
            <path
              d="M10 6C10 3.79 11.79 2 14 2H30C32.2 2 34 3.79 34 6V16C36.76 16 39 18.24 39 21V38C39 40.2 37.2 42 35 42H9C6.79 42 5 40.2 5 38V21C5 18.24 7.24 16 10 16V6Z"
              stroke="#e11d48"
              strokeWidth="3"
            />
          </svg>
          <span>Ladies Only</span>
        </div>

        <div className="legend-entry">
          <svg width="18" height="18" viewBox="0 0 44 48" fill="none">
            <path
              d="M10 6C10 3.79 11.79 2 14 2H30C32.2 2 34 3.79 34 6V16C36.76 16 39 18.24 39 21V38C39 40.2 37.2 42 35 42H9C6.79 42 5 40.2 5 38V21C5 18.24 7.24 16 10 16V6Z"
              fill="#0e7033"
              stroke="#0e7033"
              strokeWidth="3"
            />
          </svg>
          <span>Selected</span>
        </div>
      </div>
    </div>
  );
};
