const bcrypt = require('bcrypt')
const passport = require('passport')

const College = require('../models/college')
const StudentMails = require('../models/studentMails')

exports.signup = async (req, res) => {
    const { collegeCode, collegeName, password, confPassword, collegePhoneNo, collegeAddress, collegeLocation } = req.body
    let college = await College.findOne({ collegeCode })
    if (college) {
        res.status(400).json(collegeName+" already registered")
    } else {
        if (password === confPassword) {
            college = new College({
                collegeCode, collegeName, password, collegePhoneNo, collegeAddress, collegeLocation
            })
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(password, salt, (err, hash) => {
                    if (err) throw err 
                    college.password = hash
                    college
                        .save()
                        .then(() => {
                            res.status(201).json(collegeName+' registered successfully')
                            // console.log(college)
                        })
                        .catch((err) => {
                            console.log(err)
                            res.status(400).json({'msg': 'There was an error'})
                        })
                })
            })
        } else {
            res.status(400).json({'msg': 'Password is incorrect'})
        }
    }
}

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
        res.status(200).json({'msg': 'signout Successfully'})
    } catch {
        res.status(401).json({'msg': 'Signing Out failed'})
    }
}

exports.studentMails = async (req, res) => {
    let { studentMail } = req.body
    let mail = await StudentMails.findOne({ studentMail })
    if (mail) {
        res.status(400).json({ 'msg': 'Mail already exists' })
    } else {
        mail = new StudentMails({ studentMail, studentClg: req.user.collegeName })
        mail.save()
          .then(async () => {
              let college = await College.findOne({ collegeCode: req.user.collegeCode })
              college.studentMails.push(mail)
              college.save()
              res.status(201).json({ 'msg': 'Student email saved' })
          })
          .catch((err) => {
              res.status(400).json({ 'msg': 'There was an error saving the email' })
              console.log(err)
          })
    }
}

exports.getMails = async (req, res) => {
    College.find({ collegeCode: req.user.collegeCode })
        .populate('studentMails','studentMail')
        .exec((err, college) => {
            if (err) throw err
            res.json(college[0].studentMails)
        })
}