import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';

export const Navbar = ({ onOpenMyBookings, onOpenAuth, onOpenProfile }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const [isSolid, setIsSolid] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsSolid(window.scrollY > 60);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const getInitials = (name) => {
    if (!name) return 'AW';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      <header className={`nav ${isSolid ? 'solid' : ''}`} id="mainNav">
        <div className="container">
          <a href="#top" className="logo" onClick={closeMobileMenu}>
            AWAARA
          </a>
          <nav className="nav-links">
            <a href="#trips">Explore Trips</a>
            <a href="#coming">Coming Soon</a>
            <a href="#destinations">Destinations</a>
            <a href="#how">How It Works</a>
            <a href="#reviews">Reviews</a>
            <a href="#faq">FAQ</a>
          </nav>
          <div className="nav-right">
            <button
              className="mybookings-link"
              onClick={onOpenMyBookings}
              aria-label="View My Bookings"
            >
              My Bookings
            </button>

            {isAuthenticated && user ? (
              <div className="nav-user-menu-wrap" ref={dropdownRef}>
                <button
                  className="nav-user-avatar-btn"
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  aria-label="User Account"
                >
                  <span className="nav-avatar-circle">{getInitials(user.fullname)}</span>
                  <span className="nav-user-first-name">
                    {user.fullname ? user.fullname.split(' ')[0] : 'Traveler'}
                  </span>
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{
                      transform: isUserDropdownOpen ? 'rotate(180deg)' : 'none',
                      transition: 'transform 0.2s ease'
                    }}
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>

                {isUserDropdownOpen && (
                  <div className="nav-user-dropdown">
                    <div className="dropdown-user-header">
                      <strong>{user.fullname || 'Awaara Member'}</strong>
                      <span>{user.email}</span>
                    </div>
                    <div className="dropdown-divider" />
                    <button
                      className="dropdown-item"
                      onClick={() => {
                        setIsUserDropdownOpen(false);
                        onOpenProfile();
                      }}
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                      My Profile
                    </button>
                    <button
                      className="dropdown-item"
                      onClick={() => {
                        setIsUserDropdownOpen(false);
                        onOpenMyBookings();
                      }}
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                      My Bookings
                    </button>
                    <div className="dropdown-divider" />
                    <button
                      className="dropdown-item dropdown-item-danger"
                      onClick={() => {
                        setIsUserDropdownOpen(false);
                        logout();
                      }}
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                className="nav-signin-btn"
                onClick={() => onOpenAuth('login')}
              >
                Sign In
              </button>
            )}

            <a
              href="#trips"
              className="btn btn-primary nav-cta-btn"
              style={{ padding: '10px 20px', fontSize: '14px' }}
            >
              Explore Trips
            </a>
            <button
              className={`hamburger ${isMobileMenuOpen ? 'open' : ''}`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu dropdown */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`} id="mobileMenu">
        <a href="#trips" className="mobileLink" onClick={closeMobileMenu}>
          Explore Trips
        </a>
        <a href="#coming" className="mobileLink" onClick={closeMobileMenu}>
          Coming Soon
        </a>
        <a href="#destinations" className="mobileLink" onClick={closeMobileMenu}>
          Destinations
        </a>
        <a href="#how" className="mobileLink" onClick={closeMobileMenu}>
          How It Works
        </a>
        <a href="#reviews" className="mobileLink" onClick={closeMobileMenu}>
          Reviews
        </a>
        <a href="#faq" className="mobileLink" onClick={closeMobileMenu}>
          FAQ
        </a>
        <button
          className="mobileLink"
          style={{ background: 'none', border: 'none', color: 'var(--ivory)' }}
          onClick={() => {
            closeMobileMenu();
            onOpenMyBookings();
          }}
        >
          My Bookings
        </button>
        {isAuthenticated && user ? (
          <button
            className="mobileLink"
            style={{ background: 'none', border: 'none', color: 'var(--coral)' }}
            onClick={() => {
              closeMobileMenu();
              onOpenProfile();
            }}
          >
            Profile ({user.fullname ? user.fullname.split(' ')[0] : 'Account'})
          </button>
        ) : (
          <button
            className="mobileLink"
            style={{ background: 'none', border: 'none', color: 'var(--coral)' }}
            onClick={() => {
              closeMobileMenu();
              onOpenAuth('login');
            }}
          >
            Sign In / Sign Up
          </button>
        )}
      </div>
    </>
  );
};

