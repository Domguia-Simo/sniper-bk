const express = require('express')
const router = express.Router()

// Controllers
const {saveUser} = require('../controllers/user.controller.js')

router.route('/save-user').post(saveUser)

module.exports = router