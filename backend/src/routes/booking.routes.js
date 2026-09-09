const express = require("express");
const router = express.Router();
const {
  createBooking,
  lockSeats,
  releaseSeats,
  getTripOccupiedSeats,
  getMyBookings,
  getAllBookings,
  cancelBooking
} = require("../controllers/booking.controller");
const { authenticateUser, optionalAuth } = require("../middlewares/auth.middleware");

// @route   POST /api/bookings/lock-seats (Lock seat(s) for 10 minutes)
router.post("/lock-seats", lockSeats);

// @route   POST /api/bookings/release-seats (Release held seat(s))
router.post("/release-seats", releaseSeats);

// @route   POST /api/bookings (Create a booking with optional auth)
router.post("/", optionalAuth, createBooking);

// @route   GET /api/bookings/occupied-seats/:tripId (Get live occupied & held seats for a trip)
router.get("/occupied-seats/:tripId", getTripOccupiedSeats);


// @route   GET /api/bookings/my-bookings (Get authenticated user's or guest's bookings)
router.get("/my-bookings", optionalAuth, getMyBookings);

// @route   GET /api/bookings (Get all bookings / manifest)
router.get("/", getAllBookings);

// @route   PUT /api/bookings/:id/cancel (Cancel booking and free seats)
router.put("/:id/cancel", cancelBooking);

module.exports = router;
