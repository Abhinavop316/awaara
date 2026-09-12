const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");

const authenticateUser = async (req, res, next) => {
  try {
    let token = null;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No authentication token provided."
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "awaara_jwt_secret_key_2026_super_secure"
    );

    let user = null;
    try {
      user = await userModel.findById(decoded.id).select("-password");
    } catch (dbErr) {
      // In case decoded.id is not a standard ObjectId
    }

    if (!user) {
      // Fallback for admin role token if user doc was not found in DB
      if (decoded.role === "admin") {
        user = {
          _id: decoded.id || "admin",
          fullname: process.env.ADMIN_NAME || "Operations Administrator",
          email: process.env.ADMIN_EMAIL || "admin@awaara.com",
          role: "admin"
        };
      } else {
        return res.status(401).json({
          success: false,
          message: "User session invalid or user not found."
        });
      }
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
      error: error.message
    });
  }
};

const authorizeAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: "Access forbidden. Administrator privileges required."
    });
  }
};

const optionalAuth = async (req, res, next) => {
  try {
    let token = null;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (token) {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "awaara_jwt_secret_key_2026_super_secure"
      );
      let user = null;
      try {
        user = await userModel.findById(decoded.id).select("-password");
      } catch (e) {}

      if (user) {
        req.user = user;
      } else if (decoded.role === "admin") {
        req.user = {
          _id: decoded.id || "admin",
          fullname: process.env.ADMIN_NAME || "Operations Administrator",
          email: process.env.ADMIN_EMAIL || "admin@awaara.com",
          role: "admin"
        };
      }
    }
    next();
  } catch (error) {
    next();
  }
};

module.exports = {
  authenticateUser,
  authorizeAdmin,
  optionalAuth
};
