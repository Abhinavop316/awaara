import React from 'react';

export const ComingSoonCard = ({ item, onRegisterInterest }) => {
  return (
    <div className="coming-card">
      <div className="coming-media">
        <img
          src={item.img}
          alt={item.name}
          loading="lazy"
          onError={(e) => {
            e.target.src =
              'https://images.unsplash.com/photo-1500835556837-99ac94a94552?auto=format&fit=crop&w=900&q=80';
          }}
        />
        <span className="badge badge-soon" style={{ top: '14px', left: '14px' }}>
          <span className="badge-dot"></span>COMING SOON
        </span>
      </div>
      <div className="coming-body">
        <h3>{item.name}</h3>
        <div className="coming-season">{item.season}</div>
        <p className="coming-desc">{item.desc}</p>
        <button
          className="btn btn-outline btn-full interested-btn"
          style={{ marginTop: 'auto' }}
          onClick={() => onRegisterInterest(item)}
        >
          I'm Interested
        </button>
      </div>
    </div>
  );
};
