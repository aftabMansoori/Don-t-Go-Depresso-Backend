const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

// Load User model
const College = require('../models/college')

module.exports = function(passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'collegeCode' }, (collegeCode, password, done) => {
      College.findOne({
        collegeCode: collegeCode
      }).then(college => {
        if (!college) {
          return done(null, false, res.json({ 'msg': 'That email is not registered' }))
        }

        bcrypt.compare(password, college.password, (err, isMatch) => {
          if (err) throw err
          if (isMatch) {
            return done(null, college)
          } else {
            return done(null, false, res.json({ 'msg': 'Password incorrect' }))
          }
        })
      })
    })
  )

  passport.serializeUser(function(college, done) {
    done(null, college.collegeCode)
  })

  passport.deserializeUser(function(collegeCode, done) {
    User.findOne(collegeCode, function(err, college) {
      done(err, college)
    })
  })
}
