const express = require('express')
const router = express.Router()

// Controllers
const {register ,login ,logout} = require('../controllers/user.controller.js')

router.route('/register').post(register)
router.route('/login').post(login)
router.route('/logout').post(logout)

module.exports = router