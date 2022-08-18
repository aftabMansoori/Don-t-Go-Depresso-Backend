const bcrypt = require("bcrypt");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const Counsellor = require("../models/counsellor");
const StudentMails = require("../models/studentMails");
const Schedule = require("../models/schedule");
const { catchAsync } = require("../Utils/ErrorHandling");
const mongoose = require("mongoose");

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

exports.signup = catchAsync(async (req, res, next) => {
  let counsellorDetails = req.body;
  counsellorDetails.cousellorPassword = await bcrypt.hash(
    counsellorDetails.password,
    parseInt(process.env.Salt)
  );
  let counsellorCreated = await Counsellor.create(counsellorDetails);
  res.status(201).json({
    message: "User Created",
    counsellor: counsellorCreated,
  });
});

exports.acceptSchedule = catchAsync(async (req, res, next) => {
  let appoitmentID = req.body.appoitmentID;
  let scheduleTime = new Date(req.body.scheduleTime);
  if (!(scheduleTime instanceof Date && !isNaN(scheduleTime.valueOf()))) {
    res.status(200).json({
      message: "Please enter a valid Date",
    });
    return;
  }
  let appointmentDetails = await Schedule.findOne({
    $and: [
      { _id: mongoose.Types.ObjectId(appoitmentID) },
      { counsellorID: req.user._id },
    ],
  });
  if (!appointmentDetails) {
    res.status(200).json({
      message: "Schedule Does not Exist",
    });
    return;
  }
  let updatedSchedule = await Schedule.findByIdAndUpdate(
    appoitmentID,
    {
      scheduleTime: scheduleTime,
      scheduleType: "Scheduled",
    },
    { new: true }
  );
  res.status(200).json({
    message: "Schedule accepted",
    scheduleDetails: updatedSchedule,
  });
});

exports.getallappointment = catchAsync(async (req, res, next) => {
  let pipeline = [
    {
      $lookup: {
        from: "students",
        localField: "studentID",
        foreignField: "_id",
        as: "studentData",
      },
    },
    {
      $lookup: {
        from: "counsellors",
        localField: "counsellorID",
        foreignField: "_id",
        as: "counsellorData",
      },
    },
    {
      $unwind: "$studentData",
    },
    {
      $unwind: "$counsellorData",
    },
    {
      $project: {
        "studentData._id": 1,
        "counsellorData._id": 1,
        "counsellorData.counsellorName": 1,
        "counsellorData.counsellorUserName": 1,
        "studentData.studentName": 1,
        scheduleTime: 1,
        createdAt: 1,
        scheduleType: 1,
      },
    },
  ];
  let scheduledList = await Schedule.aggregate([
    {
      $facet: {
        history: [
          {
            $match: {
              $and: [
                { counsellorID: req.user._id },
                { scheduleType: "History" },
              ],
            },
          },
          ...pipeline,
        ],
        scheduled: [
          {
            $match: {
              $and: [
                { counsellorID: req.user._id },
                { scheduleType: "Scheduled" },
              ],
            },
          },
          ...pipeline,
        ],
        appointment: [
          {
            $match: {
              $and: [
                { counsellorID: req.user._id },
                { scheduleType: "Appointment" },
              ],
            },
          },
          ...pipeline,
        ],
      },
    },
  ]);
  res.status(200).json({
    message: "The Appointments are",
    scheduledList,
  });
});

exports.endmeeting = catchAsync(async (req, res, next) => {
  let appoitmentID = req.body.appoitmentID;
  let appointmentDetails = await Schedule.findOne({
    $and: [
      { _id: mongoose.Types.ObjectId(appoitmentID) },
      { counsellorID: req.user._id },
    ],
  });
  if (!appointmentDetails) {
    res.status(200).json({
      message: "Schedule Does not Exist",
    });
    return;
  }
  let updatedSchedule = await Schedule.findByIdAndUpdate(
    appoitmentID,
    {
      scheduleType: "History",
    },
    { new: true }
  );
  res.status(200).json({
    message: "Meeting Ended",
    scheduleDetails: updatedSchedule,
  });
});
