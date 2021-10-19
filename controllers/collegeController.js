const College = require('../models/college')

exports.signup = async (req, res) => {
    const { collegeCode, collegeName, collegePhoneNo, collegeAddress, collegeLocation } = req.body
    let college = await College.findOne({ collegeCode })
    if (college) {
        res.status(400).json(collegeName+" already registered")
    } else {
        college = new College({
            collegeCode, collegeName, collegePhoneNo, collegeAddress, collegeLocation
        })
        college
            .save()
            .then(() => {
                res.status(201).json(collegeName+' registered successfully')
                // console.log(college)
            })
            .catch((err) => {
                console.log(err)
                res.status(400).json('There was an error')
            })
    }
}