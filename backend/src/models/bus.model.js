const mongoose = require("mongoose");

const busSchema = new mongoose.Schema(
  {
    busNumber: {
      type: String,
      required: [true, "Bus registration number is required"],
      unique: true,
      uppercase: true,
      trim: true
    },
    name: {
      type: String,
      default: "Awaara Express",
      trim: true
    },
    acType: {
      type: String,
      enum: ["AC", "Non-AC"],
      default: "AC"
    },
    operator: {
      type: String,
      default: "Awaara Fleet Operations",
      trim: true
    },
    source: {
      type: String,
      required: [true, "Source / departure location is required"],
      trim: true
    },
    destination: {
      type: String,
      required: [true, "Destination location is required"],
      trim: true
    },
    departureTime: {
      type: String,
      default: "20:00",
      trim: true
    },
    arrivalTime: {
      type: String,
      default: "08:00 (Next Day)",
      trim: true
    },
    boardingPoints: {
      type: [String],
      default: ["Kashmere Gate ISBT", "Majnu Ka Tilla", "Karnal Bypass"]
    },
    droppingPoints: {
      type: [String],
      default: ["Mall Road", "City Center"]
    },
    templateId: {
      type: String,
      default: "tpl-2-2-seater"
    },
    busType: {
      type: String,
      enum: ["seater", "sleeper", "semi-sleeper", "luxury-volvo"],
      default: "seater"
    },
    totalSeats: {
      type: Number,
      default: 41
    },
    seatLayout: {
      type: mongoose.Schema.Types.Mixed,
      default: null
    },
    amenities: {
      type: [String],
      default: ["Air Conditioning", "Charging Port", "Reading Lights", "Emergency Exit", "Water Bottle"]
    },
    status: {
      type: String,
      enum: ["Active", "Maintenance", "Inactive"],
      default: "Active"
    }
  },
  {
    timestamps: true
  }
);

const busModel = mongoose.model("Bus", busSchema);

module.exports = busModel;
