const bcrypt = require("bcrypt");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const Student = require("../models/student");
const StudentMails = require("../models/studentMails");
const { catchAsync } = require("../Utils/ErrorHandling");
const Schedule = require("../models/schedule");
const Counsellor = require("../models/counsellor");
const College = require("../models/college");

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

exports.signout = (req, res) => {
  try {
    req.logout();
    res.status(200).json({ message: "signout Successfully" });
  } catch {
    res.status(401).json({ message: "Signing Out failed" });
  }
};

exports.studentProfile = catchAsync(async (req, res) => {
  const profile = req.body.profile;
  const student = await StudentMails.findOne({
    studentMail: req.user.studentClgEmail,
  });
  // console.log(req.user);
  // studentClgName = student.studentClg;
  await Student.findOneAndUpdate(
    { studentClgEmail: req.user.studentClgEmail },
    profile
  );
  res.status(200).json({
    status: "Successful",
    message: "Profile Saved",
  });
});

exports.scheduleAppointment = catchAsync(async (req, res, next) => {
  let scheduleDetails = req.body;
  let counsellor = await Counsellor.findById(req.body.counsellorID);
  if (!counsellor) {
    res.status(200).json({
      message: "Counsellor Not Found",
    });
    return;
  }
  scheduleDetails.studentID = req.user._id;
  let createdScehdule = await Schedule.create(scheduleDetails);
  res.status(201).json({
    message: "Appointment has been schedule",
    schedule: createdScehdule,
  });
});

exports.getallappointments = catchAsync(async (req, res, next) => {
  let scheduledList = await Schedule.find({
    $and: [{ studentID: req.user._id }],
  });
  res.status(200).json({
    message: "The Appointments are",
    scheduledList,
  });
});

exports.saveQuestionaire = catchAsync(async (req, res) => {
  let questionaire = req.body;
  let student = await Student.findById(req.user.id);
  student.questionaire.push(questionaire);
  student.save();
  res.status(200).json({
    message: "Questionaire added",
  });
});

exports.getResponse = catchAsync(async (req, res) => {
  let student = await Student.findById(req.user.id);
  res.status(200).json({
    message: "Response fetch successfull",
    response: student.questionaire,
  });
});

exports.getCounsellors = catchAsync(async (req, res, next) => {
  let college = await College.findOne({
    collegeCode: req.user.studentClgCode,
  }).populate("counsellor", "counsellorUserName");
  let counsellors = college.counsellor;
  res.status(200).json({ status: "Successful", counsellor: counsellors });
});
