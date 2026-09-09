const bookingModel = require("../models/booking.model");
const busModel = require("../models/bus.model");
const seatLockModel = require("../models/seatLock.model");

const LOCK_DURATION_MS = 10 * 60 * 1000; // 10 minutes temporary seat lock

// @desc    Lock seat(s) temporarily for 10 minutes while user is in checkout
// @route   POST /api/bookings/lock-seats
// @access  Public
const lockSeats = async (req, res) => {
  try {
    const { tripId, seatNumbers, sessionId, busId } = req.body;

    if (!tripId || !seatNumbers || !Array.isArray(seatNumbers) || seatNumbers.length === 0 || !sessionId) {
      return res.status(400).json({
        success: false,
        message: "Please provide tripId, sessionId, and at least one seatNumber to lock."
      });
    }

    const now = new Date();

    // 1. Clean up expired locks in background/query
    await seatLockModel.deleteMany({ expiresAt: { $lt: now } });

    // 2. Check if any seat is already confirmed in a booking
    const confirmedBookings = await bookingModel.find({
      tripId: String(tripId),
      bookingStatus: "Confirmed",
      selectedSeats: { $in: seatNumbers }
    });

    if (confirmedBookings.length > 0) {
      const booked = [];
      confirmedBookings.forEach((b) => {
        b.selectedSeats.forEach((s) => {
          if (seatNumbers.includes(s) && !booked.includes(s)) booked.push(s);
        });
      });

      return res.status(409).json({
        success: false,
        message: `Seat(s) [${booked.join(", ")}] have already been booked and confirmed by another traveler.`,
        conflictedSeats: booked
      });
    }

    // 3. Check if any seat is currently held/locked by another user/session
    const otherActiveLocks = await seatLockModel.find({
      tripId: String(tripId),
      seatNumber: { $in: seatNumbers },
      sessionId: { $ne: sessionId },
      expiresAt: { $gt: now }
    });

    if (otherActiveLocks.length > 0) {
      const lockedSeats = Array.from(new Set(otherActiveLocks.map((l) => l.seatNumber)));
      return res.status(409).json({
        success: false,
        message: `Seat(s) [${lockedSeats.join(", ")}] are currently selected by another traveler (held for 10 min). Please choose different seats.`,
        conflictedSeats: lockedSeats
      });
    }

    // 4. Release any existing locks previously held by this session on this trip
    await seatLockModel.deleteMany({
      tripId: String(tripId),
      sessionId
    });

    // 5. Create new 10-minute locks
    const expiresAt = new Date(Date.now() + LOCK_DURATION_MS);
    const lockDocuments = seatNumbers.map((seat) => ({
      tripId: String(tripId),
      busId: busId || null,
      seatNumber: seat,
      sessionId,
      expiresAt
    }));

    await seatLockModel.insertMany(lockDocuments);

    return res.status(200).json({
      success: true,
      message: `Seat(s) [${seatNumbers.join(", ")}] locked for you for 10 minutes.`,
      lockedSeats: seatNumbers,
      expiresAt,
      lockDurationSeconds: LOCK_DURATION_MS / 1000
    });
  } catch (error) {
    console.error("Lock Seats Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error occurred while locking seats.",
      error: error.message
    });
  }
};

// @desc    Release temporary seat locks (if user deselects or goes back)
// @route   POST /api/bookings/release-seats
// @access  Public
const releaseSeats = async (req, res) => {
  try {
    const { tripId, sessionId, seatNumbers } = req.body;

    if (!tripId || !sessionId) {
      return res.status(400).json({
        success: false,
        message: "Please provide tripId and sessionId to release locks."
      });
    }

    const filter = {
      tripId: String(tripId),
      sessionId
    };

    if (seatNumbers && Array.isArray(seatNumbers) && seatNumbers.length > 0) {
      filter.seatNumber = { $in: seatNumbers };
    }

    await seatLockModel.deleteMany(filter);

    return res.status(200).json({
      success: true,
      message: "Seat locks released successfully."
    });
  } catch (error) {
    console.error("Release Seats Error:", error);
    return res.status(500).json({
      success: false,
      message: "Error releasing seat locks.",
      error: error.message
    });
  }
};

