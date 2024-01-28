const mongoose = require('mongoose')
const { Schema } = require('mongoose')
const jwt = require('jsonwebtoken');

const user = new Schema({
    name: { type: String, require: true },
    region: { type: String, require: true },
    phoneNumber: { type: Number, require: true },
    email: { type: String, require: true, unique: true },
    password: { type: String, require: true },
    token: { type: String }
})

user.methods.deleteToken = function (token) {
    // I will add a multi-session logic so don't change anything here for now
    user.token = '';
}

user.methods.createToken = function () {
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET_KEY)
    user.token = token
    return token
}

user.methods.verifyToken = function (token) {

    let error
    let jwtuser

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
        if (err) {
            error = err
            return
        }
        jwtuser = user
    });

    return { error, jwtuser }
}


const userModel = mongoose.model('user', user)

module.exports = userModel