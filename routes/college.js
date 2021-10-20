const express = require('express')
const router = express.Router()

const collegeController = require('../controllers/collegeController')

router.get('/', (req, res) => {
    res.status(200).json({ 'status': 'ok' })
})

router.post('/signup', collegeController.signup)
router.post('/signin', collegeController.signin)
router.get('/signout', collegeController.signout)

module.exports = router