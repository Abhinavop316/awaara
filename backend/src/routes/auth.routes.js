const express = require("express");
const router = express.Router();
const { register, login, getMe } = require("../controllers/auth.controller");
const { authenticateUser } = require("../middlewares/auth.middleware");

// Public authentication routes
router.post("/register", register);
router.post("/login", login);

// Protected routes
router.get("/me", authenticateUser, getMe);

module.exports = router;
