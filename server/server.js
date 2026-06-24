require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();
connectDB();

// Explicitly allow the Vite frontend dev server and any local origin
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:3000", "http://127.0.0.1:5173", "http://127.0.0.1:5174"],
  credentials: true,
}));
app.use(express.json());

// Health check endpoint — frontend can use this to test connectivity
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "SmartNest API is running" });
});

app.use("/api/products", require("./routes/products"));
app.use("/api/categories", require("./routes/categories"));
app.use("/api/brands", require("./routes/brands"));
app.use("/api/enquiries", require("./routes/enquiries"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/user", require("./routes/userAuth"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT} (Atlas DB)`)
);