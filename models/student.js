const mongoose = require('mongoose')

const studentSchema = new mongoose.Schema({
    studentClgCode: {
        type: String
    },
    studentClgEmail: {
        type: String,
        required: true,
        unique : true
    },
    password: {
        type: String,
        required: true
    },
    studentName: {
        type: String
    },
    studentPRN: {
        type: String
    },
    studentClass: {
        type: String
    },
    studentClgName: {
        type: String
    },
    studentPhoneNo: {
        type: Number
    },
    studentAge: {
        type: Number
    },
    aboutStudent: {
        type: String
    },
    aboutIssue: {
        type: String
    },
    role: {
        type: String,
        default: 'student'
    }
})

module.exports = mongoose.model('Student', studentSchema)