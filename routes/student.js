const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const studentController = require("../controllers/studentController");

router.get("/", (req, res) => {
  res.json({ Status: "StudentRoute - OK" });
});

router.get("/signout", studentController.signout);
router.post("/signup", studentController.signup);
router.post("/signin", studentController.signin);
router.use(passport.authenticate("jwt", { session: false }));
router.post("/profile", studentController.studentProfile);
router.post("/scheduleappointment", studentController.scheduleAppointment);
router.get("/getallappointments", studentController.getallappointments);
router.post("/save-questionaire", studentController.saveQuestionaire);
router.get("/response", studentController.getResponse);
router.get("/get-counsellors", studentController.getCounsellors);
module.exports = router;
