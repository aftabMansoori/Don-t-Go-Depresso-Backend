const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

// Load User model
const College = require("../models/college");
const Student = require("../models/student");

const authenticateUser = (req, username, password, done) => {
  if (req.body.role === "college") {
    College.findOne({
      collegeCode: username,
    }).then((college) => {
      if (!college) {
        return done(null, false, { message: "College is not registered" });
      }
      bcrypt.compare(password, college.password, (err, isMatch) => {
        if (err) throw err;
        if (isMatch) {
          return done(null, college, { message: "Login Successful" });
        } else {
          return done(null, false, {
            message: "Username or password is incorrect",
          });
        }
      });
    });
  } else if (req.body.role === "student") {
    Student.findOne({
      studentClgEmail: username,
    }).then((student) => {
      if (!student) {
        return done(null, false, { message: "Student is not registered" });
      }
      bcrypt.compare(password, student.password, (err, isMatch) => {
        if (err) throw err;
        if (isMatch)
          return done(null, student, { message: "Login Successful" });
        else
          return done(null, false, {
            message: "Username or password is incorrect",
          });
      });
    });
  }
};

passport.use(
  "local",
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
      passReqToCallback: true,
    },
    authenticateUser
  )
);

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.SECRET,
    },
    (jwtPayload, done) => {
      console.log(jwtPayload)
      if (jwtPayload.role == "student")
        return Student.findById(jwtPayload.id)
          .select("-password")
          .then((user) => {
            return done(null, user);
          })
          .catch((err) => {
            return done(err);
          });
      else if(jwtPayload.role == "college")
      return College.findById(jwtPayload.id)
        .select("-password")
        .then((user) => {
          return done(null, user);
        })
        .catch((err) => {
          return done(err);
        });
    }
  )
);
