const mongoose = require('mongoose')

//Models
const StudentMails = require('./studentMails')

const collegeSchema = new mongoose.Schema({
    collegeCode: {
        type: Number,
        required: true
    },
    collegeName: {
        type: String,
        required: true
    },
    collegePhoneNo: {
        type: Number,
        required: true
    },
    collegeAddress: {
        type: String
    },
    collegeLocation: {
        type: String
    },
    // studentMails: [{type: Schema.Types.ObjectId, ref: StudentMails}]
})

module.exports = mongoose.model('College', collegeSchema)