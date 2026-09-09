const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Trip name is required"],
      trim: true
    },
    source: {
      type: String,
      default: "Delhi NCR",
      trim: true
    },
    destination: {
      type: String,
      required: [true, "Destination is required"],
      trim: true
    },
    price: {
      type: Number,
      required: [true, "Trip price is required"],
      min: 0
    },
    dates: {
      type: String,
      default: "Upcoming 2026",
      trim: true
    },
    duration: {
      type: String,
      default: "5 Days",
      trim: true
    },
    durationDays: {
      type: Number,
      default: 5
    },
    status: {
      type: String,
      enum: ["open", "limited", "soldout", "draft"],
      default: "open"
    },
    highlight: {
      type: String,
      default: "Curated luxury travel experience",
      trim: true
    },
    seats: {
      type: Number,
      default: 40,
      min: 0
    },
    busId: {
      type: String,
      default: ""
    },
    month: {
      type: String,
      default: "Nov"
    },
    experience: {
      type: String,
      default: "Adventure"
    },
    img: {
      type: String,
      default: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80"
    }
  },
  {
    timestamps: true
  }
);

const Trip = mongoose.model("Trip", tripSchema);

module.exports = Trip;
