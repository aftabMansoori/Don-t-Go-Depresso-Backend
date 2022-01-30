const mongoose = require('mongoose')

const studenMailsSchema = new mongoose.Schema({
    studentMail: {
        type: String,
        required : true,
        unique : true
    },
    studentClgCode: {
        type: String,
        required : true
    },
    studentClg: {
        type: String,
        ref: 'College',
        required : true
    }
})

module.exports = mongoose.model('StudentMails', studenMailsSchema)