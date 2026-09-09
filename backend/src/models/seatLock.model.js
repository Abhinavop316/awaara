const mongoose = require("mongoose");

const seatLockSchema = new mongoose.Schema(
  {
    tripId: {
      type: String,
      required: true,
      index: true
    },
    busId: {
      type: String,
      default: null,
      index: true
    },
    seatNumber: {
      type: String,
      required: true,
      trim: true
    },
    sessionId: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    expiresAt: {
      type: Date,
      required: true,
      // MongoDB TTL index: documents are automatically removed after expiresAt
      index: { expires: 0 }
    }
  },
  {
    timestamps: true
  }
);

// Compound index for fast collision lookups
seatLockSchema.index({ tripId: 1, seatNumber: 1 });

const seatLockModel = mongoose.model("SeatLock", seatLockSchema);

module.exports = seatLockModel;
