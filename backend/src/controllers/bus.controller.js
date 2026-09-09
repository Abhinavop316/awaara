const busModel = require("../models/bus.model");

// @desc    Create a new bus
// @route   POST /api/buses
// @access  Private / Admin
const createBus = async (req, res) => {
  try {
    const {
      busNumber,
      name,
      operator,
      source,
      destination,
      departureTime,
      arrivalTime,
      boardingPoints,
      droppingPoints,
      templateId,
      busType,
      acType,
      totalSeats,
      seatLayout,
      amenities,
      status
    } = req.body;

    if (!busNumber || !source || !destination) {
      return res.status(400).json({
        success: false,
        message: "Please provide busNumber, source, and destination."
      });
    }

    // Check if bus with registration number already exists
    const existingBus = await busModel.findOne({
      busNumber: busNumber.trim().toUpperCase()
    });

    if (existingBus) {
      return res.status(400).json({
        success: false,
        message: `Bus with registration number ${busNumber} already exists.`
      });
    }

    const newBus = await busModel.create({
      busNumber: busNumber.trim().toUpperCase(),
      name: name || `${busNumber.trim().toUpperCase()} (${acType || "AC"})`,
      operator: operator || "Awaara Fleet Operations",
      source,
      destination,
      departureTime: departureTime || "20:00",
      arrivalTime: arrivalTime || "08:00 (Next Day)",
      boardingPoints: boardingPoints || ["Kashmere Gate ISBT", "Majnu Ka Tilla"],
      droppingPoints: droppingPoints || ["Mall Road", "City Center"],
      templateId: templateId || "tpl-2-2-seater",
      busType: busType || "seater",
      acType: acType || "AC",
      totalSeats: totalSeats || 40,
      seatLayout: seatLayout || null,
      amenities: amenities || ["Air Conditioning", "Charging Port", "Reading Lights", "Emergency Exit", "Water Bottle"],
      status: status || "Active"
    });

    return res.status(201).json({
      success: true,
      message: "Bus created successfully!",
      bus: newBus
    });
  } catch (error) {
    console.error("Create Bus Error:", error);
    return res.status(500).json({
      success: false,
      message: "Error creating bus.",
      error: error.message
    });
  }
};

// @desc    Get all buses (with filters & search)
// @route   GET /api/buses
// @access  Public
const getAllBuses = async (req, res) => {
  try {
    const { source, destination, status, busType, search, page = 1, limit = 50 } = req.query;
    const query = {};

    if (source) {
      query.source = { $regex: source, $options: "i" };
    }
    if (destination) {
      query.destination = { $regex: destination, $options: "i" };
    }
    if (status) {
      query.status = status;
    }
    if (busType) {
      query.busType = busType;
    }
    if (search) {
      query.$or = [
        { busNumber: { $regex: search, $options: "i" } },
        { name: { $regex: search, $options: "i" } },
        { source: { $regex: search, $options: "i" } },
        { destination: { $regex: search, $options: "i" } },
        { operator: { $regex: search, $options: "i" } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await busModel.countDocuments(query);
    const buses = await busModel
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    return res.status(200).json({
      success: true,
      count: buses.length,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      buses
    });
  } catch (error) {
    console.error("Get All Buses Error:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching buses.",
      error: error.message
    });
  }
};

// @desc    Get single bus details by ID
// @route   GET /api/buses/:id
// @access  Public
const getBusById = async (req, res) => {
  try {
    const bus = await busModel.findById(req.params.id);

    if (!bus) {
      return res.status(404).json({
        success: false,
        message: "Bus not found."
      });
    }

    return res.status(200).json({
      success: true,
      bus
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching bus details.",
      error: error.message
    });
  }
};

// @desc    Update bus details
// @route   PUT /api/buses/:id
// @access  Private / Admin
const updateBus = async (req, res) => {
  try {
    const bus = await busModel.findById(req.params.id);

    if (!bus) {
      return res.status(404).json({
        success: false,
        message: "Bus not found."
      });
    }

    // Check if updating busNumber and it conflicts with another bus
    if (req.body.busNumber && req.body.busNumber.toUpperCase() !== bus.busNumber) {
      const conflict = await busModel.findOne({
        busNumber: req.body.busNumber.trim().toUpperCase(),
        _id: { $ne: req.params.id }
      });
      if (conflict) {
        return res.status(400).json({
          success: false,
          message: `Another bus with registration number ${req.body.busNumber} already exists.`
        });
      }
      req.body.busNumber = req.body.busNumber.trim().toUpperCase();
    }

    const updatedBus = await busModel.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: "Bus updated successfully!",
      bus: updatedBus
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error updating bus.",
      error: error.message
    });
  }
};

