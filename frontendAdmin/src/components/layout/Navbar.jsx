import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Menu } from 'lucide-react';

export const Navbar = ({ activeTab, onToggleSidebar }) => {
  const { adminUser, logout } = useAuth();

  const getTabTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return { title: 'Operations Dashboard', subtitle: 'Overview of India holiday destinations and traveler leads' };
      case 'holidays':
        return { title: 'Holidays & Places to Visit', subtitle: 'Manage India destinations, Day-by-Day travel itineraries, and pricing' };
      case 'enquiries':
        return { title: 'Holiday Enquiries & Leads', subtitle: 'Review traveler requests, follow-ups, and dispatch itineraries' };
      default:
        return { title: 'Awaara Admin', subtitle: 'Operations Portal' };
    }
  };

  const { title, subtitle } = getTabTitle();

  return (
    <header className="admin-topbar">
      <div className="topbar-left">
        <button
          className="admin-hamburger-btn"
          onClick={onToggleSidebar}
          aria-label="Open sidebar menu"
        >
          <Menu size={22} />
        </button>

        <div className="topbar-title">
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>
      </div>

      <div className="topbar-actions">
        <div className="admin-live-badge">
          <span className="live-dot"></span>
          <span>Live Operations</span>
        </div>

        <button className="btn btn-dark btn-sm topbar-signout-btn" onClick={logout}>
          Sign Out
        </button>
      </div>
    </header>
  );
};
