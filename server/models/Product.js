const mongoose = require("mongoose");
const productSchema = new mongoose.Schema({
  name: String, slug: { type: String, unique: true }, sku: String,
  description: String,
  specs: [{ label: String, value: String }],
  images: [String],
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  brand: { type: mongoose.Schema.Types.ObjectId, ref: "Brand" },
  tags: [String],   // "featured", "top-selling", "trending"
  isActive: { type: Boolean, default: true },
}, { timestamps: true });
module.exports = mongoose.model("Product", productSchema);