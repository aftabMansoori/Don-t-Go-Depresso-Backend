const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");

const collegeController = require("../controllers/collegeController");

router.get("/", (req, res) => {
  res.status(200).json({ status: "ok" });
});

router.get("/signout", collegeController.signout);
router.post("/signup", collegeController.signup);
router.post("/signin", collegeController.signin);

router.use(passport.authenticate("jwt", { session: false }));
router.post("/student-mails", collegeController.studentMails);
router.get("/get-emails", collegeController.getMails);

module.exports = router;
