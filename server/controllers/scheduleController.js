const Schedule = require("../models/Schedule");
const Appointment = require("../models/Appointment");

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Generate time slots from a startTime/endTime string ("HH:MM") 
 * with a slotDuration interval (minutes). Returns e.g. ["09:00 AM", "09:30 AM", ...]
 */
function generateSlots(startTime, endTime, slotDuration) {
  const [startH, startM] = startTime.split(":").map(Number);
  const [endH, endM] = endTime.split(":").map(Number);
  const startMins = startH * 60 + startM;
  const endMins = endH * 60 + endM;
  const slots = [];

  for (let m = startMins; m + slotDuration <= endMins; m += slotDuration) {
    const h = Math.floor(m / 60);
    const min = m % 60;
    const suffix = h < 12 ? "AM" : "PM";
    const displayH = h % 12 === 0 ? 12 : h % 12;
    slots.push(`${String(displayH).padStart(2, "0")}:${String(min).padStart(2, "0")} ${suffix}`);
  }
  return slots;
}

// ─── Controllers ──────────────────────────────────────────────────────────────

// Public: Get available slots for a given date
exports.getAvailableSlots = async (req, res) => {
  try {
    const { date } = req.query; // YYYY-MM-DD
    if (!date) {
      return res.status(400).json({ message: "Date parameter is required" });
    }

    // Use a simple date parse to get day of week safely
    const parts = date.split("-");
    const dateObj = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayOfWeek = days[dateObj.getDay()];

    // Find active schedules for this day
    const schedules = await Schedule.find({ dayOfWeek, isActive: true });

    if (!schedules || schedules.length === 0) {
      return res.json({ slots: [] });
    }

    // Build all possible slot strings
    let allSlots = [];
    for (const sch of schedules) {
      const generated = generateSlots(sch.startTime, sch.endTime, sch.slotDuration);
      allSlots = allSlots.concat(generated);
    }
    // Deduplicate and sort
    allSlots = [...new Set(allSlots)].sort();

    // Find already-booked appointments for this date
    const bookedAppointments = await Appointment.find({
      date,
      status: { $ne: "Cancelled" },
    });
    const bookedSlots = bookedAppointments.map((a) => a.timeSlot);

    // Return only available
    const availableSlots = allSlots.filter((s) => !bookedSlots.includes(s));
    res.json({ slots: availableSlots });
  } catch (err) {
    console.error("Error fetching available slots:", err);
    res.status(500).json({ message: "Server error retrieving available slots" });
  }
};

// Admin: Get all schedules
exports.getAllSchedules = async (req, res) => {
  try {
    const schedules = await Schedule.find().sort({ dayOfWeek: 1, startTime: 1 });
    res.json({ schedules });
  } catch (err) {
    console.error("Error retrieving schedules:", err);
    res.status(500).json({ message: "Server error retrieving schedules" });
  }
};

// Admin: Create a new schedule slot
exports.createSchedule = async (req, res) => {
  try {
    const { dayOfWeek, date, startTime, endTime, slotDuration, isActive } = req.body;

    if (!startTime || !endTime) {
      return res.status(400).json({ message: "startTime and endTime are required" });
    }
    if (!dayOfWeek && !date) {
      return res.status(400).json({ message: "Either dayOfWeek or date is required" });
    }

    const schedule = new Schedule({
      dayOfWeek: dayOfWeek || null,
      date: date || null,
      startTime,
      endTime,
      slotDuration: slotDuration || 30,
      isActive: isActive !== undefined ? isActive : true,
    });

    await schedule.save();
    res.status(201).json({ message: "Schedule slot created", schedule });
  } catch (err) {
    console.error("Error creating schedule:", err);
    res.status(500).json({ message: "Server error creating schedule" });
  }
};

// Admin: Update an existing schedule slot
exports.updateSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const schedule = await Schedule.findByIdAndUpdate(id, updates, { new: true });
    if (!schedule) {
      return res.status(404).json({ message: "Schedule not found" });
    }
    res.json({ message: "Schedule updated", schedule });
  } catch (err) {
    console.error("Error updating schedule:", err);
    res.status(500).json({ message: "Server error updating schedule" });
  }
};

// Admin: Delete a schedule slot
exports.deleteSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const schedule = await Schedule.findByIdAndDelete(id);
    if (!schedule) {
      return res.status(404).json({ message: "Schedule not found" });
    }
    res.json({ message: "Schedule deleted" });
  } catch (err) {
    console.error("Error deleting schedule:", err);
    res.status(500).json({ message: "Server error deleting schedule" });
  }
};
