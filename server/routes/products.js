const router = require("express").Router();
const ctrl = require("../controllers/productController");
const auth = require("../middleware/firebaseAuth");
const upload = require("../middleware/upload");

router.get("/", ctrl.getProducts);
router.get("/:slug", ctrl.getProductBySlug);
router.post("/", auth, upload.array("images", 5), ctrl.createProduct);    // Admin only
router.put("/:id", auth, upload.array("images", 5), ctrl.updateProduct);
router.delete("/:id", auth, ctrl.deleteProduct);

module.exports = router;