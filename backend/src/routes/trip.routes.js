const express = require("express");
const router = express.Router();
const {
  getAllTrips,
  getTripById,
  createTrip,
  updateTrip,
  deleteTrip,
  seedTrips
} = require("../controllers/trip.controller");

// Public routes for fetching trips
router.get("/", getAllTrips);
router.get("/:id", getTripById);
router.post("/seed", seedTrips);

// Admin operations for managing trips
router.post("/", createTrip);
router.put("/:id", updateTrip);
router.delete("/:id", deleteTrip);

module.exports = router;
