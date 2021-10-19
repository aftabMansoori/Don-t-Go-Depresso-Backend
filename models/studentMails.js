const mongoose = require('mongoose')

const studenMailsSchema = new mongoose.Schema({
    studentMail: {
        type: String
    },
    studentClgCode: {
        type: String
    }
})

module.exports = mongoose.model('StudentMails', studenMailsSchema)