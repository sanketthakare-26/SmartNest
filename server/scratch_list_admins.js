require("dotenv").config();
const dns = require("dns");
dns.setDefaultResultOrder("ipv4first");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const mongoose = require("mongoose");
const Admin = require("./models/Admin");

const TEST_URI = "mongodb+srv://thakaresanket2006_db_user:C23Ie5046vdZhN9g@smartnest.cfxxprk.mongodb.net/?appName=SmartNest";

async function run() {
  try {
    await mongoose.connect(TEST_URI, {
      serverSelectionTimeoutMS: 10000,
      family: 4,
    });
    const admins = await Admin.find({});
    console.log("Admins:", admins.map(a => ({ id: a._id, email: a.email, name: a.name })));
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

run();
