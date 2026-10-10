import React, { createContext, useContext, useState, useEffect } from 'react';
import { DEFAULT_TRIPS, DEFAULT_BOOKINGS } from '../data/defaultAdminData';
import { bookingApi } from '../services/bookingApi';
import { tripApi } from '../services/tripApi';

const AdminDataContext = createContext(null);

export const AdminDataProvider = ({ children }) => {
  const [trips, setTrips] = useState(() => {
    const saved = localStorage.getItem('awaara_admin_trips');
    return saved ? JSON.parse(saved) : DEFAULT_TRIPS;
  });

  const [bookings, setBookings] = useState(() => {
    const saved = localStorage.getItem('awaara_admin_bookings');
    return saved ? JSON.parse(saved) : DEFAULT_BOOKINGS;
  });

  const [isSyncingTrips, setIsSyncingTrips] = useState(false);
  const [isSyncingBookings, setIsSyncingBookings] = useState(false);

  // Refresh bookings from backend
  const refreshBookings = async () => {
    setIsSyncingBookings(true);
    try {
      const response = await bookingApi.getAllBookings();
      if (response && response.success && Array.isArray(response.bookings) && response.bookings.length > 0) {
        const formatted = response.bookings.map((b) => ({
          id: b.bookingReference,
          backendId: b._id,
          tripId: b.tripId,
          tripName: b.tripName,
          passengerName: b.primaryContact?.name || 'Traveler',
          email: b.primaryContact?.email || '',
          phone: b.primaryContact?.phone || '',
          seatsBooked: b.selectedSeats || [],
          totalAmount: b.totalAmount || 0,
          status: b.bookingStatus === 'Confirmed' ? 'Confirmed' : b.bookingStatus,
          bookingDate: b.createdAt || new Date().toISOString()
        }));

        // Merge with existing demo bookings
        const mergedMap = new Map();
        formatted.forEach((item) => mergedMap.set(item.id, item));
        DEFAULT_BOOKINGS.forEach((item) => {
          if (!mergedMap.has(item.id)) mergedMap.set(item.id, item);
        });

        const finalList = Array.from(mergedMap.values());
        setBookings(finalList);
        localStorage.setItem('awaara_admin_bookings', JSON.stringify(finalList));
      }
    } catch (err) {
      console.warn('Could not sync with backend bookings API:', err.message);
    } finally {
      setIsSyncingBookings(false);
    }
  };

  // Fetch and sync trips from backend on mount
  const refreshTrips = async () => {
    setIsSyncingTrips(true);
    try {
      const response = await tripApi.getAllTrips();
      if (response && response.success && Array.isArray(response.trips) && response.trips.length > 0) {
        const formatted = response.trips.map((t) => ({
          ...t,
          id: t._id ? String(t._id) : t.id
        }));
        setTrips(formatted);
        localStorage.setItem('awaara_admin_trips', JSON.stringify(formatted));
      } else if (response && response.success && response.trips && response.trips.length === 0) {
        await tripApi.seedTrips();
      }
    } catch (err) {
      console.warn('Could not sync with backend trips API:', err.message);
    } finally {
      setIsSyncingTrips(false);
    }
  };

  // Fetch on mount
  useEffect(() => {
    refreshTrips();
    refreshBookings();
  }, []);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('awaara_admin_trips', JSON.stringify(trips));
  }, [trips]);

  useEffect(() => {
    localStorage.setItem('awaara_admin_bookings', JSON.stringify(bookings));
  }, [bookings]);

  // Trip operations with backend API
  const addTrip = async (trip) => {
    const tempId = trip.id || `trip-${Date.now()}`;
    const newTrip = {
      ...trip,
      id: tempId
    };
    setTrips((prev) => [newTrip, ...prev]);

    try {
      const result = await tripApi.createTrip(trip);
      if (result && result.success && result.trip) {
        const createdTrip = {
          ...result.trip,
          id: result.trip._id ? String(result.trip._id) : result.trip.id
        };
        setTrips((prev) => prev.map((t) => (t.id === tempId ? createdTrip : t)));
        return createdTrip;
      }
    } catch (error) {
      console.warn('Backend create trip error:', error);
    }
    return newTrip;
  };

  const updateTrip = async (id, updatedData) => {
    setTrips((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updatedData } : t))
    );

    try {
      await tripApi.updateTrip(id, updatedData);
    } catch (error) {
      console.warn('Backend update trip error:', error);
    }
  };

  const deleteTrip = async (id) => {
    setTrips((prev) => prev.filter((t) => t.id !== id));

    try {
      await tripApi.deleteTrip(id);
    } catch (error) {
      console.warn('Backend delete trip error:', error);
    }
  };

  // Reset to demo data
  const resetToDemo = async () => {
    setTrips(DEFAULT_TRIPS);
    setBookings(DEFAULT_BOOKINGS);
    localStorage.removeItem('awaara_admin_trips');
    localStorage.removeItem('awaara_admin_bookings');
  };

  return (
    <AdminDataContext.Provider
      value={{
        trips,
        bookings,
        isSyncingTrips,
        isSyncingBookings,
        refreshTrips,
        refreshBookings,
        addTrip,
        updateTrip,
        deleteTrip,
        resetToDemo
      }}
    >
      {children}
    </AdminDataContext.Provider>
  );
};

export const useAdminData = () => {
  const context = useContext(AdminDataContext);
  if (!context) throw new Error('useAdminData must be used within an AdminDataProvider');
  return context;
};
