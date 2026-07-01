require("dotenv").config();
const dns = require("dns");
dns.setDefaultResultOrder("ipv4first");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const mongoose = require("mongoose");

const featuredNames = [
  "Qubo Smart Bullet Cam Pro 4MP [2026 Edition] by Hero Group",
  "Aqara Smart Curtain Motor E1, REQUIRES AQARA Zigbee Hub, Track Version, Voice Control Compatibility (Alexa, Siri, Google Assistant & IFTTT), Remote Control",
  "Qubo Instaview (New Launch 2026) Smart Video Doorbell with 2 Way Talk",
  "wipro 9-Watt B22 WiFi Smart LED Bulb with Music Sync"
];

const topSellerNames = [
  "Godrej Smart Lock I Advantis Revolution Digital Lock for Wooden Door |for Main Door | 4 in 1 Access | Pin Access | Fingerprint | RFID Card | Mechanical Key",
  "Dorset DG 104 Smart Wi-Fi Digital Door Lock | App & Remote Unlock | Fingerprint, PIN, RFID, Key & OTP | SS Deadbolt | 2-Yr Warranty | Graphite Matte Finish",
  "CP PLUS 4MP Quad HD Smart Wi-Fi CCTV Camera for Home | 360° View",
  "Goldmedal 6Module I-Touch Wifi Panel|6 Switch,Fan Regulator,Master Switch"
];

const trendingNames = [
  "ULTRALOQ Latch 5 World's First Built-in WiFi Smart Lock",
  "Consistent 3MP 4G PAN-TILT ATC Camera, CEYE Series with SIM Card Support Slot",
  "HomeMate Smart Curtain Opener, Remote Control Electronic Blinds",
  "PHILIPS WiZ 10W B22 Wi-Fi & Bluetooth LED Smart Bulb"
];

async function applyTags() {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      console.error("❌ MONGO_URI not set!");
      process.exit(1);
    }
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 15000,
      family: 4
    });
    console.log("✅ Connected to database. Applying tags...");

    const Product = require("./models/Product");

    // Reset all tags to empty strings first
    await Product.updateMany({}, { $set: { tag: "", featured: false } });
    console.log("🧹 Reset all existing product tags to empty.");

    // Helper to update specific products by name
    const updateTags = async (names, tag, featuredValue) => {
      for (const name of names) {
        const res = await Product.updateOne(
          { name: name },
          { $set: { tag: tag, featured: featuredValue } }
        );
        if (res.modifiedCount > 0) {
          console.log(`✔ Tagged: "${name.substring(0, 40)}..." as "${tag}" (featured: ${featuredValue})`);
        } else {
          // Fallback check by prefix
          const prefix = name.substring(0, 40);
          const resFallback = await Product.updateOne(
            { name: new RegExp("^" + prefix.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), "i") },
            { $set: { tag: tag, featured: featuredValue } }
          );
          if (resFallback.modifiedCount > 0) {
            console.log(`✔ Tagged (Prefix Match): "${prefix}..." as "${tag}" (featured: ${featuredValue})`);
          } else {
            console.log(`❌ Failed to find or update: "${prefix}..."`);
          }
        }
      }
    };

    console.log("\nTagging Featured items...");
    await updateTags(featuredNames, "Featured", true);

    console.log("\nTagging Top Seller items...");
    await updateTags(topSellerNames, "Top Seller", true);

    console.log("\nTagging Trending items...");
    await updateTags(trendingNames, "Trending", false);

    console.log("\n🎉 Tags successfully applied!");
  } catch (err) {
    console.error("❌ Error:", err.message);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

applyTags();
