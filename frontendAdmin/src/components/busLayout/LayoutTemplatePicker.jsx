import React from 'react';
import { countBookableSeats } from '../../utils/layoutHelpers';

export const LayoutTemplatePicker = ({
  templates,
  activeTemplateId,
  onSelectTemplate,
  onCreateNewTemplate
}) => {
  return (
    <div className="panel-card">
      <div className="panel-head">
        <div>
          <h2>Bus Layout Templates</h2>
          <p>Choose a base template to edit or design a custom layout</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={onCreateNewTemplate}>
          + Create Blank Layout
        </button>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 220px), 1fr))',
          gap: '14px'
        }}
      >
        {templates.map((tpl) => {
          const isSelected = tpl.id === activeTemplateId;
          const totalSeats = countBookableSeats(tpl);

          return (
            <div
              key={tpl.id}
              onClick={() => onSelectTemplate(tpl)}
              style={{
                border: isSelected ? '2px solid var(--coral)' : '1px solid var(--line)',
                background: isSelected ? 'rgba(224, 102, 63, 0.05)' : '#fff',
                borderRadius: 'var(--radius-md)',
                padding: '18px 20px',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                boxShadow: isSelected ? 'var(--shadow-soft)' : 'none'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h4 style={{ fontSize: '16px', marginBottom: '4px' }}>{tpl.name}</h4>
                <span
                  className="badge-pill badge-active"
                  style={{ fontSize: '11px', padding: '2px 8px' }}
                >
                  {totalSeats} Seats
                </span>
              </div>
              <p style={{ fontSize: '12.5px', color: '#7a7267', margin: '6px 0 12px', lineHeight: 1.4 }}>
                {tpl.description}
              </p>
              <div style={{ display: 'flex', gap: '8px', fontSize: '11.5px', color: 'var(--sage-dark)', fontWeight: 600 }}>
                <span>📐 {tpl.rows}x{tpl.cols} Grid</span>
                <span>•</span>
                <span>{tpl.hasUpperDeck ? 'Double Deck' : 'Single Deck'}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
