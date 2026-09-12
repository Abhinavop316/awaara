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

// Helper function to find or provision Admin user based on .env
const getOrCreateEnvAdmin = async () => {
  const envAdminEmail = (process.env.ADMIN_EMAIL || "admin@awaara.com").toLowerCase().trim();
  const envAdminName = process.env.ADMIN_NAME || "Operations Administrator";
  const envAdminPassword = process.env.ADMIN_PASSWORD || "admin123";

  let adminUser = await userModel.findOne({
    $or: [{ email: envAdminEmail }, { role: "admin" }]
  });

  if (!adminUser) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(envAdminPassword, salt);

    adminUser = await userModel.create({
      fullname: envAdminName,
      email: envAdminEmail,
      password: hashedPassword,
      phone: process.env.ADMIN_PHONE || "9999999999",
      role: "admin",
      country: "India"
    });
  } else {
    // If admin exists, ensure role is 'admin'
    if (adminUser.role !== "admin") {
      adminUser.role = "admin";
      await adminUser.save();
    }
  }

  return adminUser;
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
    const existingUser = await userModel.findOne({ email: email.toLowerCase().trim() });
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
      email: email.toLowerCase().trim(),
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

// @desc    Authenticate / Login user or Admin
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const inputIdentifier = (email || username || "").toLowerCase().trim();

    if (!inputIdentifier || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide your identifier (email or admin ID) and password."
      });
    }

    const envAdminEmail = (process.env.ADMIN_EMAIL || "admin@awaara.com").toLowerCase().trim();
    const envAdminUsername = (process.env.ADMIN_USERNAME || "admin").toLowerCase().trim();
    const envAdminPassword = process.env.ADMIN_PASSWORD || "admin123";

    // Check if login matches .env admin credentials
    const isEnvAdminMatch =
      (inputIdentifier === envAdminEmail || inputIdentifier === envAdminUsername) &&
      password === envAdminPassword;

    if (isEnvAdminMatch) {
      const adminUser = await getOrCreateEnvAdmin();
      const token = generateToken(adminUser._id, "admin");

      const userResponse = {
        _id: adminUser._id,
        fullname: adminUser.fullname || process.env.ADMIN_NAME || "Operations Administrator",
        email: adminUser.email || envAdminEmail,
        phone: adminUser.phone || "",
        role: "admin",
        createdAt: adminUser.createdAt
      };

      return res.status(200).json({
        success: true,
        message: "Administrator login successful!",
        token,
        user: userResponse
      });
    }

    // Standard database user lookup
    const user = await userModel.findOne({ email: inputIdentifier });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email/username or password credentials."
      });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email/username or password credentials."
      });
    }

    const token = generateToken(user._id, user.role || "user");

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
      role: user.role || "user",
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

// @desc    Explicit Admin Login via .env credentials
// @route   POST /api/auth/admin/login or POST /api/auth/admin-login
// @access  Public
const adminLogin = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const inputIdentifier = (username || email || "").toLowerCase().trim();

    if (!inputIdentifier || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide admin identifier and password."
      });
    }

    const envAdminEmail = (process.env.ADMIN_EMAIL || "admin@awaara.com").toLowerCase().trim();
    const envAdminUsername = (process.env.ADMIN_USERNAME || "admin").toLowerCase().trim();
    const envAdminPassword = process.env.ADMIN_PASSWORD || "admin123";

    if (
      (inputIdentifier === envAdminEmail || inputIdentifier === envAdminUsername) &&
      password === envAdminPassword
    ) {
      const adminUser = await getOrCreateEnvAdmin();
      const token = generateToken(adminUser._id, "admin");

      return res.status(200).json({
        success: true,
        message: "Admin authentication successful!",
        token,
        user: {
          _id: adminUser._id,
          fullname: adminUser.fullname || process.env.ADMIN_NAME || "Operations Administrator",
          email: adminUser.email || envAdminEmail,
          role: "admin",
          createdAt: adminUser.createdAt
        }
      });
    }

    return res.status(401).json({
      success: false,
      message: "Invalid Administrator ID or password credentials."
    });
  } catch (error) {
    console.error("Admin Login Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error during admin login.",
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
  adminLogin,
  getMe
};
