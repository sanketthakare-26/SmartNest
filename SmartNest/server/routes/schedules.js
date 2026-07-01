const express = require("express");
const router = express.Router();
const scheduleController = require("../controllers/scheduleController");
const firebaseAuth = require("../middleware/firebaseAuth");

// Public
router.get("/available", scheduleController.getAvailableSlots);

// Admin (protected)
router.get("/", firebaseAuth, scheduleController.getAllSchedules);
router.post("/", firebaseAuth, scheduleController.createSchedule);
router.put("/:id", firebaseAuth, scheduleController.updateSchedule);
router.delete("/:id", firebaseAuth, scheduleController.deleteSchedule);

module.exports = router;
