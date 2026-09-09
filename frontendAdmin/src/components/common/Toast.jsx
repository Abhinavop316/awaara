import React from 'react';

export const Toast = ({ message, isVisible }) => {
  return (
    <div className={`toast ${isVisible ? 'show' : ''}`} role="alert">
      <span>🔔</span>
      <span>{message}</span>
    </div>
  );
};
