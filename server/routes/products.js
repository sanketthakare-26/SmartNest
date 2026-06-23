const router = require("express").Router();
const ctrl = require("../controllers/productController");
const auth = require("../middleware/firebaseAuth");

router.get("/", ctrl.getAll);
router.get("/:slug", ctrl.getOne);
router.post("/", auth, ctrl.create);    // Admin only
router.put("/:id", auth, ctrl.update);
router.delete("/:id", auth, ctrl.remove);

module.exports = router;