// @desc    Delete a bus
// @route   DELETE /api/buses/:id
// @access  Private / Admin
const deleteBus = async (req, res) => {
  try {
    const bus = await busModel.findById(req.params.id);

    if (!bus) {
      return res.status(404).json({
        success: false,
        message: "Bus not found."
      });
    }

    await busModel.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Bus removed successfully."
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error deleting bus.",
      error: error.message
    });
  }
};

// @desc    Seed initial buses if collection is empty
// @route   POST /api/buses/seed
// @access  Public / Admin
const seedBuses = async (req, res) => {
  try {
    const count = await busModel.countDocuments();
    if (count > 0) {
      return res.status(200).json({
        success: true,
        message: `Database already contains ${count} buses.`
      });
    }

    const defaultFleet = [
      {
        busNumber: "DL 01 AB 7741",
        name: "Himalayan Express Volvo 9600",
        operator: "Awaara Fleet Operations",
        source: "Delhi (Kashmere Gate)",
        destination: "Manali (Mall Road)",
        departureTime: "19:30",
        arrivalTime: "08:30 (Next Day)",
        boardingPoints: ["Kashmere Gate ISBT", "Majnu Ka Tilla", "Karnal Bypass"],
        droppingPoints: ["Patlikuhal", "Green Tax Barrier", "Manali Mall Road"],
        templateId: "tpl-2-2-seater",
        busType: "luxury-volvo",
        totalSeats: 41,
        status: "Active"
      },
      {
        busNumber: "HR 26 CK 9902",
        name: "Royal Rajputana Multi-Axle",
        operator: "Awaara Royal Cruisers",
        source: "Delhi (Aerocity)",
        destination: "Jaipur & Udaipur",
        departureTime: "22:00",
        arrivalTime: "06:00 (Next Day)",
        boardingPoints: ["Aerocity Metro", "Dhaula Kuan", "IFFCO Chowk Gurgaon"],
        droppingPoints: ["Sindhi Camp Jaipur", "Udaipur City Center"],
        templateId: "tpl-2-2-seater",
        busType: "seater",
        totalSeats: 41,
        status: "Active"
      },
      {
        busNumber: "JK 02 BB 5510",
        name: "Kashmir Valley Panorama Coach",
        operator: "Awaara Alpine Shuttles",
        source: "Jammon Tawi",
        destination: "Srinagar (Dal Gate)",
        departureTime: "06:00",
        arrivalTime: "14:30",
        boardingPoints: ["Jammu Tawi Railway Stn", "Katra Bypass"],
        droppingPoints: ["Anantnag", "Pampore", "Dal Gate Srinagar"],
        templateId: "tpl-1-2-vip",
        busType: "seater",
        totalSeats: 21,
        status: "Active"
      }
    ];

    const inserted = await busModel.insertMany(defaultFleet);

    return res.status(201).json({
      success: true,
      message: "Seeded default Awaara bus fleet successfully!",
      count: inserted.length,
      buses: inserted
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error seeding buses.",
      error: error.message
    });
  }
};

module.exports = {
  createBus,
  getAllBuses,
  getBusById,
  updateBus,
  deleteBus,
  seedBuses
};
