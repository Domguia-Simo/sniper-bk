const express = require('express')
const router = express.Router()

// Controllers
const {getUserInfo, registerAdmin, loginAdmin} = require('../controllers/admin.controller.js')

router.route('/login-admin').post(loginAdmin)
router.route('/register-admin').post(registerAdmin)

router.route('/grant-access').post(()=>{})

router.route('/get-user-info').get(getUserInfo)


module.exports = router