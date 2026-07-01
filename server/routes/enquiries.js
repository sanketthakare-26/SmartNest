const express = require("express");
const router = express.Router();
const {
  getEnquiries,
  createEnquiry,
  updateEnquiryStatus,
  deleteEnquiry,
} = require("../controllers/enquiryController");
const firebaseAuth = require("../middleware/firebaseAuth");

router.route("/")
  .get(firebaseAuth, getEnquiries)
  .post(createEnquiry);

router.route("/:id")
  .put(firebaseAuth, updateEnquiryStatus)
  .delete(firebaseAuth, deleteEnquiry);

module.exports = router;
