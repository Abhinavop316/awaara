const express = require("express");
const router = express.Router();
const {
  createEnquiry,
  getAllEnquiries,
  updateEnquiryStatus,
} = require("../controllers/enquiry.controller");

// Public Traveler Enquiry Submission
router.post("/", createEnquiry);

// Admin Management Endpoints
router.get("/", getAllEnquiries);
router.put("/:id", updateEnquiryStatus);

module.exports = router;
