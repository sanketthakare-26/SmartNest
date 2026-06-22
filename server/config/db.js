const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const connString = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/smartnest";
    const conn = await mongoose.connect(connString);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.log("Proceeding with database-disabled mock state or retrying later...");
  }
};

module.exports = connectDB;
