const express = require("express");
const router = express.Router();
const {
  getAllPlaces,
  getPlaceById,
  createPlace,
  updatePlace,
  deletePlace,
  getOpenTripMapPlaces,
  seedPlaces
} = require("../controllers/place.controller");

// Place Suggestions & Tourism Data API
router.get("/opentripmap/places", getOpenTripMapPlaces);

// Seed Route
router.post("/seed", seedPlaces);

// Places CRUD Routes
router.get("/", getAllPlaces);
router.get("/:id", getPlaceById);
router.post("/", createPlace);
router.put("/:id", updatePlace);
router.delete("/:id", deletePlace);

module.exports = router;
