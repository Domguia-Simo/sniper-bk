const express = require('express')
const router = express.Router()

// Controllers
const { register, login, logout, modify, verifyAuth} = require('../controllers/user.controller.js')

router.route('/register').post(register)
router.route('/login').post(login)
router.route('/logout').post(logout)
router.route('/update').post(verifyAuth, modify)

module.exports = router