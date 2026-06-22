const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// Load Environment Variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middlewares
app.use(helmet({
  crossOriginResourcePolicy: false, // Allow loading local uploads in frontend browser
}));
app.use(cors({
  origin: "*", // Adjust in production
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Static Folder for Local Uploads
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

// Health Check Route
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "SmartNest API Server is running" });
});

// Mount Routes
app.use("/api/products", require("./routes/products"));
app.use("/api/categories", require("./routes/categories"));
app.use("/api/brands", require("./routes/brands"));
app.use("/api/enquiries", require("./routes/enquiries"));
app.use("/api/auth", require("./routes/auth"));

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err.stack);
  res.status(err.status || 500).json({
    message: err.message || "An unexpected error occurred on the server",
    error: process.env.NODE_ENV === "development" ? err.stack : {},
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`);
});
