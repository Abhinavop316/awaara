const mongoose = require("mongoose");

const travelerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  age: {
    type: Number,
    default: 25
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Other", ""],
    default: "Male"
  },
  seatNumber: {
    type: String,
    required: true,
    trim: true
  }
});

const bookingSchema = new mongoose.Schema(
  {
    bookingReference: {
      type: String,
      unique: true,
      uppercase: true,
      trim: true,
      index: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },
    tripId: {
      type: String,
      required: [true, "Trip ID is required"],
      index: true
    },
    tripName: {
      type: String,
      required: [true, "Trip name is required"],
      trim: true
    },
    tripDates: {
      type: String,
      default: ""
    },
    tripPrice: {
      type: Number,
      required: true
    },
    bus: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bus",
      default: null
    },
    busNumber: {
      type: String,
      default: "AWAARA EXPRESS"
    },
    selectedSeats: {
      type: [String],
      required: [true, "At least one seat must be selected"],
      validate: [
        (v) => Array.isArray(v) && v.length > 0,
        "Please select at least one seat"
      ]
    },
    totalSeatsCount: {
      type: Number,
      default: 1
    },
    travelers: [travelerSchema],
    primaryContact: {
      name: { type: String, required: true, trim: true },
      email: { type: String, required: true, lowercase: true, trim: true },
      phone: { type: String, required: true, trim: true },
      emergencyPhone: { type: String, default: "", trim: true }
    },
    boardingPoint: {
      type: String,
      default: "Main Departure Point"
    },
    droppingPoint: {
      type: String,
      default: "City Center"
    },
    baseAmount: {
      type: Number,
      required: true
    },
    taxesAndFees: {
      type: Number,
      default: 0
    },
    totalAmount: {
      type: Number,
      required: true
    },
    paymentMethod: {
      type: String,
      enum: ["upi", "card", "netbanking", "cash"],
      default: "upi"
    },
    paymentStatus: {
      type: String,
      enum: ["Completed", "Pending", "Refunded", "Failed"],
      default: "Completed"
    },
    bookingStatus: {
      type: String,
      enum: ["Confirmed", "Cancelled", "Completed"],
      default: "Confirmed",
      index: true
    }
  },
  {
    timestamps: true
  }
);

// Auto-generate reference code before save if not present
bookingSchema.pre("save", function () {
  if (!this.bookingReference) {
    const randomSuffix = Math.random().toString(36).substring(2, 7).toUpperCase();
    const dateYear = new Date().getFullYear();
    this.bookingReference = `AW-${dateYear}-${randomSuffix}`;
  }
  if (Array.isArray(this.selectedSeats)) {
    this.totalSeatsCount = this.selectedSeats.length;
  }
});


const bookingModel = mongoose.model("Booking", bookingSchema);

module.exports = bookingModel;
