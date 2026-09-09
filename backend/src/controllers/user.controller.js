const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");

// @desc    Get current user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found."
      });
    }
    return res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching user profile.",
      error: error.message
    });
  }
};

// @desc    Update current user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found."
      });
    }

    const {
      fullname,
      phone,
      gender,
      age,
      address,
      city,
      state,
      pincode,
      country,
      password
    } = req.body;

    if (fullname) user.fullname = fullname;
    if (phone !== undefined) user.phone = phone;
    if (gender !== undefined) user.gender = gender;
    if (age !== undefined) user.age = age;
    if (address !== undefined) user.address = address;
    if (city !== undefined) user.city = city;
    if (state !== undefined) user.state = state;
    if (pincode !== undefined) user.pincode = pincode;
    if (country !== undefined) user.country = country;

    if (password) {
      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: "Password must be at least 6 characters long."
        });
      }
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await user.save();

    const userResponse = {
      _id: updatedUser._id,
      fullname: updatedUser.fullname,
      email: updatedUser.email,
      phone: updatedUser.phone,
      gender: updatedUser.gender,
      age: updatedUser.age,
      address: updatedUser.address,
      city: updatedUser.city,
      state: updatedUser.state,
      pincode: updatedUser.pincode,
      country: updatedUser.country,
      role: updatedUser.role,
      updatedAt: updatedUser.updatedAt
    };

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully!",
      user: userResponse
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error updating user profile.",
      error: error.message
    });
  }
};

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private / Admin
const getAllUsers = async (req, res) => {
  try {
    const { search, role, page = 1, limit = 20 } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { fullname: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } }
      ];
    }

    if (role) {
      query.role = role;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await userModel.countDocuments(query);
    const users = await userModel
      .find(query)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    return res.status(200).json({
      success: true,
      count: users.length,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      users
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching users list.",
      error: error.message
    });
  }
};

// @desc    Delete a user (Admin only)
// @route   DELETE /api/users/:id
// @access  Private / Admin
const deleteUser = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found."
      });
    }

    await userModel.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: "User deleted successfully."
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error deleting user.",
      error: error.message
    });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  deleteUser
};
