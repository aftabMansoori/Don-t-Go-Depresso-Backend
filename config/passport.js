const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

// Load User model
const College = require("../models/college");
const Student = require("../models/student");

module.exports = function (passport) {
  passport.use(
    "college",
    new LocalStrategy(
      { usernameField: "collegeCode", passwordField: "password" },
      (collegeCode, password, done) => {
        console.log("YESS");
        College.findOne({
          collegeCode: collegeCode,
        }).then((college) => {
          if (!college) {
            return done(null, false); //{ message: 'College is not registered' }
          }
          bcrypt.compare(password, college.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
              return done(null, college);
            } else {
              return done(null, false); //{ message : 'Password incorrect' }
            }
          });
        });
      }
    )
  );

  passport.use(
    "student",
    {
      usernameField: "studentClgEmail",
      passwordField: "password",
    },
    new LocalStrategy((studentClgEmail, password, done) => {
      console.log(studentClgEmail);
      Student.findOne({
        studentClgEmail,
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
    })
  );

  passport.use(
    "college",
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.SECRET,
      },
      (jwtPayload, done) => {
        return (
          Student.findById(jwtPayload.id)
            // .select("-password")
            .then((user) => {
              return done(null, user);
            })
            .catch((err) => {
              return done(err);
            })
        );
      }
    )
  );

  passport.use(
    "student",
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.SECRET,
      },
      (jwtPayload, done) => {
        return (
          Student.findById(jwtPayload.id)
            // .select("-password")
            .then((user) => {
              return done(null, user);
            })
            .catch((err) => {
              return done(err);
            })
        );
      }
    )
  );

  // passport.serializeUser(function(user, done) {
  //   done(null, { id: user.id, role: user.role })
  // })

  // passport.deserializeUser(function(obj, done) {
  //   switch (obj.role) {
  //     case 'student':
  //         Student.findById(obj.id)
  //             .then(student => {
  //                 if (student) {
  //                     done(null, student);
  //                 }
  //                 else {
  //                     done(new Error('student id not found:' + obj.id, null));
  //                 }
  //             });
  //         break;
  //     case 'college':
  //         College.findById(obj.id)
  //             .then(college => {
  //                 if (college) {
  //                     done(null, college);
  //                 } else {
  //                     done(new Error('college id not found:' + obj.id, null));
  //                 }
  //             });
  //         break;
  //     default:
  //         done(new Error('no entity role:'+ obj.role), null);
  //         break;
  //   }
  // })
};
