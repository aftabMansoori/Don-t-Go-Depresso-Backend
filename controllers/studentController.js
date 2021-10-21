const bcrypt = require('bcrypt')
const passport = require('passport')

const Student = require('../models/student')
const StudentMails = require('../models/studentMails')

exports.signup = async (req, res) => {
    const { studentClgEmail, studentClgCode, password, confPassword } = req.body
    const studentMail = await StudentMails.findOne({ studentClgEmail })
    if (!studentMail) {
        res.status(400).json({ 'msg': 'Student is not registered' })
    } else {
        let student = await Student.findOne({ studentClgEmail })
        if (student) {
            res.status(401).json('Student already registered')
        } else {
            if (password === confPassword) {
                student = new Student({
                    studentClgEmail, studentClgCode, password
                })
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(password, salt, (err, hash) => {
                        if (err) throw err
                        student.password = hash
                        student
                            .save()
                            .then(() => [
                                res.status(201).json({ 'msg': 'Student registered successfully' })
                            ])
                            .catch((err) => {
                                console.log(err)
                                res.status(400).json({'msg': 'There was an error'})
                            })
                    })
                })
            } else {
                res.status(400).json({ 'msg': 'Password is incorrect' })
            }
        }
    }
}

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
        res.status(200).json({'msg': 'signout Successfully'})
    } catch {
        res.status(401).json({'msg': 'Signing Out failed'})
    }
}