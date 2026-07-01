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
    // Explicitly pick all enquiry fields so nothing is silently dropped
    const { name, email, phone, message, category, product } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ message: "Name and phone are required" });
    }

    const enquiry = await Enquiry.create({
      name: name.trim(),
      email: email ? email.trim() : "",
      phone: phone.trim(),
      message: message ? message.trim() : "",
      category: category ? category.trim() : "",
      product: product || null,
      status: "Pending",
    });

    console.log(`✅ New enquiry saved: ${enquiry.name} (${enquiry.phone}) — ${enquiry.category || "General"}`);

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
          subject: `📩 New SmartNest Enquiry from ${enquiry.name}`,
          html: `
            <h2>New Enquiry Received</h2>
            <p><strong>Name:</strong> ${enquiry.name}</p>
            <p><strong>Phone:</strong> ${enquiry.phone}</p>
            <p><strong>Email:</strong> ${enquiry.email || "Not provided"}</p>
            <p><strong>Category:</strong> ${enquiry.category || "General"}</p>
            <p><strong>Message:</strong> ${enquiry.message || "No message"}</p>
          `,
        });
      } catch (emailError) {
        console.error("Failed to send email notification:", emailError.message);
        // Don't fail the request if email fails
      }
    }

    res.status(201).json(enquiry);
  } catch (error) {
    console.error("createEnquiry error:", error.message);
    res.status(500).json({ message: error.message || "Server error submitting enquiry" });
  }
};

// @desc    Update enquiry status
// @route   PUT /api/enquiries/:id
// @access  Private/Admin
const updateEnquiryStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const updatedEnquiry = await Enquiry.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: false }
    );

    if (!updatedEnquiry) {
      return res.status(404).json({ message: "Enquiry not found" });
    }

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