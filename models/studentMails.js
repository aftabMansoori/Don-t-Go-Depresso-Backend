const mongoose = require('mongoose')

const studenMailsSchema = new mongoose.Schema({
    studentMail: {
        type: String
    },
    studentClgCode: {
        type: String
    },
    studentClg: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'College'
    }
})

module.exports = mongoose.model('StudentMails', studenMailsSchema)