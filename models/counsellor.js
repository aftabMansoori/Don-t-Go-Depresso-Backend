const mongoose = require("mongoose");

const counsellorSchema = new mongoose.Schema({
  counsellorUserName: {
    type: String,
    required: true,
    unique : true
  },
  counsellorName: {
    type: String,
  },
  counsellorNo: {
    type: Number,
  },
  counsellorEmail: {
    type: String,
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
