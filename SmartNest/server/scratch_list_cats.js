require("dotenv").config();
const dns = require("dns");
dns.setDefaultResultOrder("ipv4first");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const mongoose = require("mongoose");
const Category = require("./models/Category");

const TEST_URI = "mongodb+srv://thakaresanket2006_db_user:C23Ie5046vdZhN9g@smartnest.cfxxprk.mongodb.net/?appName=SmartNest";

async function run() {
  try {
    await mongoose.connect(TEST_URI, {
      serverSelectionTimeoutMS: 10000,
      family: 4,
    });
    console.log("✅ Database Connected.");
    const categories = await Category.find({});
    console.log("Categories List:");
    console.log(JSON.stringify(categories, null, 2));
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

run();
