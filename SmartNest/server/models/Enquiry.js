const mongoose = require("mongoose");

const enquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      default: "",
      // Optional — not all enquiries come with an email
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    message: {
      type: String,
      trim: true,
      default: "",
      // Optional — kept optional to avoid form submission failures
    },
    category: {
      type: String,
      trim: true,
      default: "",
      // Interest category submitted from the Contact form
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      default: null,
    },
    status: {
      type: String,
      enum: ["Pending", "Contacted", "Completed"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Enquiry", enquirySchema);
