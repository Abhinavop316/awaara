const Trip = require("../models/trip.model");

const DEFAULT_SEEDED_TRIPS = [
  {
    name: "Manali Escape",
    source: "Delhi NCR",
    destination: "Manali & Solang",
    price: 18999,
    dates: "15–20 Oct 2026",
    duration: "5 Days",
    durationDays: 5,
    status: "open",
    highlight: "Great for first-timers",
    seats: 40,
    month: "Oct",
    experience: "Adventure",
    img: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Bali Bliss",
    source: "Mumbai / Delhi Airport",
    destination: "Bali, Indonesia",
    price: 42999,
    dates: "10–16 Nov 2026",
    duration: "7 Days",
    durationDays: 7,
    status: "limited",
    highlight: "ONLY 5 SEATS LEFT",
    seats: 40,
    month: "Nov",
    experience: "Relaxation",
    img: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Kashmir Diaries",
    source: "Jammu / Srinagar",
    destination: "Kashmir Valley",
    price: 27999,
    dates: "5–10 Dec 2026",
    duration: "6 Days",
    durationDays: 6,
    status: "open",
    highlight: "Most loved trip",
    seats: 41,
    month: "Dec",
    experience: "Culture",
    img: "https://images.unsplash.com/photo-1566837945700-30057527ade0?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Rajasthan Royal Trail",
    source: "Delhi NCR",
    destination: "Jaipur & Udaipur",
    price: 22999,
    dates: "20–24 Nov 2026",
    duration: "5 Days",
    durationDays: 5,
    status: "open",
    highlight: "Palace stays included",
    seats: 41,
    month: "Nov",
    experience: "Culture",
    img: "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Spiti Expedition",
    source: "Shimla",
    destination: "Kaza / Spiti",
    price: 31999,
    dates: "12–18 Dec 2026",
    duration: "7 Days",
    durationDays: 7,
    status: "limited",
    highlight: "ONLY 4 SEATS LEFT",
    seats: 40,
    month: "Dec",
    experience: "Adventure",
    img: "https://images.unsplash.com/photo-1626016570407-4bc2b6d7c7f4?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Meghalaya Explorer",
    source: "Guwahati Airport",
    destination: "Shillong & Cherrapunji",
    price: 24999,
    dates: "8–13 Jan 2027",
    duration: "6 Days",
    durationDays: 6,
    status: "soldout",
    highlight: "Waitlist open",
    seats: 40,
    month: "Jan",
    experience: "Adventure",
    img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80"
  }
];

// Seed default curated trips if empty
const seedTrips = async (req, res) => {
  try {
    const count = await Trip.countDocuments();
    if (count === 0) {
      const seeded = await Trip.insertMany(DEFAULT_SEEDED_TRIPS);
      if (res) {
        return res.status(201).json({
          success: true,
          message: "Default curated trips seeded successfully!",
          trips: seeded
        });
      }
      return seeded;
    }
    if (res) {
      const existing = await Trip.find().sort({ createdAt: -1 });
      return res.status(200).json({
        success: true,
        message: "Trips already seeded.",
        trips: existing
      });
    }
  } catch (error) {
    console.error("Error seeding trips:", error);
    if (res) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
};

// GET /api/trips (Returns all trips, auto-seeds if DB is empty)
const getAllTrips = async (req, res) => {
  try {
    let trips = await Trip.find().sort({ createdAt: -1 });
    if (!trips || trips.length === 0) {
      trips = await Trip.insertMany(DEFAULT_SEEDED_TRIPS);
    }

    return res.status(200).json({
      success: true,
      count: trips.length,
      trips: trips.map((t) => ({
        ...t.toObject(),
        id: String(t._id)
      }))
    });
  } catch (error) {
    console.error("Error fetching trips:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching trips",
      error: error.message
    });
  }
};

// GET /api/trips/:id
const getTripById = async (req, res) => {
  try {
    const { id } = req.params;
    let trip = null;

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      trip = await Trip.findById(id);
    } else {
      trip = await Trip.findOne({ name: new RegExp(`^${id}$`, "i") });
    }

    if (!trip) {
      return res.status(404).json({ success: false, message: "Trip not found" });
    }

    return res.status(200).json({
      success: true,
      trip: {
        ...trip.toObject(),
        id: String(trip._id)
      }
    });
  } catch (error) {
    console.error("Error fetching trip by ID:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/trips
const createTrip = async (req, res) => {
  try {
    const {
      name,
      source,
      destination,
      price,
      dates,
      duration,
      durationDays,
      status,
      highlight,
      seats,
      busId,
      month,
      experience,
      img
    } = req.body;

    if (!name || !destination || !price) {
      return res.status(400).json({
        success: false,
        message: "Trip Name, Destination, and Price are required fields."
      });
    }

    const newTrip = new Trip({
      name: name.trim(),
      source: source || "Delhi NCR",
      destination: destination.trim(),
      price: Number(price),
      dates: dates || "Upcoming 2026",
      duration: duration || "5 Days",
      durationDays: Number(durationDays) || 5,
      status: status || "open",
      highlight: highlight || "Curated experience",
      seats: Number(seats) || 40,
      busId: busId || "",
      month: month || "Nov",
      experience: experience || "Adventure",
      img: img || "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80"
    });

    const savedTrip = await newTrip.save();

    return res.status(201).json({
      success: true,
      message: "Trip created successfully!",
      trip: {
        ...savedTrip.toObject(),
        id: String(savedTrip._id)
      }
    });
  } catch (error) {
    console.error("Error creating trip:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create trip"
    });
  }
};

// PUT /api/trips/:id
const updateTrip = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    delete updateData._id;
    delete updateData.id;

    let updatedTrip = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      updatedTrip = await Trip.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    } else {
      updatedTrip = await Trip.findOneAndUpdate({ name: id }, updateData, { new: true, runValidators: true });
    }

    if (!updatedTrip) {
      return res.status(404).json({ success: false, message: "Trip not found for update" });
    }

    return res.status(200).json({
      success: true,
      message: "Trip updated successfully!",
      trip: {
        ...updatedTrip.toObject(),
        id: String(updatedTrip._id)
      }
    });
  } catch (error) {
    console.error("Error updating trip:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/trips/:id
const deleteTrip = async (req, res) => {
  try {
    const { id } = req.params;
    let deletedTrip = null;

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      deletedTrip = await Trip.findByIdAndDelete(id);
    } else {
      deletedTrip = await Trip.findOneAndDelete({ name: id });
    }

    if (!deletedTrip) {
      return res.status(404).json({ success: false, message: "Trip not found for deletion" });
    }

    return res.status(200).json({
      success: true,
      message: "Trip deleted successfully from database."
    });
  } catch (error) {
    console.error("Error deleting trip:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllTrips,
  getTripById,
  createTrip,
  updateTrip,
  deleteTrip,
  seedTrips
};
