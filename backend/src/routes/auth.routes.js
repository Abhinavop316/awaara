const express = require("express");
const router = express.Router();
const { register, login, adminLogin, getMe } = require("../controllers/auth.controller");
const { authenticateUser } = require("../middlewares/auth.middleware");

// Public authentication routes
router.post("/register", register);
router.post("/login", login);
router.post("/admin/login", adminLogin);
router.post("/admin-login", adminLogin);

// Protected routes
router.get("/me", authenticateUser, getMe);

module.exports = router;
