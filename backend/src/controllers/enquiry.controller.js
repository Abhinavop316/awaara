const Enquiry = require("../models/enquiry.model");
const { sendEnquiryConfirmationEmail } = require("../services/email.service");

// POST /api/enquiries - Submit new holiday enquiry & send confirmation email via Resend
exports.createEnquiry = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      timing,
      passengers,
      departureCity,
      placeId,
      placeName,
      state,
      city,
      duration,
      estimatedPrice,
      specialRequests,
    } = req.body;

    if (!name || !email || !phone || !placeName) {
      return res.status(400).json({
        success: false,
        message:
          "Name, email, phone number, and destination place name are required.",
      });
    }

    // 1. Save Enquiry to Database
    const newEnquiry = new Enquiry({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      timing: timing || "Upcoming Season",
      passengers: passengers ? Number(passengers) : 1,
      departureCity: departureCity || "Delhi NCR",
      placeId: placeId || "",
      placeName: placeName.trim(),
      state: state || "",
      city: city || "",
      duration: duration || "5 Days",
      estimatedPrice: estimatedPrice ? Number(estimatedPrice) : 0,
      specialRequests: specialRequests || "",
      status: "New",
      emailStatus: "Pending",
    });

    const savedEnquiry = await newEnquiry.save();

    // 2. Dispatch Confirmation Email using Resend API
    let emailResult = { status: "Pending" };
    try {
      emailResult = await sendEnquiryConfirmationEmail({
        name: savedEnquiry.name,
        email: savedEnquiry.email,
        phone: savedEnquiry.phone,
        timing: savedEnquiry.timing,
        passengers: savedEnquiry.passengers,
        departureCity: savedEnquiry.departureCity,
        placeName: savedEnquiry.placeName,
        city: savedEnquiry.city,
        state: savedEnquiry.state,
        duration: savedEnquiry.duration,
        specialRequests: savedEnquiry.specialRequests,
      });

      savedEnquiry.emailStatus =
        emailResult.status || (emailResult.success ? "Sent" : "Failed");
      await savedEnquiry.save();
    } catch (mailErr) {
      console.error("Email sending failure:", mailErr);
      savedEnquiry.emailStatus = "Failed";
      await savedEnquiry.save();
    }

    res.status(201).json({
      success: true,
      message:
        "Your holiday enquiry has been received! Our team will get right back to you shortly with the custom itinerary. Check your email for confirmation!",
      enquiry: savedEnquiry,
      emailSent: emailResult.success,
    });
  } catch (error) {
    console.error("Error in createEnquiry:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit holiday enquiry",
      error: error.message,
    });
  }
};

// GET /api/enquiries - Admin retrieves all inquiries
exports.getAllEnquiries = async (req, res) => {
  try {
    const { status, search } = req.query;
    const filter = {};

    if (status && status !== "All") {
      filter.status = status;
    }

    if (search && search.trim() !== "") {
      const q = search.trim();
      filter.$or = [
        { name: { $regex: q, $options: "i" } },
        { email: { $regex: q, $options: "i" } },
        { phone: { $regex: q, $options: "i" } },
        { placeName: { $regex: q, $options: "i" } },
        { city: { $regex: q, $options: "i" } },
      ];
    }

    const enquiries = await Enquiry.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: enquiries.length,
      enquiries,
    });
  } catch (error) {
    console.error("Error in getAllEnquiries:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch enquiries",
      error: error.message,
    });
  }
};

// PUT /api/enquiries/:id - Admin updates enquiry status
exports.updateEnquiryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updated = await Enquiry.findByIdAndUpdate(
      id,
      { $set: { status } },
      { new: true },
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found",
      });
    }

    res.status(200).json({
      success: true,
      message: `Enquiry status updated to ${status}`,
      enquiry: updated,
    });
  } catch (error) {
    console.error("Error in updateEnquiryStatus:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update enquiry status",
      error: error.message,
    });
  }
};
