const mongoose = require('mongoose')

const studentSchema = new mongoose.Schema({
    studentName: {
        type: String,
        required: true
    },
    studentClgCode: {
        type: String
    },
    studentClgEmail: {
        type: String,
        required: true
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
        type: Number,
        required: true
    },
    aboutStudent: {
        type: String
    },
    aboutIssue: {
        type: String
    }
})

module.exports = mongoose.model('Student', studentSchema)