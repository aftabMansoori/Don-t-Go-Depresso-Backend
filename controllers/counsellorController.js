const bcrypt = require("bcrypt");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const Counsellor = require("../models/counsellor");
const StudentMails = require("../models/studentMails");
const { catchAsync } = require("../Utils/ErrorHandling");

exports.signin = (req, res, next) => {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.status(400).json({
        message: info ? info.message : "Login failed",
        user: user,
      });
    }
    req.login(user, { session: false }, async (err) => {
      if (err) throw err;
      const token = jwt.sign(
        { id: user._id.toJSON(), role: user.role },
        process.env.SECRET,
        {
          expiresIn: 604800,
        }
      );
      res.status(200).json({
        message: info.message,
        token: token,
        user: user,
      });
    });
  })(req, res, next);
};
