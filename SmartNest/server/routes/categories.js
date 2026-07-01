const express = require("express");
const router = express.Router();
const {
  getCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");
const firebaseAuth = require("../middleware/firebaseAuth");
const upload = require("../middleware/upload");

router.route("/")
  .get(getCategories)
  .post(firebaseAuth, upload.single("image"), createCategory);

router.route("/:slug")
  .get(getCategoryBySlug);

router.route("/:id")
  .put(firebaseAuth, upload.single("image"), updateCategory)
  .delete(firebaseAuth, deleteCategory);

module.exports = router;
