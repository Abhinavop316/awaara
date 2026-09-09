import React, { useState, useEffect } from 'react';
import { ModalWrapper } from './ModalWrapper';
import { formatCurrency } from '../../utils/formatters';
import { downloadTicket } from '../../utils/ticketGenerator';
import { useAuth } from '../../context/AuthContext';
import { bookingApi } from '../../services/bookingApi';

export const MyBookingsModal = ({ isOpen, onClose, onExploreTrips }) => {
  const { user, token } = useAuth();
  const [apiBookings, setApiBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      const email = user?.email || (JSON.parse(localStorage.getItem('awaara_booking') || '{}')?.email);
      bookingApi
        .getMyBookings(token, email)
        .then((res) => {
          if (res && res.success && Array.isArray(res.bookings)) {
            const mapped = res.bookings.map((b) => ({
              id: b.bookingReference,
              backendId: b._id,
              trip: b.tripName,
              dates: b.tripDates,
              travelers: b.totalSeatsCount || (b.selectedSeats?.length || 1),
              seats: b.selectedSeats || [],
              amount: b.totalAmount,
              status: b.bookingStatus,
              name: b.primaryContact?.name,
              email: b.primaryContact?.email,
              phone: b.primaryContact?.phone,
              busNumber: b.busNumber
            }));
            setApiBookings(mapped);
          }
        })
        .catch((err) => console.warn('Could not fetch bookings from API:', err))
        .finally(() => setIsLoading(false));
    }
  }, [isOpen, user, token]);

  const latestBooking = JSON.parse(localStorage.getItem('awaara_booking') || 'null');
  const localBookings = JSON.parse(localStorage.getItem('awaara_bookings') || '[]');
  
  // Merge API bookings and local bookings avoiding duplicates
  const allMap = new Map();
  apiBookings.forEach((b) => allMap.set(b.id, b));
  localBookings.forEach((b) => {
    if (!allMap.has(b.id)) allMap.set(b.id, b);
  });
  if (latestBooking && !allMap.has(latestBooking.id)) {
    allMap.set(latestBooking.id, latestBooking);
  }

  const bookingsToShow = Array.from(allMap.values());


  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose}>
      <div style={{ padding: '40px 34px' }}>
        {bookingsToShow.length > 0 ? (
          <div>
            <h3 style={{ fontSize: '24px', marginBottom: '22px' }}>Upcoming Bookings</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {bookingsToShow.map((b) => (
                <div key={b.id} style={{ borderBottom: '1px solid var(--line)', paddingBottom: '20px' }}>
                  <div className="success-card" style={{ marginBottom: 0 }}>
                    <div className="success-row">
                      <span>Booking ID</span>
                      <strong>{b.id}</strong>
                    </div>
                    <div className="success-row">
                      <span>Destination / Trip</span>
                      <span>{b.trip}</span>
                    </div>
                    <div className="success-row">
                      <span>Trip Dates</span>
                      <span>{b.dates}</span>
                    </div>
                    <div className="success-row">
                      <span>Travelers</span>
                      <span>{b.travelers}</span>
                    </div>
                    {b.seats && (
                      <div className="success-row">
                        <span>Seats</span>
                        <strong style={{ color: '#0e7033' }}>{b.seats.join(', ')}</strong>
                      </div>
                    )}
                    <div className="success-row">
                      <span>Total Amount</span>
                      <span>{formatCurrency(b.amount)}</span>
                    </div>
                    <div className="success-row">
                      <span>Payment Status</span>
                      <span className="status-pill">{b.status}</span>
                    </div>
                  </div>
                  <button
                    className="btn btn-outline btn-full"
                    style={{ marginTop: '16px' }}
                    onClick={() => downloadTicket(b)}
                  >
                    Download Digital Ticket 🎫
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="empty-state">
            <h3>Your next adventure is waiting.</h3>
            <p style={{ color: '#6b6459', marginBottom: '24px', fontSize: '15px' }}>
              You haven't booked any trips yet. Explore our handcrafted itineraries to get started.
            </p>
            <button
              className="btn btn-primary"
              onClick={() => {
                onClose();
                onExploreTrips();
              }}
            >
              Explore Trips →
            </button>
          </div>
        )}
      </div>
    </ModalWrapper>
  );
};
