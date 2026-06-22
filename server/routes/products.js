const express = require("express");
const router = express.Router();
const {
  getProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const firebaseAuth = require("../middleware/firebaseAuth");
const upload = require("../middleware/upload");

router.route("/")
  .get(getProducts)
  .post(firebaseAuth, upload.array("images", 5), createProduct);

router.route("/:slug")
  .get(getProductBySlug);

router.route("/:id")
  .put(firebaseAuth, upload.array("images", 5), updateProduct)
  .delete(firebaseAuth, deleteProduct);

module.exports = router;
