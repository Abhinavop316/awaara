const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: [true, "Full name is required"],
      trim: true
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"]
    },
    phone: {
      type: String,
      default: "",
      trim: true
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other", ""],
      default: ""
    },
    age: {
      type: Number,
      default: null
    },
    address: {
      type: String,
      default: ""
    },
    city: {
      type: String,
      default: ""
    },
    state: {
      type: String,
      default: ""
    },
    pincode: {
      type: String,
      default: ""
    },
    country: {
      type: String,
      default: "India"
    }
  },
  {
    timestamps: true
  }
);

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;