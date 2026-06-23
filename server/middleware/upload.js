const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: { folder: "smartnest", allowed_formats: ["jpg", "png", "webp"] },
});
module.exports = multer({ storage });