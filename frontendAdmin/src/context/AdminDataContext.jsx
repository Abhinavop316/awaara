import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  DEFAULT_TRIPS,
  DEFAULT_BUSES,
  DEFAULT_BUS_TEMPLATES,
  DEFAULT_BOOKINGS
} from '../data/defaultAdminData';
import { countBookableSeats } from '../utils/layoutHelpers';
import { busApi } from '../services/busApi';
import { bookingApi } from '../services/bookingApi';
import { tripApi } from '../services/tripApi';

const AdminDataContext = createContext(null);

export const AdminDataProvider = ({ children }) => {
  const [trips, setTrips] = useState(() => {
    const saved = localStorage.getItem('awaara_admin_trips');
    return saved ? JSON.parse(saved) : DEFAULT_TRIPS;
  });

  const [buses, setBuses] = useState(() => {
    const saved = localStorage.getItem('awaara_admin_buses');
    return saved ? JSON.parse(saved) : DEFAULT_BUSES;
  });

  const [templates, setTemplates] = useState(() => {
    const saved = localStorage.getItem('awaara_admin_templates');
    return saved ? JSON.parse(saved) : DEFAULT_BUS_TEMPLATES;
  });

  const [bookings, setBookings] = useState(() => {
    const saved = localStorage.getItem('awaara_admin_bookings');
    return saved ? JSON.parse(saved) : DEFAULT_BOOKINGS;
  });

  const [isSyncingTrips, setIsSyncingTrips] = useState(false);
  const [isSyncingBuses, setIsSyncingBuses] = useState(false);
  const [isSyncingBookings, setIsSyncingBookings] = useState(false);

  // Function to refresh bookings from backend
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
          busId: b.bus || 'bus-1',
          busNumber: b.busNumber,
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

  // Fetch and sync buses & bookings & trips from backend on mount
  useEffect(() => {
    const fetchBackendBuses = async () => {
      setIsSyncingBuses(true);
      try {
        const response = await busApi.getAllBuses();
        if (response && response.success && Array.isArray(response.buses) && response.buses.length > 0) {
          const formatted = response.buses.map((b) => ({
            id: b._id || b.id,
            busNumber: b.busNumber,
            name: b.name,
            operator: b.operator || 'Awaara Fleet Operations',
            source: b.source,
            destination: b.destination,
            departureTime: b.departureTime || '20:00',
            arrivalTime: b.arrivalTime || '08:00 (Next Day)',
            boardingPoints: b.boardingPoints || [],
            droppingPoints: b.droppingPoints || [],
            templateId: b.templateId || 'tpl-2-2-seater',
            totalSeats: b.totalSeats || 41,
            status: b.status || 'Active',
            seatLayout: b.seatLayout || null
          }));
          setBuses(formatted);
          localStorage.setItem('awaara_admin_buses', JSON.stringify(formatted));
        } else if (response && response.success && response.buses && response.buses.length === 0) {
          await busApi.seedBuses();
        }
      } catch (err) {
        console.warn('Could not sync with backend buses API:', err.message);
      } finally {
        setIsSyncingBuses(false);
      }
    };

    fetchBackendBuses();
    refreshTrips();
    refreshBookings();
  }, []);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('awaara_admin_trips', JSON.stringify(trips));
  }, [trips]);

  useEffect(() => {
    localStorage.setItem('awaara_admin_buses', JSON.stringify(buses));
  }, [buses]);

  useEffect(() => {
    localStorage.setItem('awaara_admin_templates', JSON.stringify(templates));
  }, [templates]);

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

  // Bus operations connected with backend API
  const addBus = async (bus) => {
    const assignedTemplate = templates.find((t) => t.id === bus.templateId);
    const capacity = assignedTemplate ? countBookableSeats(assignedTemplate) : (bus.totalSeats || 41);

    const busPayload = {
      ...bus,
      totalSeats: capacity
    };

    // Optimistic local state update
    const tempId = bus.id || `bus-${Date.now()}`;
    const newBusObj = { ...busPayload, id: tempId };
    setBuses((prev) => [newBusObj, ...prev]);

    // Send to backend API
    try {
      const result = await busApi.createBus(busPayload);
      if (result && result.success && result.bus) {
        const createdBus = {
          ...result.bus,
          id: result.bus._id || result.bus.id
        };
        setBuses((prev) => prev.map((b) => (b.id === tempId ? createdBus : b)));
        return createdBus;
      }
    } catch (error) {
      console.warn('Backend create bus error:', error);
    }
    return newBusObj;
  };

  const updateBus = async (id, updatedData) => {
    let capacity = updatedData.totalSeats;
    if (updatedData.templateId) {
      const assignedTemplate = templates.find((t) => t.id === updatedData.templateId);
      if (assignedTemplate) {
        capacity = countBookableSeats(assignedTemplate);
      }
    }

    const payload = {
      ...updatedData,
      totalSeats: capacity || updatedData.totalSeats
    };

    setBuses((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...payload } : b))
    );

    // Send update to backend API
    try {
      await busApi.updateBus(id, payload);
    } catch (error) {
      console.warn('Backend update bus error:', error);
    }
  };

  const deleteBus = async (id) => {
    setBuses((prev) => prev.filter((b) => b.id !== id));

    // Send delete to backend API
    try {
      await busApi.deleteBus(id);
    } catch (error) {
      console.warn('Backend delete bus error:', error);
    }
  };

  // Template / Layout Studio operations
  const saveTemplate = (template) => {
    setTemplates((prev) => {
      const exists = prev.some((t) => t.id === template.id);
      if (exists) {
        return prev.map((t) => (t.id === template.id ? template : t));
      }
      return [...prev, template];
    });
  };

  const deleteTemplate = (id) => {
    setTemplates((prev) => prev.filter((t) => t.id !== id));
  };

  // Reset to demo data
  const resetToDemo = async () => {
    setTrips(DEFAULT_TRIPS);
    setBuses(DEFAULT_BUSES);
    setTemplates(DEFAULT_BUS_TEMPLATES);
    setBookings(DEFAULT_BOOKINGS);
    localStorage.removeItem('awaara_admin_trips');
    localStorage.removeItem('awaara_admin_buses');
    localStorage.removeItem('awaara_admin_templates');
    localStorage.removeItem('awaara_admin_bookings');

    try {
      await busApi.seedBuses();
    } catch (e) {
      // Ignored
    }
  };

  return (
    <AdminDataContext.Provider
      value={{
        trips,
        buses,
        templates,
        bookings,
        isSyncingBuses,
        isSyncingBookings,
        refreshBookings,
        addTrip,
        updateTrip,
        deleteTrip,
        addBus,
        updateBus,
        deleteBus,
        saveTemplate,
        deleteTemplate,
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
