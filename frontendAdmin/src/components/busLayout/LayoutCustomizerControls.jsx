import React from 'react';
import { countBookableSeats } from '../../utils/layoutHelpers';

export const LayoutCustomizerControls = ({
  layout,
  onUpdateLayoutMeta,
  onAutoRenumber,
  onToggleBackRowFive,
  onRandomizeSold,
  onSaveTemplate,
  onResetLayout
}) => {
  const totalSeats = countBookableSeats(layout);

  return (
    <div className="panel-card" style={{ height: 'fit-content' }}>
      <h3 style={{ fontSize: '18px', marginBottom: '14px' }}>Cabin Studio Controls</h3>

      <div className="form-group" style={{ marginBottom: '14px' }}>
        <label>Template Name</label>
        <input
          type="text"
          value={layout.name}
          onChange={(e) => onUpdateLayoutMeta('name', e.target.value)}
        />
      </div>

      <div className="form-group" style={{ marginBottom: '14px' }}>
        <label>Description</label>
        <input
          type="text"
          value={layout.description || ''}
          onChange={(e) => onUpdateLayoutMeta('description', e.target.value)}
        />
      </div>

      <div className="form-grid" style={{ marginBottom: '14px' }}>
        <div className="form-group">
          <label>Rows</label>
          <input
            type="number"
            min={4}
            max={14}
            value={layout.rows}
            onChange={(e) => onUpdateLayoutMeta('rows', parseInt(e.target.value) || 8)}
          />
        </div>
        <div className="form-group">
          <label>Columns</label>
          <input
            type="number"
            min={3}
            max={6}
            value={layout.cols}
            onChange={(e) => onUpdateLayoutMeta('cols', parseInt(e.target.value) || 4)}
          />
        </div>
      </div>

      <div className="form-group" style={{ marginBottom: '14px' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={layout.hasUpperDeck}
            onChange={(e) => onUpdateLayoutMeta('hasUpperDeck', e.target.checked)}
          />
          <span>Enable Upper Deck (Sleeper Berths)</span>
        </label>
      </div>

      {/* Quick Layout Helpers */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
        <button
          type="button"
          className="btn btn-outline btn-sm"
          style={{ fontSize: '11.5px', padding: '6px 10px' }}
          onClick={onToggleBackRowFive}
          title="Fills the center aisle in the last row to make a 5-seater back row like standard buses"
        >
          💺 Fill Back Row (5 Seats)
        </button>
        <button
          type="button"
          className="btn btn-outline btn-sm"
          style={{ fontSize: '11.5px', padding: '6px 10px' }}
          onClick={onRandomizeSold}
          title="Randomly marks some seats as sold for demo preview"
        >
          🎲 Sample Sold Seats
        </button>
      </div>

      <div
        style={{
          background: 'var(--ivory-dim)',
          padding: '12px 14px',
          borderRadius: 'var(--radius-sm)',
          marginBottom: '18px',
          fontSize: '13px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <span>Total Bookable Capacity:</span>
        <strong style={{ color: '#0e7033', fontSize: '16px' }}>{totalSeats} Seats</strong>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <button
          type="button"
          className="btn btn-outline btn-sm"
          onClick={onAutoRenumber}
        >
          🔢 Auto-Renumber All Seats
        </button>

        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={onSaveTemplate}
        >
          💾 Save Layout Template
        </button>

        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={onResetLayout}
        >
          Discard Changes
        </button>
      </div>
    </div>
  );
};