// @desc    Create a new seat booking
// @route   POST /api/bookings
// @access  Public (Optional Auth - attaches user if logged in)
const createBooking = async (req, res) => {
  try {
    const {
      tripId,
      tripName,
      tripDates,
      tripPrice,
      busId,
      busNumber,
      selectedSeats,
      travelers,
      primaryContact,
      boardingPoint,
      droppingPoint,
      baseAmount,
      taxesAndFees,
      totalAmount,
      paymentMethod,
      sessionId
    } = req.body;

    if (!tripId || !tripName || !selectedSeats || !Array.isArray(selectedSeats) || selectedSeats.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide tripId, tripName, and at least one selected seat."
      });
    }

    if (!primaryContact || !primaryContact.name || !primaryContact.email || !primaryContact.phone) {
      return res.status(400).json({
        success: false,
        message: "Please provide complete primary contact details (name, email, phone)."
      });
    }

    const now = new Date();

    // 1. Check for real-time seat collisions (prevent double booking against confirmed bookings)
    const existingBookings = await bookingModel.find({
      tripId: String(tripId),
      bookingStatus: "Confirmed",
      selectedSeats: { $in: selectedSeats }
    });

    if (existingBookings.length > 0) {
      const alreadyBookedSeats = [];
      existingBookings.forEach((b) => {
        b.selectedSeats.forEach((seat) => {
          if (selectedSeats.includes(seat) && !alreadyBookedSeats.includes(seat)) {
            alreadyBookedSeats.push(seat);
          }
        });
      });

      return res.status(409).json({
        success: false,
        message: `Seats [${alreadyBookedSeats.join(", ")}] have just been booked by another traveler. Please pick alternative seats.`,
        conflictedSeats: alreadyBookedSeats
      });
    }

    // 2. Check if another active session has locked these seats
    if (sessionId) {
      const lockedByOthers = await seatLockModel.find({
        tripId: String(tripId),
        seatNumber: { $in: selectedSeats },
        sessionId: { $ne: sessionId },
        expiresAt: { $gt: now }
      });

      if (lockedByOthers.length > 0) {
        const otherSeats = Array.from(new Set(lockedByOthers.map((l) => l.seatNumber)));
        return res.status(409).json({
          success: false,
          message: `Seats [${otherSeats.join(", ")}] are currently locked by another traveler. Please pick different seats.`,
          conflictedSeats: otherSeats
        });
      }
    }

    // 3. Resolve bus info if busId provided
    let finalBusNumber = busNumber || "Awaara Volvo Luxury Coach";
    if (busId) {
      try {
        const foundBus = await busModel.findById(busId);
        if (foundBus) {
          finalBusNumber = foundBus.busNumber;
        }
      } catch (err) {
        // Continue with provided busNumber
      }
    }

    // 4. Format travelers with seats if not fully mapped
    const formattedTravelers = (travelers && travelers.length > 0)
      ? travelers
      : selectedSeats.map((seat, index) => ({
          name: index === 0 ? primaryContact.name : `Traveler ${index + 1}`,
          age: 26,
          gender: "Male",
          seatNumber: seat
        }));

    // 5. Create the booking document
    const newBooking = await bookingModel.create({
      user: req.user?._id || req.user?.id || null,
      tripId: String(tripId),
      tripName,
      tripDates: tripDates || "Upcoming Departure",
      tripPrice: Number(tripPrice) || 0,
      bus: busId || null,
      busNumber: finalBusNumber,
      selectedSeats,
      totalSeatsCount: selectedSeats.length,
      travelers: formattedTravelers,
      primaryContact: {
        name: primaryContact.name.trim(),
        email: primaryContact.email.trim().toLowerCase(),
        phone: primaryContact.phone.trim(),
        emergencyPhone: primaryContact.emergencyPhone ? primaryContact.emergencyPhone.trim() : ""
      },
      boardingPoint: boardingPoint || "Main Departure ISBT",
      droppingPoint: droppingPoint || "City Center Mall Road",
      baseAmount: Number(baseAmount) || Number(totalAmount) || 0,
      taxesAndFees: Number(taxesAndFees) || 0,
      totalAmount: Number(totalAmount) || 0,
      paymentMethod: paymentMethod || "upi",
      paymentStatus: "Completed",
      bookingStatus: "Confirmed"
    });

    // 6. Release temporary seat locks after successful booking
    if (sessionId) {
      await seatLockModel.deleteMany({
        tripId: String(tripId),
        sessionId
      });
    }

    return res.status(201).json({
      success: true,
      message: `Booking confirmed successfully! Seat(s) [${selectedSeats.join(", ")}] locked.`,
      booking: newBooking
    });
  } catch (error) {
    console.error("Create Booking Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error occurred while creating seat booking.",
      error: error.message
    });
  }
};

