const express = require("express");
const router = express.Router();
const passport = require("passport");
const counsellorController = require("./../controllers/counsellorController");
router.get("/", (req, res) => {
  res.status(200).json("Counsellor route is live");
});
router.post("/signup",counsellorController.signup);
router.post("/signin", counsellorController.signin);
router.use(passport.authenticate("jwt", { session: false }));
router.post("/acceptschedule",counsellorController.acceptSchedule);
router.get("/getallappointment",counsellorController.getallappointment);
router.post("/endmeeting",counsellorController.endmeeting);
module.exports = router;
