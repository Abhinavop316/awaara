const mongoose = require("mongoose");

const enquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Traveler name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email address is required"],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    timing: {
      type: String,
      default: "Flexible / Upcoming Season",
    },
    passengers: {
      type: Number,
      default: 1,
      min: 1,
    },
    departureCity: {
      type: String,
      default: "Delhi NCR",
      trim: true,
    },
    placeId: {
      type: String,
      default: "",
    },
    placeName: {
      type: String,
      required: [true, "Holiday place name is required"],
      trim: true,
    },
    state: {
      type: String,
      default: "",
    },
    city: {
      type: String,
      default: "",
    },
    duration: {
      type: String,
      default: "5 Days",
    },
    estimatedPrice: {
      type: Number,
      default: 0,
    },
    specialRequests: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["New", "Contacted", "Itinerary Sent", "Closed"],
      default: "New",
    },
    emailStatus: {
      type: String,
      enum: ["Sent", "Failed", "Pending", "Simulated"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Enquiry", enquirySchema);
