const mongoose = require("mongoose");

const itineraryDaySchema = new mongoose.Schema({
  day: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true,
    default: ""
  },
  activities: {
    type: [String],
    default: []
  },
  meals: {
    type: String,
    default: "Breakfast & Dinner"
  },
  stay: {
    type: String,
    default: "Comfort Hotel / Resort"
  }
});

const placeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Destination / Holiday name is required"],
      trim: true
    },
    state: {
      type: String,
      required: [true, "State is required"],
      trim: true
    },
    city: {
      type: String,
      required: [true, "City is required"],
      trim: true
    },
    category: {
      type: String,
      enum: [
        "Hill Station",
        "Heritage & Forts",
        "Beach & Coastal",
        "Spiritual & Pilgrimage",
        "Adventure & Treks",
        "Wildlife & Safari",
        "Lakes & Nature",
        "Romantic Getaway",
        "Cultural & City"
      ],
      default: "Hill Station"
    },
    days: {
      type: String,
      default: "4 Days / 3 Nights",
      trim: true
    },
    durationDays: {
      type: Number,
      default: 4,
      min: 1
    },
    price: {
      type: Number,
      required: [true, "Estimated price / budget is required"],
      min: 0
    },
    bestTimeToVisit: {
      type: String,
      default: "October to April",
      trim: true
    },
    rating: {
      type: Number,
      default: 4.8,
      min: 1,
      max: 5
    },
    reviewsCount: {
      type: Number,
      default: 120
    },
    img: {
      type: String,
      default: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80"
    },
    gallery: {
      type: [String],
      default: []
    },
    overview: {
      type: String,
      trim: true,
      default: "Explore breathtaking sights, vibrant culture, and unforgettable holiday memories."
    },
    highlights: {
      type: [String],
      default: []
    },
    itinerary: {
      type: [itineraryDaySchema],
      default: []
    },
    attractions: {
      type: [String],
      default: []
    },
    inclusions: {
      type: [String],
      default: [
        "Deluxe hotel / resort accommodation",
        "Daily breakfast and dinner",
        "Dedicated AC vehicle for all sightseeing",
        "Sightseeing permits & tolls",
        "24/7 on-trip assistance"
      ]
    },
    exclusions: {
      type: [String],
      default: [
        "Personal expenses and tips",
        "Adventure sports / optional activities",
        "Flight or train fare to arrival point"
      ]
    },
    coordinates: {
      lat: { type: Number, default: 0 },
      lng: { type: Number, default: 0 }
    },
    externalPlaceId: {
      type: String,
      default: ""
    },
    isFeatured: {
      type: Boolean,
      default: true
    },
    status: {
      type: String,
      enum: ["active", "draft"],
      default: "active"
    }
  },
  {
    timestamps: true
  }
);

// Indexes for fast searching and filtering
placeSchema.index({ name: "text", city: "text", state: "text", overview: "text" });
placeSchema.index({ state: 1, city: 1 });
placeSchema.index({ category: 1 });

const Place = mongoose.model("Place", placeSchema);

module.exports = Place;
