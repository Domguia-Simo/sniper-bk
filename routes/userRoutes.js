const express = require('express')
const router = express.Router()
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const email = req.query.email??'';
        cb(null, 'Profile Pictures/'+email);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });


// Controllers
const { register, login, logout, modify, verifyAuth, uploadAvatar, downloadAvatar} = require('../controllers/user.controller.js')

router.route('/register').post(register)
router.route('/login').post(login)
router.route('/logout').post(logout)
router.route('/update').post(verifyAuth, modify)


router.route('/download-avatar').get(verifyAuth, downloadAvatar)
router.route('/upload-avatar').post(verifyAuth, upload.single('file'), uploadAvatar)

module.exports = router