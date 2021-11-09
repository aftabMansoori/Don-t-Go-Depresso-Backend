const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json("Counsellor route is live");
});

module.exports = router;
