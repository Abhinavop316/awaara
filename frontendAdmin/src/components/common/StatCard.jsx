import React from 'react';

export const StatCard = ({ title, value, subtext, icon }) => {
  return (
    <div className="stat-card">
      <div className="stat-info">
        <div className="title">{title}</div>
        <div className="value">{value}</div>
        {subtext && <div className="subtext">{subtext}</div>}
      </div>
      {icon && <div className="stat-icon">{icon}</div>}
    </div>
  );
};
