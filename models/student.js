const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  studentClgCode: {
    type: String,
  },
  studentClgEmail: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  studentName: {
    type: String,
  },
  studentPRN: {
    type: String,
  },
  studentClass: {
    type: String,
  },
  studentClgName: {
    type: String,
  },
  studentPhoneNo: {
    type: Number,
  },
  studentAge: {
    type: Number,
  },
  gender: {
    type: String,
  },
  aboutStudent: {
    type: String,
  },
  aboutIssue: {
    type: String,
  },
  fatherOcc: {
    type: String,
  },
  motherOcc: {
    type: String,
  },
  medication: {
    type: Boolean,
  },
  abtMedication: {
    type: String,
    default: "none",
  },
  handicapped: {
    type: Boolean,
  },
  role: {
    type: String,
    default: "student",
  },
  registeredDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Student", studentSchema);
