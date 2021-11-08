const bcrypt = require('bcrypt')
const passport = require('passport')

const Student = require('../models/student')
const StudentMails = require('../models/studentMails')
const { catchAsync } = require('../Utils/ErrorHandling')

exports.signup =catchAsync( async (req, res) => {
    const { studentClgEmail, studentClgCode, password, confPassword } = req.body
    const studentMail = await StudentMails.findOne({ studentClgEmail })
    if (!studentMail) {
        res.status(400).json({ message: 'Student is not registered by College' })
    } else {
            if (password === confPassword) {
                student = new Student({
                    studentClgEmail, studentClgCode, password
                })
                student.password = await bcrypt.hash(password, parseInt(process.env.Salt))
                await student.save()
                res.status(201).json({ message: 'Student registered successfully' })
            } else {
                res.status(400).json({ message: 'Password is incorrect' })
            }
        }
})

exports.signin = (req, res, next) => {
    passport.authenticate('student', {
        successRedirect: '/student',
        failureRedirect: '/',
        failureFlash: true
    })(req, res, next)
}

exports.signout = (req, res) => {
    try {
        req.logout()
        res.status(200).json({message: 'signout Successfully'})
    } catch {
        res.status(401).json({message: 'Signing Out failed'})
    }
}

exports.studentProfile = catchAsync(async (req, res) => {
    const { studentName, studentPRN, studentClass, studentPhoneNo, studentAge, aboutStudent } = req.body
    const student = await StudentMails.findOne({ studentMail: req.user.studentClgEmail })
    studentClgName = student.studentClg
    let createdStudent  = await Student.findOneAndUpdate({ studentClgEmail: req.user.studentClgEmail }, {
        studentName, studentPRN, studentClass, studentPhoneNo, studentAge, aboutStudent, studentClgName
    })
    res.json({ 
        status : "Successful",
        message: 'Profile Saved'
    })
})