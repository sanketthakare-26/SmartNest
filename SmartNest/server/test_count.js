require("dotenv").config();
const dns = require("dns");
dns.setDefaultResultOrder("ipv4first");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const mongoose = require("mongoose");
const Product = require("./models/Product");
const Category = require("./models/Category");
const Brand = require("./models/Brand");

const TEST_URI = "mongodb+srv://thakaresanket2006_db_user:C23Ie5046vdZhN9g@smartnest.cfxxprk.mongodb.net/?appName=SmartNest";

async function run() {
  try {
    console.log("Connecting to:", TEST_URI);
    await mongoose.connect(TEST_URI, {
      serverSelectionTimeoutMS: 10000,
      family: 4,
    });
    console.log("✅ Database Connected successfully!");
    
    const prodCount = await Product.countDocuments();
    const catCount = await Category.countDocuments();
    const brandCount = await Brand.countDocuments();
    
    console.log(`Products in DB: ${prodCount}`);
    console.log(`Categories in DB: ${catCount}`);
    console.log(`Brands in DB: ${brandCount}`);
  } catch (err) {
    console.error("❌ Connection Error:", err);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

run();
