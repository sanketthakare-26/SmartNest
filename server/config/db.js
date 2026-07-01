const mongoose = require("mongoose");
const dns = require("dns");

// Force TCP-based DNS (bypasses networks that block UDP DNS SRV queries)
dns.setDefaultResultOrder("ipv4first");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.error("❌ MONGO_URI is not set in environment variables!");
    console.error("   → On Render/Railway/Vercel: add MONGO_URI in the Environment Variables dashboard");
    console.error("   → Locally: make sure server/.env exists with MONGO_URI=mongodb+srv://...");
    console.warn("⚠️  Server will run BUT all database operations will FAIL until MONGO_URI is set.");
    return; // Don't try to connect with undefined URI
  }

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 15000, // 15 second timeout
      family: 4, // Force IPv4
    });
    console.log("✅ MongoDB Atlas connected successfully");
    await seedDefaultAdmin();
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    console.warn("⚠️  Server will run but database features won't work until MongoDB is connected.");
    // Don't crash the server — allow it to keep running
  }
};

const seedDefaultAdmin = async () => {
  try {
    const Admin = require("../models/Admin");
    const adminEmail = "smartnest.techlab@gmail.com";
    let admin = await Admin.findOne({ email: adminEmail });
    if (!admin) {
      const defaultAdmin = new Admin({
        name: "SmartNest Admin",
        email: adminEmail,
        password: "SmartNest@123", // password will be hashed via the pre-save hook
      });
      await defaultAdmin.save();
      console.log("👤 Default admin account seeded successfully.");
    } else {
      // Verify if password matches (e.g. if it was sha256 or changed), update it if not matching
      const isMatch = await admin.comparePassword("SmartNest@123").catch(() => false);
      if (!isMatch) {
        console.log("👤 Default admin password did not match or was invalid hash format. Updating default password...");
        admin.password = "SmartNest@123";
        await admin.save();
        console.log("👤 Default admin password updated successfully.");
      } else {
        console.log("👤 Default admin account already exists with valid password.");
      }
    }
  } catch (err) {
    console.error("❌ Error seeding default admin:", err.message);
  }
};

module.exports = connectDB;