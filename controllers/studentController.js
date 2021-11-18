const bcrypt = require("bcrypt");
const passport = require("passport");
const jwt = require("jsonwebtoken");

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
      student.password = await bcrypt.hash(password, 10);
      await student.save();
      res.status(201).json({ message: "Student registered successfully" });
    } else {
      res.status(400).json({ message: "Password is incorrect" });
    }
  }
});

exports.signin = (req, res, next) => {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.status(400).json({
        message: info ? info.message : "Login failed",
        user: user,
      });
    }
    const token =  jwt.sign({id:user._id.toJSON()},process.env.SECRET,{expiresIn: 604800});
    res.status(200).json({
    message : info.message,
    token : token,
    user  : user  
  })
    // req.login(user, { session: false }, async (err) => {
    //   if (err) throw err;
    //   const token = await jwt.sign(user, process.env.SECRET);
    //   console.log(token);
    //   return res.status(200).json({ user, token });
    // });
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
  } = req.body;
  const student = await StudentMails.findOne({
    studentMail: req.user.studentClgEmail,
  });
  studentClgName = student.studentClg;
  let createdStudent = await Student.findOneAndUpdate(
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
  res.json({
    status: "Successful",
    message: "Profile Saved",
  });
});
