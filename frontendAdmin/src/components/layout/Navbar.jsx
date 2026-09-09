import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAdminData } from '../../context/AdminDataContext';
import { Menu } from 'lucide-react';

export const Navbar = ({ activeTab, onToggleSidebar, onOpenNewTrip, onOpenNewBus }) => {
  const { adminUser, logout } = useAuth();
  const { resetToDemo } = useAdminData();

  const getTabTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return { title: 'Operations Dashboard', subtitle: 'Overview of trips, active fleet, and bookings' };
      case 'trips':
        return { title: 'Trips Management', subtitle: 'Create, edit, schedule, and assign buses to curated trips' };
      case 'buses':
        return { title: 'Fleet & Route Manager', subtitle: 'Manage bus numbers, routes, and seat layouts' };
      case 'layout-studio':
        return { title: 'Bus Seat Layout Studio', subtitle: 'Design cabin seat layouts and configurations' };
      case 'bookings':
        return { title: 'Passenger Manifest', subtitle: 'Real-time passenger manifest & occupancy' };
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
        <button
          className="btn btn-outline btn-sm topbar-reset-btn"
          onClick={() => {
            if (window.confirm('Reset all demo trips, buses, and layout templates?')) {
              resetToDemo();
            }
          }}
          title="Reset back to default sample data"
        >
          🔄 Reset Demo
        </button>


        <button className="btn btn-dark btn-sm topbar-signout-btn" onClick={logout}>
          Sign Out
        </button>
      </div>
    </header>
  );
};

