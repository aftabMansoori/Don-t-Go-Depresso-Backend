const mongoose = require('mongoose')

const scheduleSchema = new mongoose.Schema({
    studentID : {
        type : mongoose.Types.ObjectId,
        ref : "Student",
        default : true
    },
    counsellorID : {
        type : mongoose.Types.ObjectId,
        ref : "Counsellor",
        default : true
    },
    scheduleTime :{
        type : Date,
    },
    scheduleType :{
        type : String,
        enum : ["Scheduled","Appointment","History"],
        required : true,
        default : "Appointment"
    }
})

module.exports = mongoose.model('Schedule', scheduleSchema)
