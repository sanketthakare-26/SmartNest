const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Brand name is required"],
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    logo: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

// Auto-generate slug from name before saving
brandSchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  }
  next();
});

module.exports = mongoose.model("Brand", brandSchema);
