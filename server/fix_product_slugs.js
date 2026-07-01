require("dotenv").config();
const dns = require("dns");
dns.setDefaultResultOrder("ipv4first");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const mongoose = require("mongoose");

// Map of product name -> correct slug (matching static data.js)
const productSlugMap = {
  "Hikvision 4MP Dome Camera": "hik-4mp-dome",
  "Dahua IR Bullet Camera": "dahua-ir-bullet",
  "CP Plus PTZ Camera": "cpplus-ptz",
  "Hikvision 8-Channel NVR Kit": "hik-nvr-8ch",
  "Dahua 16CH DVR System": "dahua-16ch-dvr",
  "Samsung SHP-DP609 Smart Lock": "samsung-shp-dp609",
  "Godrej Eurika Plus": "godrej-eurika-plus",
  "Philips EasyKey 702": "philips-easykey-702",
  "Bosch Smart Lock 3000": "bosch-3000",
  "Yale YDM 3168": "yale-ydm-3168",
  "FAAC Sliding Gate Motor": "faac-sliding",
  "BFT Deimos 600": "bft-deimos-600",
  "Nice Road400": "nice-road-400",
  "Came BX-78": "came-bx-78",
  "Roger Technology Heras Gate": "roger-heras",
  "Somfy Glydea Curtain Motor": "somfy-glydea",
  "Dooya DT82TV": "dooya-dt82tv",
  "Zemismart WiFi Curtain Motor": "zemismart-wifi",
  "Eve MotionBlinds Kit": "eve-motionblinds",
  "Somfy Irismo Curtain Motor": "somfy-irismo",
  "Schindler Smart Lift Panel": "schindler-smart-panel",
  "Thyssen Home Elevator Automation Kit": "thyssen-home",
  "Sigma Home Lift Controller": "sigma-home-lift",
  "Schindler Clean Mobility Kit": "schindler-clean-mobility",
  "Sigma Direct Drive Controller": "sigma-direct-drive",
  "Legrand Arteor Touch Panel": "legrand-arteor",
  "Schneider Wiser Smart Panel": "schneider-wiser",
  "Lutron Grafik T": "lutron-grafik-t",
  "ABB i-bus Smart Panel": "abb-ibus",
  "Legrand Living Now Panel": "legrand-livingnow",
  "Honeywell PIR Motion Sensor": "honeywell-pir",
  "Paradox Security Kit": "paradox-kit",
  "DSC Neo Alarm Kit": "dsc-neo",
  "Risco Agility 4": "risco-agility",
  "Honeywell Wireless PIR": "honeywell-wireless-pir",
  "SmartNest Starter Kit": "smartnest-starter",
  "Z-Wave Complete Home Bundle": "zwave-bundle",
  "Zigbee Pro Kit": "zigbee-pro",
  "Google Nest Ecosystem Bundle": "google-nest-bundle",
  "Google Nest Hub Max Kit": "google-nest-hub-max",
};

async function fixProductSlugs() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
      family: 4,
    });
    console.log("✅ Connected. Fixing product slugs...");

    const db = mongoose.connection.db;
    const products = db.collection("products");

    let fixed = 0;
    let skipped = 0;

    for (const [name, correctSlug] of Object.entries(productSlugMap)) {
      const result = await products.updateOne(
        { name },
        { $set: { slug: correctSlug } }
      );
      if (result.modifiedCount > 0) {
        console.log(`✔ Fixed: "${name}" → "${correctSlug}"`);
        fixed++;
      } else {
        console.log(`~ Skipped (no match or already correct): "${name}"`);
        skipped++;
      }
    }

    console.log(`\n✅ Done! Fixed: ${fixed}, Skipped: ${skipped}`);
  } catch (err) {
    console.error("❌ Error:", err);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

fixProductSlugs();
