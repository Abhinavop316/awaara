const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");

// Helper function to generate JWT token
const generateToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET || "awaara_jwt_secret_key_2026_super_secure",
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d"
    }
  );
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const {
      fullname,
      email,
      password,
      phone,
      gender,
      age,
      address,
      city,
      state,
      pincode,
      country,
      role
    } = req.body;

    if (!fullname || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide full name, email, and password."
      });
    }

    // Check if user already exists
    const existingUser = await userModel.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "A user with this email already exists."
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const newUser = await userModel.create({
      fullname,
      email: email.toLowerCase(),
      password: hashedPassword,
      phone: phone || "",
      gender: gender || "",
      age: age || null,
      address: address || "",
      city: city || "",
      state: state || "",
      pincode: pincode || "",
      country: country || "India",
      role: role === "admin" ? "admin" : "user"
    });

    const token = generateToken(newUser._id, newUser.role);

    // Sanitize user object
    const userResponse = {
      _id: newUser._id,
      fullname: newUser.fullname,
      email: newUser.email,
      phone: newUser.phone,
      gender: newUser.gender,
      age: newUser.age,
      address: newUser.address,
      city: newUser.city,
      state: newUser.state,
      pincode: newUser.pincode,
      country: newUser.country,
      role: newUser.role,
      createdAt: newUser.createdAt
    };

    return res.status(201).json({
      success: true,
      message: "User registered successfully!",
      token,
      user: userResponse
    });
  } catch (error) {
    console.error("Register Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error during registration.",
      error: error.message
    });
  }
};

// @desc    Authenticate / Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password."
      });
    }

    // Find user
    const user = await userModel.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password credentials."
      });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password credentials."
      });
    }

    const token = generateToken(user._id, user.role);

    const userResponse = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phone: user.phone,
      gender: user.gender,
      age: user.age,
      address: user.address,
      city: user.city,
      state: user.state,
      pincode: user.pincode,
      country: user.country,
      role: user.role,
      createdAt: user.createdAt
    };

    return res.status(200).json({
      success: true,
      message: "Login successful!",
      token,
      user: userResponse
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error during login.",
      error: error.message
    });
  }
};

// @desc    Get currently logged in user profile
// @route   GET /api/auth/me
// @access  Private (Authenticated)
const getMe = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      user: req.user
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching user profile.",
      error: error.message
    });
  }
};

module.exports = {
  register,
  login,
  getMe
};
