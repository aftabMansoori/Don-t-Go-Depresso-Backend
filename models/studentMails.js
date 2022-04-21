const mongoose = require("mongoose");

const studenMailsSchema = new mongoose.Schema({
  studentMail: {
    type: String,
    required: true,
  },
  studentClgCode: {
    type: String,
    required: true,
  },
  studentClg: {
    type: String,
    ref: "College",
    required: true,
  },
  registeredDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("StudentMails", studenMailsSchema);
