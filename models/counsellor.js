const mongoose = require('mongoose')

const counsellorSchema = new mongoose.Schema({
    counsellorName: {
        type: String,
        required: true
    },
    counsellorNo: {
        type: Number,
        required: true
    },
    counsellorEmail: {
        type: String
    },
    counsellorExp: {
        type: mixed
    },
    aboutCounsellor: {
        type: String
    }
})

module.exports = mongoose.model('Counsellor', counsellorSchema)