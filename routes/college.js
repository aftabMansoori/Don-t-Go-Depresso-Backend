const express = require('express')
const router = express.Router()

const collegeController = require('../controllers/collegeController')

router.get('/', (req, res) => {
    res.status(200).json({ 'status': 'ok' })
})

router.get('/signout', collegeController.signout)
router.get('/get-emails', collegeController.getMails)

router.post('/signup', collegeController.signup)
router.post('/signin', collegeController.signin)
router.post('/student-mails', collegeController.studentMails)

module.exports = router