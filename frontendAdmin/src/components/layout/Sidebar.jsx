import React from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Compass,
  Bus,
  Grid,
  Users,
  LayoutDashboard,
  LogOut,
  X
} from 'lucide-react';

export const Sidebar = ({ activeTab, setActiveTab, isOpen, onClose }) => {
  const { adminUser, logout } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { id: 'trips', label: 'Trips Manager', icon: <Compass size={18} /> },
    { id: 'buses', label: 'Fleet & Buses', icon: <Bus size={18} /> },
    { id: 'layout-studio', label: 'Seat Layout Studio', icon: <Grid size={18} /> },
    { id: 'bookings', label: 'Passenger Manifest', icon: <Users size={18} /> }
  ];

  return (
    <>
      {/* Mobile Drawer Backdrop Overlay */}
      {isOpen && (
        <div className="sidebar-mobile-backdrop" onClick={onClose} />
      )}

      <aside className={`admin-sidebar ${isOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-brand">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className="sidebar-logo">AWAARA</span>
            <span className="sidebar-badge">OPS</span>
          </div>

          <button
            className="sidebar-mobile-close"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="admin-user-info">
            <div className="admin-avatar">
              {adminUser?.name ? adminUser.name[0] : 'A'}
            </div>
            <div className="admin-user-text">
              <div className="name">{adminUser?.name || 'Admin'}</div>
              <div className="role">{adminUser?.role || 'Administrator'}</div>
            </div>
          </div>
          <button
            className="btn-ghost"
            style={{ color: 'rgba(250, 246, 239, 0.6)', padding: '6px' }}
            onClick={logout}
            title="Logout"
          >
            <LogOut size={16} />
          </button>
        </div>
      </aside>
    </>
  );
};

