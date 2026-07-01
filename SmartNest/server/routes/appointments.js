const express = require("express");
const router = express.Router();
const appointmentController = require("../controllers/appointmentController");
const firebaseAuth = require("../middleware/firebaseAuth");

// Public
router.post("/", appointmentController.createAppointment);

// Admin (protected)
router.get("/", firebaseAuth, appointmentController.getAllAppointments);
router.put("/:id/status", firebaseAuth, appointmentController.updateAppointmentStatus);
router.delete("/:id", firebaseAuth, appointmentController.deleteAppointment);

module.exports = router;
