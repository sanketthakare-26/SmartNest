const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema(
  {
    dayOfWeek: { type: String, default: null }, // "Monday", "Tuesday", etc.
    date: { type: String, default: null },       // "YYYY-MM-DD" for specific date overrides
    startTime: { type: String, required: true }, // "09:00"
    endTime: { type: String, required: true },   // "17:00"
    slotDuration: { type: Number, default: 30 }, // in minutes
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Schedule", scheduleSchema);
