import React, { useState, useEffect, useCallback } from 'react';
import { TRIPS as INITIAL_TRIPS, COMING_SOON } from './data/tripsData';
import { useScrollReveal } from './hooks/useScrollReveal';
import { tripApi } from './services/tripApi';

// Layout & Section Components
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { FeaturedTrips } from './components/FeaturedTrips';
import { ComingSoon } from './components/ComingSoon';
import { HowItWorks } from './components/HowItWorks';
import { WhyChooseUs } from './components/WhyChooseUs';
import { Destinations } from './components/Destinations';
import { Reviews } from './components/Reviews';
import { Banner } from './components/Banner';
import { Faq } from './components/Faq';
import { FinalCta } from './components/FinalCta';
import { Footer } from './components/Footer';
import { Toast } from './components/Toast';

// Modals
import { TripDetailModal } from './components/modals/TripDetailModal';
import { BookingModal } from './components/modals/BookingModal';
import { InquiryModal } from './components/modals/InquiryModal';
import { MyBookingsModal } from './components/modals/MyBookingsModal';
import { AuthModal } from './components/modals/AuthModal';
import { UserProfileModal } from './components/modals/UserProfileModal';

export function App() {
  useScrollReveal();

  // Trips & Search Filter State
  const [searchFilters, setSearchFilters] = useState({
    where: '',
    when: '',
    experience: ''
  });

  const [allTrips, setAllTrips] = useState(() => {
    try {
      const saved = localStorage.getItem('awaara_admin_trips') || localStorage.getItem('awaara_trips');
      return saved ? JSON.parse(saved) : INITIAL_TRIPS;
    } catch {
      return INITIAL_TRIPS;
    }
  });

  const [filteredTrips, setFilteredTrips] = useState(allTrips);

  // Fetch trips from backend API
  const fetchTrips = useCallback(async () => {
    try {
      const res = await tripApi.getAllTrips();
      if (res && res.success && Array.isArray(res.trips) && res.trips.length > 0) {
        const formatted = res.trips.map((t) => ({
          ...t,
          id: t._id ? String(t._id) : t.id
        }));
        setAllTrips(formatted);
        setFilteredTrips(formatted);
        localStorage.setItem('awaara_trips', JSON.stringify(formatted));
      }
    } catch (e) {
      console.warn('Could not fetch trips from API, using fallback:', e);
    }
  }, []);

  useEffect(() => {
    fetchTrips();

    // Listen for storage change across tabs (e.g. admin creates trip in another tab)
    const handleStorageChange = (e) => {
      if (e.key === 'awaara_admin_trips' || e.key === 'awaara_trips') {
        try {
          if (e.newValue) {
            const updated = JSON.parse(e.newValue);
            if (Array.isArray(updated) && updated.length > 0) {
              setAllTrips(updated);
              setFilteredTrips(updated);
            }
          }
        } catch {
          // ignore
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [fetchTrips]);

  // Modal States
  const [detailTrip, setDetailTrip] = useState(null);
  const [bookingTrip, setBookingTrip] = useState(null);
  const [inquiryDest, setInquiryDest] = useState(null);
  const [isMyBookingsOpen, setIsMyBookingsOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Toast State
  const [toastMessage, setToastMessage] = useState('');
  const [isToastVisible, setIsToastVisible] = useState(false);

  const showToast = (message) => {
    setToastMessage(message);
    setIsToastVisible(true);
    setTimeout(() => {
      setIsToastVisible(false);
    }, 2800);
  };

  const handleOpenAuth = (mode = 'login') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleOpenProfile = () => {
    setIsProfileModalOpen(true);
  };

  // Filter Logic
  const handleSearch = () => {
    const { where, when, experience } = searchFilters;
    const results = allTrips.filter((t) => {
      const matchWhere = !where || (t.name && t.name.toLowerCase().includes(where.toLowerCase())) || (t.destination && t.destination.toLowerCase().includes(where.toLowerCase()));
      const matchWhen = !when || t.month === when;
      const matchExp = !experience || t.experience === experience;
      return matchWhere && matchWhen && matchExp;
    });
    setFilteredTrips(results);
  };

  const handleSelectDestination = (destName) => {
    setSearchFilters({ where: destName, when: '', experience: '' });
    const results = allTrips.filter((t) =>
      (t.name && t.name.toLowerCase().includes(destName.toLowerCase())) ||
      (t.destination && t.destination.toLowerCase().includes(destName.toLowerCase()))
    );
    setFilteredTrips(results.length > 0 ? results : allTrips);
    const tripsEl = document.getElementById('trips');
    if (tripsEl) {
      tripsEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleClearFilters = () => {
    setSearchFilters({ where: '', when: '', experience: '' });
    setFilteredTrips(allTrips);
  };

  // Trip interactions
  const handleSelectTrip = (trip) => {
    setDetailTrip(trip);
  };

  const handleBookTrip = (trip) => {
    setDetailTrip(null);
    setBookingTrip(trip);
  };

  const handleJoinWaitlist = (trip) => {
    setDetailTrip(null);
    showToast(`You've been added to the waitlist for ${trip.name}.`);
  };

  const handleRegisterInterest = (dest) => {
    setInquiryDest(dest);
  };

  const scrollToTrips = () => {
    const el = document.getElementById('trips');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToTop = () => {
    const el = document.getElementById('top');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="app-root">
      <Navbar
        onOpenMyBookings={() => setIsMyBookingsOpen(true)}
        onOpenAuth={handleOpenAuth}
        onOpenProfile={handleOpenProfile}
      />

      <Hero
        searchFilters={searchFilters}
        setSearchFilters={setSearchFilters}
        onSearch={handleSearch}
        allTrips={allTrips}
      />

      <FeaturedTrips
        trips={filteredTrips}
        onSelectTrip={handleSelectTrip}
        onClearFilters={handleClearFilters}
      />

      <ComingSoon
        comingSoonList={COMING_SOON}
        onRegisterInterest={handleRegisterInterest}
      />

      <HowItWorks />

      <WhyChooseUs />

      <Destinations onSelectDestination={handleSelectDestination} />

      <Reviews />

      <Banner />

      <Faq />

      <FinalCta />

      <Footer />

      {/* Modals */}
      <TripDetailModal
        trip={detailTrip}
        isOpen={Boolean(detailTrip)}
        onClose={() => setDetailTrip(null)}
        onBookTrip={handleBookTrip}
        onJoinWaitlist={handleJoinWaitlist}
      />

      <BookingModal
        trip={bookingTrip}
        isOpen={Boolean(bookingTrip)}
        onClose={() => setBookingTrip(null)}
        onViewMyBookings={() => setIsMyBookingsOpen(true)}
        showToast={showToast}
      />

      <InquiryModal
        destination={inquiryDest}
        isOpen={Boolean(inquiryDest)}
        onClose={() => setInquiryDest(null)}
        onExplorePlanned={scrollToTrips}
        onGoHome={scrollToTop}
      />

      <MyBookingsModal
        isOpen={isMyBookingsOpen}
        onClose={() => setIsMyBookingsOpen(false)}
        onExploreTrips={scrollToTrips}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        initialMode={authMode}
        onClose={() => setIsAuthModalOpen(false)}
        showToast={showToast}
      />

      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        showToast={showToast}
      />

      {/* Global Toast */}
      <Toast message={toastMessage} isVisible={isToastVisible} />
    </div>
  );
}

export default App;
