const nodemailer = require("nodemailer");
const Enquiry = require("../models/Enquiry");

// @desc    Get all enquiries
// @route   GET /api/enquiries
// @access  Private/Admin
const getEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.find({}).populate("product", "name slug");
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
    const enquiry = await Enquiry.create(req.body);

    // Only attempt to send email if credentials are set
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
        });

        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: process.env.EMAIL_USER,
          subject: `New Enquiry from ${enquiry.name}`,
          text: `Phone: ${enquiry.phone}\nMessage: ${enquiry.message}`,
        });
      } catch (emailError) {
        console.error("Failed to send email notification:", emailError.message);
      }
    }

    res.status(201).json(enquiry);
  } catch (error) {
    res.status(500).json({ message: error.message || "Server error submitting enquiry" });
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
    res.status(500).json({ message: "Server error updating enquiry status" });
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