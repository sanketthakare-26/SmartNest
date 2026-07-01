const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  productSlug: { type: String, required: true },
  consultancyType: { type: String, enum: ["Phone Call", "Physical Visit"], required: true },
  date: { type: String, required: true }, // "YYYY-MM-DD"
  timeSlot: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  notes: { type: String },
  status: { type: String, enum: ["Pending", "Confirmed", "Cancelled"], default: "Pending" }
}, { timestamps: true });

module.exports = mongoose.model("Appointment", appointmentSchema);
