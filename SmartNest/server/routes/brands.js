const express = require("express");
const router = express.Router();
const {
  getBrands,
  getBrandBySlug,
  createBrand,
  updateBrand,
  deleteBrand,
} = require("../controllers/brandController");
const firebaseAuth = require("../middleware/firebaseAuth");
const upload = require("../middleware/upload");

router.route("/")
  .get(getBrands)
  .post(firebaseAuth, upload.single("logo"), createBrand);

router.route("/:slug")
  .get(getBrandBySlug);

router.route("/:id")
  .put(firebaseAuth, upload.single("logo"), updateBrand)
  .delete(firebaseAuth, deleteBrand);

module.exports = router;
