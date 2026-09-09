const express = require("express");
const router = express.Router();
const {
  createBus,
  getAllBuses,
  getBusById,
  updateBus,
  deleteBus,
  seedBuses
} = require("../controllers/bus.controller");
const { authenticateUser, authorizeAdmin } = require("../middlewares/auth.middleware");

// Bus fleet management routes
router.get("/", getAllBuses);
router.get("/:id", getBusById);
router.post("/seed", seedBuses);
router.post("/", createBus);
router.put("/:id", updateBus);
router.delete("/:id", deleteBus);

module.exports = router;
