require("dotenv").config();
const dns = require("dns");
dns.setDefaultResultOrder("ipv4first");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const mongoose = require("mongoose");

// Map of product slug -> correct tag and featured status
const productTagMap = {
  "hik-4mp-dome": { tag: "Top Seller", featured: true },
  "dahua-ir-bullet": { tag: "Trending", featured: false },
  "hik-nvr-8ch": { tag: "Featured", featured: true },
  "samsung-shp-dp609": { tag: "Top Seller", featured: true },
  "philips-easykey-702": { tag: "Trending", featured: false },
  "faac-sliding": { tag: "Top Seller", featured: true },
  "nice-road-400": { tag: "Trending", featured: false },
  "somfy-glydea": { tag: "Top Seller", featured: true },
  "zemismart-wifi": { tag: "Trending", featured: false },
  "somfy-irismo": { tag: "New", featured: false },
  "schindler-smart-panel": { tag: "Featured", featured: true },
  "schindler-clean-mobility": { tag: "New", featured: false },
  "legrand-arteor": { tag: "Top Seller", featured: true },
  "lutron-grafik-t": { tag: "Trending", featured: false },
  "legrand-livingnow": { tag: "New", featured: false },
  "honeywell-pir": { tag: "Top Seller", featured: true },
  "dsc-neo": { tag: "Trending", featured: false },
  "honeywell-wireless-pir": { tag: "New", featured: false },
  "smartnest-starter": { tag: "Featured", featured: true },
  "zigbee-pro": { tag: "Trending", featured: false },
  "google-nest-hub-max": { tag: "New", featured: false }
};

async function fixProductTags() {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      console.error("❌ MONGO_URI is not set!");
      process.exit(1);
    }

    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 15000,
      family: 4,
    });
    console.log("✅ Connected to MongoDB. Running tag updates...");

    const Product = require("./models/Product");

    let updated = 0;
    let skipped = 0;

    for (const [slug, meta] of Object.entries(productTagMap)) {
      const result = await Product.updateOne(
        { slug: slug },
        { 
          $set: { 
            tag: meta.tag, 
            featured: meta.featured 
          } 
        }
      );

      if (result.modifiedCount > 0) {
        console.log(`✔ Updated tag for product "${slug}" → Tag: "${meta.tag}", Featured: ${meta.featured}`);
        updated++;
      } else {
        console.log(`~ No change or not found for "${slug}"`);
        skipped++;
      }
    }

    console.log(`\n🎉 Tag updates completed. Updated: ${updated}, Skipped: ${skipped}`);
  } catch (err) {
    console.error("❌ Error running script:", err.message);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

fixProductTags();
