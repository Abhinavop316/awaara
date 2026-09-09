import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { ModalWrapper } from './ModalWrapper';
import { BusSeatSelector } from '../bus/BusSeatSelector';
import { formatCurrency } from '../../utils/formatters';
import { downloadTicket } from '../../utils/ticketGenerator';
import { useAuth } from '../../context/AuthContext';
import { bookingApi } from '../../services/bookingApi';

const getClientSessionId = () => {
  let sid = localStorage.getItem('awaara_client_session_id');
  if (!sid) {
    sid = 'sess_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now().toString(36);
    localStorage.setItem('awaara_client_session_id', sid);
  }
  return sid;
};

const formatTimer = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

export const BookingModal = ({ trip, isOpen, onClose, onViewMyBookings, showToast }) => {
  const { user, token } = useAuth();
  const [step, setStep] = useState(1);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [occupiedSeats, setOccupiedSeats] = useState([]);
  const [isLoadingSeats, setIsLoadingSeats] = useState(false);
  const [isLocking, setIsLocking] = useState(false);
  const [lockExpiresAt, setLockExpiresAt] = useState(null);
  const [remainingSeconds, setRemainingSeconds] = useState(0);

  const [formData, setFormData] = useState({
    name: user?.fullname || '',
    email: user?.email || '',
    phone: user?.phone || '',
    emergency: '',
    travelers: []
  });

  const [errors, setErrors] = useState({});
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [payMethod, setPayMethod] = useState('upi');
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  const tripIdentifier = trip ? (trip.id || trip._id || trip.name) : '';
  const sessionId = getClientSessionId();

  // 10-Minute countdown timer effect
  useEffect(() => {
    if (!lockExpiresAt) return;
    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.floor((new Date(lockExpiresAt).getTime() - Date.now()) / 1000));
      setRemainingSeconds(remaining);
      if (remaining <= 0) {
        clearInterval(interval);
        setLockExpiresAt(null);
        if (step > 2 && !confirmedBooking) {
          showToast('Your 10-minute seat hold has expired. Please re-select your seats.');
          setStep(2);
        }
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [lockExpiresAt, step, confirmedBooking]);

  // Live polling for occupied / held seats every 4 seconds
  useEffect(() => {
    let isMounted = true;
    const fetchOccupied = () => {
      if (!isOpen || !tripIdentifier) return;
      bookingApi
        .getOccupiedSeats(tripIdentifier, trip.busId || null, sessionId)
        .then((data) => {
          if (isMounted && data && Array.isArray(data.occupiedSeats)) {
            setOccupiedSeats(data.occupiedSeats);
          }
        })
        .catch((err) => console.warn('Could not load occupied seats:', err));
    };

    if (isOpen && tripIdentifier) {
      setIsLoadingSeats(true);
      fetchOccupied();
      setIsLoadingSeats(false);

      const pollInterval = setInterval(fetchOccupied, 4000);
      return () => {
        isMounted = false;
        clearInterval(pollInterval);
      };
    }
  }, [isOpen, tripIdentifier, sessionId, trip]);

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setAdults(1);
      setChildren(0);
      setSelectedSeats([]);
      setLockExpiresAt(null);
      setRemainingSeconds(0);
      setFormData({
        name: user?.fullname || '',
        email: user?.email || '',
        phone: user?.phone || '',
        emergency: '',
        travelers: []
      });
      setErrors({});
      setAgreeTerms(false);
      setIsProcessing(false);
      setConfirmedBooking(null);
    }
  }, [isOpen, trip, user]);

  if (!trip) return null;

  const totalTravelersCount = adults + children;
  const basePrice = trip.price * adults + Math.round(trip.price * 0.7) * children;
  
  const taxesAndFees = Math.round(basePrice * 0.05);
  const grandTotal = basePrice + taxesAndFees;

  const handleTravelerFieldChange = (index, field, value) => {
    const updated = [...formData.travelers];
    if (!updated[index]) {
      updated[index] = { name: '', phone: '' };
    }
    updated[index][field] = value;
    setFormData((prev) => ({ ...prev, travelers: updated }));
  };

  const handleSeatToggle = (seat) => {
    let nextSeats = [];
    const exists = selectedSeats.some((s) => s.id === seat.id || s.seatNumber === seat.seatNumber);
    if (exists) {
      nextSeats = selectedSeats.filter((s) => s.id !== seat.id && s.seatNumber !== seat.seatNumber);
    } else {
      if (selectedSeats.length >= totalTravelersCount) {
        nextSeats = [...selectedSeats.slice(1), seat];
      } else {
        nextSeats = [...selectedSeats, seat];
      }
    }
    setSelectedSeats(nextSeats);

    // Broadcast temporary 10-min lock immediately so all other users see it as Sold
    if (nextSeats.length > 0) {
      bookingApi
        .lockSeats({
          tripId: tripIdentifier,
          seatNumbers: nextSeats.map((s) => s.seatNumber),
          sessionId,
          busId: trip.busId || null
        })
        .then((res) => {
          if (res && res.success && res.expiresAt) {
            setLockExpiresAt(res.expiresAt);
            setRemainingSeconds(Math.floor((new Date(res.expiresAt).getTime() - Date.now()) / 1000));
          } else if (res && res.status === 409) {
            showToast(res.message || 'That seat is already held by another user.');
            // Refresh occupied seats
            bookingApi.getOccupiedSeats(tripIdentifier, trip.busId || null, sessionId).then((fresh) => {
              if (fresh && Array.isArray(fresh.occupiedSeats)) setOccupiedSeats(fresh.occupiedSeats);
            });
            setSelectedSeats((prev) => prev.filter((s) => !res.conflictedSeats?.includes(s.seatNumber)));
          }
        })
        .catch(() => {});
    } else {
      bookingApi.releaseSeats({ tripId: tripIdentifier, sessionId }).catch(() => {});
      setLockExpiresAt(null);
      setRemainingSeconds(0);
    }
  };

  const handleProceedFromSeats = async () => {
    if (selectedSeats.length === 0) {
      showToast('Please select at least 1 seat to continue.');
      return;
    }

    setIsLocking(true);
    const seatNumbers = selectedSeats.map((s) => s.seatNumber);

    try {
      const res = await bookingApi.lockSeats({
        tripId: tripIdentifier,
        seatNumbers,
        sessionId,
        busId: trip.busId || null
      });

      if (res.status === 409 || res.conflictedSeats) {
        showToast(res.message || 'Seat(s) were just selected by another traveler.');
        const fresh = await bookingApi.getOccupiedSeats(tripIdentifier, trip.busId || null, sessionId);
        if (fresh && Array.isArray(fresh.occupiedSeats)) setOccupiedSeats(fresh.occupiedSeats);
        setSelectedSeats((prev) => prev.filter((s) => !res.conflictedSeats?.includes(s.seatNumber)));
        setIsLocking(false);
        return;
      }

      if (res.success && res.expiresAt) {
        setLockExpiresAt(res.expiresAt);
        setRemainingSeconds(Math.floor((new Date(res.expiresAt).getTime() - Date.now()) / 1000));
      }

      setStep(3);
    } catch (err) {
      setStep(3);
    } finally {
      setIsLocking(false);
    }
  };


  const validateStep3 = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Please enter your name.';
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Please enter a valid email address.';
    if (!/^\d{7,}$/.test(formData.phone.replace(/\D/g, '')))
      newErrors.phone = 'Please enter a valid phone number.';
    if (!formData.emergency.trim()) newErrors.emergency = 'Please enter an emergency contact.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePay = async () => {
    setIsProcessing(true);

    const seatsArray = selectedSeats.map((s) => s.seatNumber);
    const assignedSeats = seatsArray.length > 0 ? seatsArray : ['L1'];

    // Construct full traveler details
    const formattedTravelers = Array.from({ length: totalTravelersCount }).map((_, i) => ({
      name: (formData.travelers[i]?.name || (i === 0 ? formData.name : `Traveler ${i + 1}`)).trim(),
      age: 26,
      gender: 'Male',
      seatNumber: assignedSeats[i] || assignedSeats[0] || 'L1'
    }));

    const bookingPayload = {
      tripId: String(trip.id || trip._id || trip.name),
      tripName: trip.name,
      tripDates: trip.dates || 'Upcoming Trip',
      tripPrice: trip.price,
      busId: trip.busId || null,
      busNumber: trip.busNumber || 'AWAARA LUXURY COACH',
      selectedSeats: assignedSeats,
      travelers: formattedTravelers,
      primaryContact: {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        emergencyPhone: formData.emergency.trim()
      },
      boardingPoint: trip.pickup || 'Main Departure Point',
      droppingPoint: trip.destination || 'City Center Mall Road',
      baseAmount: basePrice,
      taxesAndFees,
      totalAmount: grandTotal,
      paymentMethod: payMethod,
      sessionId
    };


    try {
      const result = await bookingApi.createBooking(bookingPayload, token);

      if (result.status === 409 || result.conflictedSeats) {
        // Double-booking conflict caught!
        setIsProcessing(false);
        showToast(result.message || 'Seat(s) were just taken! Please select another seat.');
        // Refresh occupied seats
        if (tripIdentifier) {
          const freshOccupied = await bookingApi.getOccupiedSeats(tripIdentifier);
          if (freshOccupied && Array.isArray(freshOccupied.occupiedSeats)) {
            setOccupiedSeats(freshOccupied.occupiedSeats);
          }
        }
        // Deselect conflicted seats & return to seat picker
        setSelectedSeats((prev) =>
          prev.filter((s) => !result.conflictedSeats?.includes(s.seatNumber))
        );
        setStep(2);
        return;
      }

      const bookingRecord = {
        id: result.booking?.bookingReference || ('AWR-2026-' + Math.floor(100000 + Math.random() * 899999)),
        trip: trip.name,
        img: trip.img,
        dates: trip.dates,
        travelers: totalTravelersCount,
        seats: assignedSeats,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        amount: grandTotal,
        status: 'CONFIRMED',
        bookingDate: new Date().toISOString()
      };

      // Save to localStorage for instant client cache
      const existingBookings = JSON.parse(localStorage.getItem('awaara_bookings') || '[]');
      existingBookings.unshift(bookingRecord);
      localStorage.setItem('awaara_bookings', JSON.stringify(existingBookings));
      localStorage.setItem('awaara_booking', JSON.stringify(bookingRecord));

      // Refresh occupied seats cache locally
      setOccupiedSeats((prev) => [...prev, ...assignedSeats]);
      setConfirmedBooking(bookingRecord);
      setIsProcessing(false);

      // Trigger Confetti
      try {
        confetti({
          particleCount: 90,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // Fallback gracefully
      }
    } catch (err) {
      console.warn('Backend booking error, saving locally:', err);
      // Local fallback
      const fallbackId = 'AWR-2026-' + Math.floor(100000 + Math.random() * 899999);
      const bookingRecord = {
        id: fallbackId,
        trip: trip.name,
        img: trip.img,
        dates: trip.dates,
        travelers: totalTravelersCount,
        seats: assignedSeats,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        amount: grandTotal,
        status: 'CONFIRMED',
        bookingDate: new Date().toISOString()
      };

      const existingBookings = JSON.parse(localStorage.getItem('awaara_bookings') || '[]');
      existingBookings.unshift(bookingRecord);
      localStorage.setItem('awaara_bookings', JSON.stringify(existingBookings));

      setConfirmedBooking(bookingRecord);
      setIsProcessing(false);
    }
  };


  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose}>
      {/* 10-Minute Temporary Seat Hold Timer Banner */}
      {lockExpiresAt && remainingSeconds > 0 && !confirmedBooking && (
        <div
          style={{
            background: 'linear-gradient(135deg, #fff7ed 0%, #fef3c7 100%)',
            border: '1px solid #fde68a',
            borderRadius: '10px',
            padding: '8px 14px',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '12.5px',
            color: '#92400e',
            boxShadow: '0 2px 6px rgba(146, 64, 14, 0.06)'
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
            <span>⏳</span>
            <span>
              {selectedSeats.length > 0
                ? `Seat(s) [${selectedSeats.map((s) => s.seatNumber).join(', ')}] held for you`
                : 'Seats locked for you'}
            </span>
          </span>
          <span
            style={{
              fontWeight: 800,
              background: '#ea580c',
              color: '#ffffff',
              padding: '3px 9px',
              borderRadius: '6px',
              fontSize: '12px',
              fontVariantNumeric: 'tabular-nums',
              letterSpacing: '0.5px'
            }}
          >
            {formatTimer(remainingSeconds)}
          </span>
        </div>
      )}

      {/* Step Indicator (5 Steps) */}
      {!confirmedBooking && (
        <div className="booking-steps-bar">
          <div className={`step-dot ${step >= 1 ? 'active' : ''}`} title="Travelers" />
          <div className={`step-dot ${step >= 2 ? 'active' : ''}`} title="Seat Selection" />
          <div className={`step-dot ${step >= 3 ? 'active' : ''}`} title="Details" />
          <div className={`step-dot ${step >= 4 ? 'active' : ''}`} title="Review" />
          <div className={`step-dot ${step >= 5 ? 'active' : ''}`} title="Payment" />
        </div>
      )}

      {/* STEP 1: Select Travelers */}
      {!confirmedBooking && step === 1 && (
        <div className="booking-body">
          <h3>Trip & Travelers</h3>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '24px' }}>
            <img
              src={trip.img}
              alt={trip.name}
              style={{ width: '88px', height: '70px', objectFit: 'cover', borderRadius: '10px' }}
              onError={(e) => {
                e.target.src =
                  'https://images.unsplash.com/photo-1500835556837-99ac94a94552?auto=format&fit=crop&w=900&q=80';
              }}
            />
            <div>
              <strong>{trip.name}</strong>
              <div style={{ fontSize: '13px', color: '#6b6459', marginTop: '3px' }}>
                {trip.dates} · {trip.duration}
              </div>
            </div>
          </div>

          <div className="counter-row">
            <div>
              <div className="counter-label">Adults</div>
              <div className="counter-sub">{formatCurrency(trip.price)} / person</div>
            </div>
            <div className="counter-ctrl">
              <button
                className="counter-btn"
                onClick={() => setAdults((prev) => Math.max(1, prev - 1))}
              >
                −
              </button>
              <span>{adults}</span>
              <button className="counter-btn" onClick={() => setAdults((prev) => prev + 1)}>
                +
              </button>
            </div>
          </div>

          <div className="counter-row">
            <div>
              <div className="counter-label">Children</div>
              <div className="counter-sub">
                {formatCurrency(Math.round(trip.price * 0.7))} / child
              </div>
            </div>
            <div className="counter-ctrl">
              <button
                className="counter-btn"
                onClick={() => setChildren((prev) => Math.max(0, prev - 1))}
              >
                −
              </button>
              <span>{children}</span>
              <button className="counter-btn" onClick={() => setChildren((prev) => prev + 1)}>
                +
              </button>
            </div>
          </div>

          <div className="price-summary">
            <span className="label">Estimated Base Total</span>
            <span className="amount">{formatCurrency(basePrice)}</span>
          </div>

          <div className="booking-nav" style={{ justifyContent: 'flex-end' }}>
            <button className="btn btn-primary" onClick={() => setStep(2)}>
              Choose Seats →
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Interactive Bus Seat Selection */}
      {!confirmedBooking && step === 2 && (
        <div className="booking-body">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <h3 style={{ margin: 0 }}>Select Bus Seats</h3>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#0e7033', background: 'rgba(14, 112, 51, 0.1)', padding: '3px 10px', borderRadius: '999px' }}>
              Pick {totalTravelersCount} {totalTravelersCount === 1 ? 'Seat' : 'Seats'}
            </span>
          </div>
          <p style={{ fontSize: '13px', color: '#7a7267', marginBottom: '18px' }}>
            Tap green available armchair seats to select your preferred spots. Selected seats are held for you for 10 minutes.
          </p>

          <BusSeatSelector
            selectedSeats={selectedSeats}
            onSeatToggle={handleSeatToggle}
            requiredSeatsCount={totalTravelersCount}
            tripPrice={trip.price || 525}
            occupiedSeats={occupiedSeats}
          />

          <div className="booking-nav" style={{ marginTop: '20px' }}>
            <span className="link-back" onClick={() => setStep(1)}>
              ← Back
            </span>
            <button
              className={`btn btn-primary ${isLocking ? 'is-loading' : ''}`}
              disabled={isLocking}
              onClick={handleProceedFromSeats}
            >
              Continue with {selectedSeats.length} {selectedSeats.length === 1 ? 'Seat' : 'Seats'} →
            </button>
          </div>
        </div>
      )}


      {/* STEP 3: Travelers Contact Info */}
      {!confirmedBooking && step === 3 && (
        <div className="booking-body">
          <h3>Traveler Details</h3>
          <div className="form-grid" style={{ marginBottom: '22px' }}>
            <div className={`form-field ${errors.name ? 'error' : ''}`}>
              <label>Full Name *</label>
              <input
                type="text"
                value={formData.name}
                placeholder="Aarav Sharma"
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              {errors.name && <span className="error-msg">{errors.name}</span>}
            </div>

            <div className={`form-field ${errors.email ? 'error' : ''}`}>
              <label>Email Address *</label>
              <input
                type="email"
                value={formData.email}
                placeholder="aarav@example.com"
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              {errors.email && <span className="error-msg">{errors.email}</span>}
            </div>

            <div className={`form-field ${errors.phone ? 'error' : ''}`}>
              <label>Phone Number *</label>
              <input
                type="tel"
                value={formData.phone}
                placeholder="+91 98765 43210"
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
              {errors.phone && <span className="error-msg">{errors.phone}</span>}
            </div>

            <div className={`form-field ${errors.emergency ? 'error' : ''}`}>
              <label>Emergency Contact *</label>
              <input
                type="tel"
                value={formData.emergency}
                placeholder="+91 91234 56789"
                onChange={(e) => setFormData({ ...formData, emergency: e.target.value })}
              />
              {errors.emergency && <span className="error-msg">{errors.emergency}</span>}
            </div>
          </div>

          <h4 style={{ fontSize: '14px', letterSpacing: '0.3px', color: 'var(--sage-dark)', marginBottom: '14px' }}>
            ADDITIONAL TRAVELERS ({totalTravelersCount})
          </h4>

          {Array.from({ length: totalTravelersCount }).map((_, i) => (
            <div className="traveler-block" key={i}>
              <h5>
                Traveler {i + 1} {i === 0 ? '(Primary Traveler)' : ''}{' '}
                {selectedSeats[i] && (
                  <span style={{ fontSize: '11px', color: '#0e7033', fontWeight: 700 }}>
                    • Seat {selectedSeats[i].seatNumber}
                  </span>
                )}
              </h5>
              <div className="form-grid">
                <div className="form-field">
                  <label>Full Name</label>
                  <input
                    type="text"
                    placeholder={i === 0 ? formData.name || 'Primary Traveler' : `Traveler ${i + 1} Name`}
                    value={formData.travelers[i]?.name || ''}
                    onChange={(e) => handleTravelerFieldChange(i, 'name', e.target.value)}
                  />
                </div>
                <div className="form-field">
                  <label>Phone (Optional)</label>
                  <input
                    type="tel"
                    placeholder="Contact Number"
                    value={formData.travelers[i]?.phone || ''}
                    onChange={(e) => handleTravelerFieldChange(i, 'phone', e.target.value)}
                  />
                </div>
              </div>
            </div>
          ))}

          <div className="booking-nav">
            <span className="link-back" onClick={() => setStep(2)}>
              ← Back to Seats
            </span>
            <button
              className="btn btn-primary"
              onClick={() => {
                if (validateStep3()) {
                  setStep(4);
                }
              }}
            >
              Continue to Review
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Review & Summary */}
      {!confirmedBooking && step === 4 && (
        <div className="booking-body">
          <h3>Review Your Booking</h3>
          <div className="review-line">
            <span>Trip</span>
            <strong>{trip.name}</strong>
          </div>
          <div className="review-line">
            <span>Dates</span>
            <span>{trip.dates}</span>
          </div>
          <div className="review-line">
            <span>Seats Booked</span>
            <strong style={{ color: '#0e7033' }}>
              {selectedSeats.length > 0
                ? selectedSeats.map((s) => s.seatNumber).join(', ')
                : 'Assigned at check-in'}
            </strong>
          </div>
          <div className="review-line">
            <span>Travelers</span>
            <span>
              {totalTravelersCount} ({adults} {adults === 1 ? 'adult' : 'adults'}
              {children > 0 ? `, ${children} ${children === 1 ? 'child' : 'children'}` : ''})
            </span>
          </div>
          <div className="review-line">
            <span>Base price</span>
            <span>{formatCurrency(basePrice)}</span>
          </div>
          <div className="review-line">
            <span>Taxes & GST (5%)</span>
            <span>{formatCurrency(taxesAndFees)}</span>
          </div>
          <div className="review-line total">
            <span>Total Amount</span>
            <span>{formatCurrency(grandTotal)}</span>
          </div>

          <div className="policy-box">
            Free cancellation up to 7 days before departure. After that, 50% of the trip cost is
            non-refundable.
          </div>

          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
            />
            <span>I agree to the booking and cancellation policy terms.</span>
          </label>

          <div className="booking-nav">
            <span className="link-back" onClick={() => setStep(3)}>
              ← Back
            </span>
            <button
              className="btn btn-primary"
              onClick={() => {
                if (!agreeTerms) {
                  showToast('Please agree to the booking terms to continue.');
                  return;
                }
                setStep(5);
              }}
            >
              Proceed to Payment
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: Payment Simulation */}
      {!confirmedBooking && step === 5 && (
        <div className="booking-body">
          <h3>Payment</h3>
          <div className="pay-tabs">
            <button
              className={`pay-tab ${payMethod === 'upi' ? 'active' : ''}`}
              onClick={() => setPayMethod('upi')}
            >
              UPI
            </button>
            <button
              className={`pay-tab ${payMethod === 'card' ? 'active' : ''}`}
              onClick={() => setPayMethod('card')}
            >
              Credit / Debit Card
            </button>
            <button
              className={`pay-tab ${payMethod === 'netbanking' ? 'active' : ''}`}
              onClick={() => setPayMethod('netbanking')}
            >
              Net Banking
            </button>
          </div>

          {payMethod === 'upi' && (
            <div className="form-field" style={{ marginBottom: '14px' }}>
              <label>UPI ID / VPA</label>
              <input
                type="text"
                placeholder="yourname@okhdfcbank"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
              />
            </div>
          )}

          {payMethod === 'card' && (
            <div className="form-grid" style={{ marginBottom: '14px' }}>
              <div className="form-field full">
                <label>Card Number</label>
                <input
                  type="text"
                  placeholder="4532 •••• •••• 8892"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                />
              </div>
              <div className="form-field">
                <label>Expiry Date</label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  value={cardExpiry}
                  onChange={(e) => setCardExpiry(e.target.value)}
                />
              </div>
              <div className="form-field">
                <label>CVV / CVC</label>
                <input
                  type="password"
                  placeholder="•••"
                  maxLength={4}
                  value={cardCvv}
                  onChange={(e) => setCardCvv(e.target.value)}
                />
              </div>
            </div>
          )}

          {payMethod === 'netbanking' && (
            <div className="form-field" style={{ marginBottom: '14px' }}>
              <label>Select Bank</label>
              <select
                value={selectedBank}
                onChange={(e) => setSelectedBank(e.target.value)}
              >
                <option>HDFC Bank</option>
                <option>ICICI Bank</option>
                <option>State Bank of India</option>
                <option>Axis Bank</option>
                <option>Kotak Mahindra Bank</option>
              </select>
            </div>
          )}

          <p style={{ fontSize: '12.5px', color: '#8a8175', margin: '18px 0 8px' }}>
            🔒 256-bit encrypted simulated checkout — no real money will be charged.
          </p>

          <div className="booking-nav">
            <span className="link-back" onClick={() => setStep(4)}>
              ← Back
            </span>
            <button
              className={`btn btn-primary ${isProcessing ? 'is-loading' : ''}`}
              disabled={isProcessing}
              onClick={handlePay}
            >
              Pay {formatCurrency(grandTotal)}
            </button>
          </div>
        </div>
      )}

      {/* CONFIRMATION / SUCCESS SCREEN */}
      {confirmedBooking && (
        <div className="success-wrap">
          <div style={{ fontSize: '52px', marginBottom: '10px' }}>🎉</div>
          <h2>You're Going!</h2>
          <p className="sub">Your adventure has officially been booked.</p>

          <div className="success-card">
            <div className="success-row">
              <span>Booking ID</span>
              <strong>{confirmedBooking.id}</strong>
            </div>
            <div className="success-row">
              <span>Trip</span>
              <span>{confirmedBooking.trip}</span>
            </div>
            <div className="success-row">
              <span>Confirmed Seats</span>
              <strong style={{ color: '#0e7033' }}>
                {(confirmedBooking.seats || ['L1']).join(', ')}
              </strong>
            </div>
            <div className="success-row">
              <span>Dates</span>
              <span>{confirmedBooking.dates}</span>
            </div>
            <div className="success-row">
              <span>Travelers</span>
              <span>{confirmedBooking.travelers}</span>
            </div>
            <div className="success-row">
              <span>Amount Paid</span>
              <span>{formatCurrency(confirmedBooking.amount)}</span>
            </div>
            <div className="success-row">
              <span>Status</span>
              <span className="status-pill">CONFIRMED</span>
            </div>
          </div>

          <p style={{ fontSize: '13.5px', color: '#8a8175', marginBottom: '26px' }}>
            We've sent your confirmation and confirmed ticket to {confirmedBooking.email}.
          </p>

          <div className="success-btns">
            <button
              className="btn btn-dark"
              onClick={() => {
                onClose();
                onViewMyBookings();
              }}
            >
              View My Bookings
            </button>
            <button
              className="btn btn-outline"
              onClick={() => downloadTicket(confirmedBooking)}
            >
              Download Ticket
            </button>
            <button
              className="btn btn-outline"
              onClick={() => showToast('Added to your calendar (simulated).')}
            >
              Add to Calendar
            </button>
          </div>
        </div>
      )}
    </ModalWrapper>
  );
};
