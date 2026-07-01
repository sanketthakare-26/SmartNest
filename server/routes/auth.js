const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const firebaseAuth = require("../middleware/firebaseAuth");

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
    if (!admin) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: admin._id, email: admin.email, name: admin.name },
      process.env.JWT_SECRET || "smartnest_secret_key_12345",
      { expiresIn: "1d" }
    );

    res.json({
      token,
      admin: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error during login" });
  }
});

// GET /api/auth/me
router.get("/me", firebaseAuth, async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id).select("-password");
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.json({
      message: "Authenticated successfully",
      admin: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
      },
    });
  } catch (err) {
    console.error("Auth me error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
