const express = require("express");
const router = express.Router();
const {
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  deleteUser
} = require("../controllers/user.controller");
const { authenticateUser, authorizeAdmin } = require("../middlewares/auth.middleware");

// User Profile routes (Authenticated)
router.get("/profile", authenticateUser, getUserProfile);
router.put("/profile", authenticateUser, updateUserProfile);

// Admin user management routes
router.get("/", authenticateUser, authorizeAdmin, getAllUsers);
router.delete("/:id", authenticateUser, authorizeAdmin, deleteUser);

module.exports = router;
