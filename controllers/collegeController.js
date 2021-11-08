const bcrypt = require('bcrypt')
const passport = require('passport')

const College = require('../models/college')
const StudentMails = require('../models/studentMails')

const { catchAsync } = require('../Utils/ErrorHandling')
exports.signup = catchAsync(async (req, res) => {
    const { collegeCode, collegeName, password, confPassword, collegePhoneNo, collegeAddress, collegeLocation } = req.body.college
    if (password === confPassword) {
            let college = new College({
                collegeCode, collegeName, password, collegePhoneNo, collegeAddress, collegeLocation
            })
            college.password = await bcrypt.hash(password, parseInt(process.env.Salt));
            const collegeCreated = await college.save();
            res.status(201).json({
                status: "Successful",
                "message": collegeCreated.collegeName + ' registered successfully'
            })
        } else {
            res.status(400).json({
                status: "Error",
                message: 'Password is incorrect'
            })
    }
})

exports.signin = (req, res, next) => {
    passport.authenticate('college', {
        successRedirect: '/college',
        failureRedirect: '/',
        failureFlash: true
    })(req, res, next)
}

exports.signout = (req, res) => {
    try {
        req.logout()
        res.status(200).json({ message: 'signout Successfully' })
    } catch {
        res.status(401).json({ message: 'Signing Out failed' })
    }
}

exports.studentMails = catchAsync(async (req, res) => {
    let { studentMail } = req.body
    let mail = await StudentMails.findOne({ studentMail })
    if (mail) {
        res.status(400).json({
            status: "Error",
            message: 'Mail already exists'
        })
    } else {
        mail = await new StudentMails({ studentMail, studentClg: req.user.collegeName }).save()
        let college = await College.findOne({ collegeCode: req.user.collegeCode })
        college.studentMails.push(mail)
        college.save()
        res.status(201).json({
            status: "Successful",
            message: 'Student email saved'
        })
    }
})

exports.getMails = catchAsync(async (req, res) => {
    let college = await College.find({ collegeCode: req.user.collegeCode })
        .populate('studentMails', 'studentMail')
    res.status(200).json({ 
        status: "Successful",
        mails: college[0].studentMails
     })

})