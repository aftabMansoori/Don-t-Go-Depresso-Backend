const bcrypt = require("bcrypt");
const passport = require("passport");

const Student = require("../models/student");
const StudentMails = require("../models/studentMails");
const { catchAsync } = require("../Utils/ErrorHandling");

exports.signup = catchAsync(async (req, res) => {
  const { studentClgEmail, studentClgCode, password, confPassword } =
    req.body.student;
  const studentMail = await StudentMails.findOne({ studentClgEmail });
  if (!studentMail) {
    res.status(400).json({ message: "Student is not registered by College" });
  } else {
    if (password === confPassword) {
      student = new Student({
        studentClgEmail,
        studentClgCode,
        password,
      });
      student.password = await bcrypt.hash(
        password,
        parseInt(process.env.Salt)
      );
      await student.save();
      res.status(201).json({ message: "Student registered successfully" });
    } else {
      res.status(400).json({ message: "Password is incorrect" });
    }
  }
});

exports.signin = (req, res, next) => {
  passport.authenticate("student", function (err, user) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(400).json("User not found");
    }
    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }
      return res
        .status(200)
        .json({ status: "Success", message: "Signin Successfull" });
    });
  })(req, res, next);
};

exports.signout = (req, res) => {
  try {
    req.logout();
    res.status(200).json({ message: "signout Successfully" });
  } catch {
    res.status(401).json({ message: "Signing Out failed" });
  }
};

exports.studentProfile = catchAsync(async (req, res) => {
  const {
    studentName,
    studentPRN,
    studentClass,
    studentPhoneNo,
    studentAge,
    aboutStudent,
  } = req.body.profile;
  console.log("*************");
  console.log(req.user);
  const student = await StudentMails.findOne({
    studentMail: req.user.studentClgEmail,
  });
  studentClgName = student.studentClg;
  console.log("Student", student);
  Student.findOneAndUpdate(
    { studentClgEmail: req.user.studentClgEmail },
    {
      studentName,
      studentPRN,
      studentClass,
      studentPhoneNo,
      studentAge,
      aboutStudent,
      studentClgName,
    }
  );
  res.status(201).json({
    status: "Successful",
    message: "Profile Saved",
  });
});
