const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const firebaseAuth = require("../middleware/firebaseAuth"); // Note: this is actually standard JWT verification middleware

const JWT_SECRET = process.env.JWT_SECRET || "smartnest_secret_key_12345";

// POST /api/user/register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const emailLower = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: emailLower });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    const user = new User({
      name,
      email: emailLower,
      password,
    });

    await user.save();

    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error during registration" });
  }
});

// POST /api/user/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error during login" });
  }
});

// GET /api/user/me
router.get("/me", firebaseAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({
      message: "Authenticated successfully",
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (err) {
    console.error("Auth me error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/user/google-auth
router.post("/google-auth", async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const emailLower = email.toLowerCase().trim();
    let user = await User.findOne({ email: emailLower });

    if (!user) {
      // Create user with a dummy secure password since they authenticate via Google
      const crypto = require("crypto");
      const randomPassword = crypto.randomBytes(16).toString("hex");
      user = new User({
        name: name || emailLower.split("@")[0],
        email: emailLower,
        password: randomPassword,
      });
      await user.save();
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (err) {
    console.error("Google auth error:", err);
    res.status(500).json({ message: "Server error during Google auth" });
  }
});

module.exports = router;
