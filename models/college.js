const mongoose = require("mongoose");

const collegeSchema = new mongoose.Schema({
  collegeCode: {
    type: Number,
    required: true,
  },
  collegeName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  collegePhoneNo: {
    type: Number,
    required: true,
  },
  collegeAddress: {
    type: String,
  },
  collegeLocation: {
    type: String,
  },
  studentMails: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "StudentMails",
  },
  registeredDate: {
    type: Date,
    default: Date.now,
  },
  role: {
    type: String,
    default: "college",
  },
});

module.exports = mongoose.model("College", collegeSchema);
