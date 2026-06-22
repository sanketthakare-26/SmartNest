const Enquiry = require("../models/Enquiry");

// @desc    Get all enquiries
// @route   GET /api/enquiries
// @access  Private/Admin
const getEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.find({})
      .populate("product", "name slug price")
      .sort({ createdAt: -1 });
    res.json(enquiries);
  } catch (error) {
    res.status(500).json({ message: "Server error fetching enquiries" });
  }
};

// @desc    Create new enquiry
// @route   POST /api/enquiries
// @access  Public
const createEnquiry = async (req, res) => {
  try {
    const { name, email, phone, message, productId } = req.body;

    if (!name || !email || !phone || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const enquiry = await Enquiry.create({
      name,
      email,
      phone,
      message,
      product: productId || null,
    });

    res.status(201).json({ message: "Enquiry submitted successfully", enquiry });
  } catch (error) {
    res.status(500).json({ message: error.message || "Server error creating enquiry" });
  }
};

// @desc    Update enquiry status
// @route   PUT /api/enquiries/:id
// @access  Private/Admin
const updateEnquiryStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const enquiry = await Enquiry.findById(req.params.id);

    if (!enquiry) {
      return res.status(404).json({ message: "Enquiry not found" });
    }

    enquiry.status = status || enquiry.status;
    const updatedEnquiry = await enquiry.save();

    res.json(updatedEnquiry);
  } catch (error) {
    res.status(500).json({ message: "Server error updating enquiry" });
  }
};

// @desc    Delete enquiry
// @route   DELETE /api/enquiries/:id
// @access  Private/Admin
const deleteEnquiry = async (req, res) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id);
    if (!enquiry) {
      return res.status(404).json({ message: "Enquiry not found" });
    }

    await enquiry.deleteOne();
    res.json({ message: "Enquiry removed" });
  } catch (error) {
    res.status(500).json({ message: "Server error deleting enquiry" });
  }
};

module.exports = {
  getEnquiries,
  createEnquiry,
  updateEnquiryStatus,
  deleteEnquiry,
};
