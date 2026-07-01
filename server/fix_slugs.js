require("dotenv").config();
const dns = require("dns");
dns.setDefaultResultOrder("ipv4first");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const mongoose = require("mongoose");

async function fixSlugs() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
      family: 4,
    });
    console.log("✅ Connected. Fixing category slugs...");

    const db = mongoose.connection.db;
    const categories = db.collection("categories");

    const slugFixes = [
      { name: "Digital Door Locks", correctSlug: "digital-door-lock" },
      { name: "Curtain & Blinds Automation", correctSlug: "curtain-blinds" },
      { name: "Touch Panels & Controllers", correctSlug: "touch-panels" },
      { name: "Motion Sensors & Security", correctSlug: "motion-security" },
      { name: "Home Automation Kits", correctSlug: "home-kits" },
    ];

    for (const fix of slugFixes) {
      const result = await categories.updateOne(
        { name: fix.name },
        { $set: { slug: fix.correctSlug } }
      );
      if (result.modifiedCount > 0) {
        console.log(`✔ Fixed slug for "${fix.name}" → "${fix.correctSlug}"`);
      } else {
        console.log(`~ No change for "${fix.name}" (may already be correct)`);
      }
    }

    // Also fix products that reference wrong category slugs via their category ObjectId
    // Since products use category ObjectId refs (not slugs), they should be fine
    console.log("\n✅ Slug fix complete!");
  } catch (err) {
    console.error("❌ Error:", err);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

fixSlugs();
