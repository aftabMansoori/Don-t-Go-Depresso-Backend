const express = require('express')
const router = express.Router()

const studentController = require('../controllers/studentController')

router.get('/', (req, res) => {
    res.json({ 'Status': 'StudentRoute - OK' })
})

router.get('/signout', studentController.signout)

router.post('/signup', studentController.signup)
router.post('/signin', studentController.signin)


module.exports = router