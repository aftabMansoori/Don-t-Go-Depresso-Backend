const bcrypt = require('bcrypt')
const passport = require('passport')

const College = require('../models/college')

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
    passport.authenticate('local', {
        successRedirect: '/college',
        failureRedirect: '/college/login',
        failureFlash: true
    })(req, res, next);
    res.json('Login successful')
}

exports.signout = (req, res) => {
    try {
        req.logout()
        res.status(200).json({'msg': 'signout Successfully'})
    } catch {
        res.status(401).json({'msg': 'Signing Out failed'})
    }
}