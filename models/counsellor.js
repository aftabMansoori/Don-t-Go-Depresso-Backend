const mongoose = require("mongoose");

const counsellorSchema = new mongoose.Schema({
  counsellorUserName: {
    type: String,
    required: true,
    unique : true
  },
  counsellorName: {
    type: String,
    required: true,
  },
  counsellorNo: {
    type: Number,
    required: true,
    unique : true
  },
  counsellorEmail: {
    type: String,
    unique : true
  },
  cousellorPassword : {
    type: String,
    required : true
  },
  counsellorExp: {
    type: mongoose.SchemaTypes.Mixed,
  },
  aboutCounsellor: {
    type: String,
  },
  role: {
    type: String,
    default: "counsellor",
  },
});

module.exports = mongoose.model("Counsellor", counsellorSchema);