// @desc    Get occupied seats (both Confirmed and active 10-min Locks) for a trip
// @route   GET /api/bookings/occupied-seats/:tripId
// @access  Public
const getTripOccupiedSeats = async (req, res) => {
  try {
    const { tripId } = req.params;
    const { busId, sessionId } = req.query;
    const now = new Date();

    // 1. Confirmed bookings
    const filter = {
      tripId: String(tripId),
      bookingStatus: "Confirmed"
    };

    if (busId) {
      filter.bus = busId;
    }

    const activeBookings = await bookingModel.find(filter).select("selectedSeats");

    const occupiedSeatsSet = new Set();
    const confirmedSeatsSet = new Set();
    activeBookings.forEach((b) => {
      if (Array.isArray(b.selectedSeats)) {
        b.selectedSeats.forEach((seat) => {
          occupiedSeatsSet.add(seat);
          confirmedSeatsSet.add(seat);
        });
      }
    });

    // 2. Active 10-min temporary locks held by other sessions
    const lockFilter = {
      tripId: String(tripId),
      expiresAt: { $gt: now }
    };
    if (sessionId) {
      lockFilter.sessionId = { $ne: sessionId };
    }
    if (busId) {
      lockFilter.busId = busId;
    }

    const activeLocks = await seatLockModel.find(lockFilter).select("seatNumber expiresAt");
    const heldSeats = [];

    activeLocks.forEach((lock) => {
      occupiedSeatsSet.add(lock.seatNumber);
      heldSeats.push({
        seatNumber: lock.seatNumber,
        expiresAt: lock.expiresAt
      });
    });

    const occupiedSeats = Array.from(occupiedSeatsSet);

    return res.status(200).json({
      success: true,
      tripId,
      occupiedCount: occupiedSeats.length,
      occupiedSeats,
      confirmedSeats: Array.from(confirmedSeatsSet),
      heldSeats
    });
  } catch (error) {
    console.error("Get Occupied Seats Error:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching occupied seats.",
      error: error.message
    });
  }
};


// @desc    Get logged in user's bookings (or search by email)
// @route   GET /api/bookings/my-bookings
// @access  Private or by query email
const getMyBookings = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    const queryEmail = req.query.email ? req.query.email.trim().toLowerCase() : null;

    let filter = {};

    if (userId) {
      filter = {
        $or: [
          { user: userId },
          ...(queryEmail ? [{ "primaryContact.email": queryEmail }] : [])
        ]
      };
    } else if (queryEmail) {
      filter = { "primaryContact.email": queryEmail };
    } else {
      return res.status(401).json({
        success: false,
        message: "Please login or provide your email to view your bookings."
      });
    }

    const bookings = await bookingModel
      .find(filter)
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: bookings.length,
      bookings
    });
  } catch (error) {
    console.error("Get My Bookings Error:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching your bookings.",
      error: error.message
    });
  }
};

// @desc    Get all bookings (Admin passenger manifest)
// @route   GET /api/bookings
// @access  Private / Admin
const getAllBookings = async (req, res) => {
  try {
    const { tripId, status, search, page = 1, limit = 100 } = req.query;
    const filter = {};

    if (tripId) {
      filter.tripId = String(tripId);
    }
    if (status && status !== "all") {
      filter.bookingStatus = status;
    }
    if (search) {
      filter.$or = [
        { bookingReference: { $regex: search, $options: "i" } },
        { tripName: { $regex: search, $options: "i" } },
        { "primaryContact.name": { $regex: search, $options: "i" } },
        { "primaryContact.email": { $regex: search, $options: "i" } },
        { "primaryContact.phone": { $regex: search, $options: "i" } },
        { busNumber: { $regex: search, $options: "i" } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await bookingModel.countDocuments(filter);
    const bookings = await bookingModel
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    return res.status(200).json({
      success: true,
      count: bookings.length,
      total,
      bookings
    });
  } catch (error) {
    console.error("Get All Bookings Error:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching bookings directory.",
      error: error.message
    });
  }
};

// @desc    Cancel a booking (frees up seats)
// @route   PUT /api/bookings/:id/cancel
// @access  Public (User / Admin)
const cancelBooking = async (req, res) => {
  try {
    const booking = await bookingModel.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking record not found."
      });
    }

    booking.bookingStatus = "Cancelled";
    booking.paymentStatus = "Refunded";
    await booking.save();

    return res.status(200).json({
      success: true,
      message: `Booking ${booking.bookingReference} has been cancelled. Seat(s) [${booking.selectedSeats.join(", ")}] have been released back to fleet.`,
      booking
    });
  } catch (error) {
    console.error("Cancel Booking Error:", error);
    return res.status(500).json({
      success: false,
      message: "Error cancelling booking.",
      error: error.message
    });
  }
};

module.exports = {
  createBooking,
  lockSeats,
  releaseSeats,
  getTripOccupiedSeats,
  getMyBookings,
  getAllBookings,
  cancelBooking
};

