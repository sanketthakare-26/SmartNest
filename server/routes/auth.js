const express = require("express");
const router = express.Router();
const firebaseAuth = require("../middleware/firebaseAuth");

router.get("/me", firebaseAuth, (req, res) => {
  res.json({
    message: "Authenticated successfully",
    user: req.user,
  });
});

module.exports = router;
