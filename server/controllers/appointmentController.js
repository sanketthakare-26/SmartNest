const Appointment = require("../models/Appointment");
const { sendAppointmentConfirmationEmail } = require("../config/mailer");

// Public: Create a new booking
exports.createAppointment = async (req, res) => {
  try {
    const { productName, productSlug, consultancyType, date, timeSlot, name, email, phone, notes } = req.body;

    if (!productName || !productSlug || !consultancyType || !date || !timeSlot || !name || !email || !phone) {
      return res.status(400).json({ message: "Missing required appointment details" });
    }

    // Check if slot is already booked
    const existing = await Appointment.findOne({ date, timeSlot, status: { $ne: "Cancelled" } });
    if (existing) {
      return res.status(400).json({ message: "This slot has already been booked" });
    }

    const appointment = new Appointment({
      productName,
      productSlug,
      consultancyType,
      date,
      timeSlot,
      name,
      email,
      phone,
      notes,
      status: "Pending",
    });

    await appointment.save();

    // Send appointment confirmation email in the background
    sendAppointmentConfirmationEmail(appointment.email, {
      name: appointment.name,
      productName: appointment.productName,
      consultancyType: appointment.consultancyType,
      date: appointment.date,
      timeSlot: appointment.timeSlot,
      phone: appointment.phone,
    }).catch((err) =>
      console.error("Error sending appointment confirmation email in background:", err)
    );

    res.status(201).json({ message: "Appointment booked successfully", appointment });
  } catch (err) {
    console.error("Error creating appointment:", err);
    res.status(500).json({ message: "Server error during booking" });
  }
};

// Admin: Get all appointments
exports.getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find().sort({ date: 1, timeSlot: 1 });
    res.json({ appointments });
  } catch (err) {
    console.error("Error retrieving appointments:", err);
    res.status(500).json({ message: "Server error retrieving appointments" });
  }
};

// Admin: Update status of an appointment
exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["Pending", "Confirmed", "Completed", "Cancelled"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const appointment = await Appointment.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.json({ message: `Appointment status updated to ${status}`, appointment });
  } catch (err) {
    console.error("Error updating appointment status:", err);
    res.status(500).json({ message: "Server error updating status" });
  }
};

// Admin: Delete an appointment
exports.deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findByIdAndDelete(id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    res.json({ message: "Appointment deleted" });
  } catch (err) {
    console.error("Error deleting appointment:", err);
    res.status(500).json({ message: "Server error deleting appointment" });
  }
};
