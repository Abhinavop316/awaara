import React from 'react';
import { CustomSelect } from '../common/CustomSelect';

export const SeatEditorSidebar = ({
  selectedCell,
  onUpdateCell,
  onClearSelection
}) => {
  if (!selectedCell || !selectedCell.data) {
    return (
      <div className="panel-card seat-inspector-card">
        <div className="inspector-empty-state">
          <div className="inspector-icon">💺</div>
          <h3 style={{ fontSize: '17px', marginBottom: '6px' }}>Seat Inspector</h3>
          <p style={{ fontSize: '13px', color: '#7a7267', lineHeight: 1.5 }}>
            Click on any seat or space in the bus cabin to edit its seat number, type (Seater/Sleeper/Aisle), and availability status.
          </p>
        </div>
      </div>
    );
  }

  const { data, deck, r, c } = selectedCell;

  const handleFieldChange = (field, value) => {
    onUpdateCell(deck, r, c, { ...data, [field]: value });
  };

  return (
    <div className="panel-card seat-inspector-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <h3 style={{ fontSize: '17px' }}>Edit Seat</h3>
          <div style={{ fontSize: '12px', color: '#7a7267' }}>
            {deck.toUpperCase()} Deck · Row {r + 1}, Col {c + 1}
          </div>
        </div>
        <button className="btn btn-sm btn-outline" onClick={onClearSelection}>
          Done
        </button>
      </div>

      <div className="form-group" style={{ marginBottom: '14px' }}>
        <label>Seat / Space Type</label>
        <CustomSelect
          value={data.type}
          onChange={(val) => handleFieldChange('type', val)}
          options={[
            { value: 'seater', label: 'Seater Armchair (Standard)' },
            { value: 'sleeper', label: 'Sleeper Berth' },
            { value: 'empty', label: 'Empty / Aisle Walkway' },
            { value: 'restroom', label: 'Restroom / WC' }
          ]}
        />
      </div>

      {data.type !== 'empty' && data.type !== 'restroom' && (
        <>
          <div className="form-group" style={{ marginBottom: '14px' }}>
            <label>Seat Number / Label</label>
            <input
              type="text"
              value={data.seatNumber || ''}
              placeholder="e.g. 1A, L1"
              onChange={(e) => handleFieldChange('seatNumber', e.target.value)}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '14px' }}>
            <label>Availability & Status</label>
            <CustomSelect
              value={data.status || 'available'}
              onChange={(val) => handleFieldChange('status', val)}
              options={[
                { value: 'available', label: 'Available (Green / Bookable)', color: '#16a34a' },
                { value: 'booked', label: 'Sold / Booked (Grey Filled)', color: '#9ca3af' },
                { value: 'female', label: 'Ladies Only (Reserved)', color: '#e11d48' },
                { value: 'blocked', label: 'Blocked / Staff Reserved', color: '#d97706' }
              ]}
            />
          </div>
        </>
      )}

      <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
        <button
          type="button"
          className="btn btn-sm btn-outline"
          style={{ flex: 1 }}
          onClick={() => {
            const nextType = data.type === 'empty' ? 'seater' : 'empty';
            handleFieldChange('type', nextType);
          }}
        >
          {data.type === 'empty' ? '➕ Convert to Seat' : '🚶 Convert to Aisle'}
        </button>

        {data.type !== 'empty' && (
          <button
            type="button"
            className="btn btn-sm btn-ghost"
            onClick={() => {
              const nextStatus = data.status === 'booked' ? 'available' : 'booked';
              handleFieldChange('status', nextStatus);
            }}
          >
            {data.status === 'booked' ? 'Mark Available' : 'Mark Sold'}
          </button>
        )}
      </div>
    </div>
  );
};
