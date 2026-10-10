import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAdminData } from '../../context/AdminDataContext';
import { Menu } from 'lucide-react';

export const Navbar = ({ activeTab, onToggleSidebar, onOpenNewTrip }) => {
  const { adminUser, logout } = useAuth();
  const { resetToDemo } = useAdminData();

  const getTabTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return { title: 'Operations Dashboard', subtitle: 'Overview of holidays, trips, and passenger bookings' };
      case 'holidays':
        return { title: 'Holidays & Places to Visit', subtitle: 'Manage India holiday destinations, Day-by-Day itineraries, and attractions' };
      case 'enquiries':
        return { title: 'Holiday Enquiries & Leads', subtitle: 'Traveler inquiries, customized itinerary requests, and Resend email status' };
      case 'trips':
        return { title: 'Trips Management', subtitle: 'Create, edit, and schedule curated travel experiences' };
      case 'bookings':
        return { title: 'Passenger Manifest', subtitle: 'Real-time traveler bookings & passenger manifest' };
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
            if (window.confirm('Reset all demo trips and bookings?')) {
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
