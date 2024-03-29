const express = require('express')
const router = express.Router()

// Middlewares
const {verifyAuths} = require('../middlewares/verify.authorisation.js')

// Controllers
const {getUserInfo, registerAdmin, loginAdmin,
        logoutAdmin} = require('../controllers/admin.controller.js')

router.route('/login-admin').post(loginAdmin)
router.route('/register-admin').post(registerAdmin)
router.route('/logout-admin').post(verifyAuths ,logoutAdmin)

router.route('/grant-access').post(()=>{})

router.route('/get-user-info').get(verifyAuths ,getUserInfo)


module.exports = router