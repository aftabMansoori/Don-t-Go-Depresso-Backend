const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

// Load User model
const College = require('../models/college')
const Student = require('../models/student')

module.exports = function(passport) {
  passport.use(
    'college',
    new LocalStrategy({ usernameField: 'collegeCode'}, (collegeCode, password, done) => {
      College.findOne({
        collegeCode: collegeCode
      }).then(college => {
        if (!college) {
          return done(null, false) //{ message: 'College is not registered' }
        }
        bcrypt.compare(password, college.password, (err, isMatch) => {
          if (err) throw err
          if (isMatch) {
            return done(null, college)  
          } else {
            return done(null, false) //{ message : 'Password incorrect' }
          }
        })
      })
    })
  )

  passport.use(
    'student', 
    new LocalStrategy({ usernameField: 'studentClgEmail' }, (studentClgEmail, password, done) => {
      Student.findOne({ 
        studentClgEmail
      }).then(student => {
        if (!student) {
          return done(null, false)
        }
        bcrypt.compare(password, student.password, (err, isMatch) => {
          if (err) throw err
          if (isMatch) return done(null, student)
          else return done(null, false)
        })
      })
    })
  )

  passport.serializeUser(function(user, done) {
    done(null, { id: user.id, role: user.role })
  })

  passport.deserializeUser(function(obj, done) {
    switch (obj.role) {
      case 'student':
          Student.findById(obj.id)
              .then(student => {
                  if (student) {
                      done(null, student);
                  }
                  else {
                      done(new Error('student id not found:' + obj.id, null));
                  }
              });
          break;
      case 'college':
          College.findById(obj.id)
              .then(college => {
                  if (college) {
                      done(null, college);
                  } else {
                      done(new Error('college id not found:' + obj.id, null));
                  }
              });
          break;
      default:
          done(new Error('no entity role:'+ obj.role), null);
          break;
    }
  })
}
