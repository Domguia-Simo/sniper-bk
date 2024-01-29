const mongoose = require('mongoose')
const { Schema } = require('mongoose')
const jwt = require('jsonwebtoken');

const user = new Schema({
    name: { type: String, require: true },
    region: { type: String, require: true },
    phoneNumber: { type: Number, require: true },
    email: { type: String, require: true, unique: true },
    password: { type: String, require: true },
    token: { type: String },

    referralCode: { type: String },//the user's referralCode to give others
    referredUsers: [{ type: String }],//only emails of those the user has affiliated
    balance: { type: Number },//the users account balance
    affiliator: { type: String },//the email of the user who affiliated this user
})

user.methods.deleteToken = function (token) {
    // I will add a multi-session logic so don't change anything here for now
    this.token = '';
}

user.methods.createToken = async function () {
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET_KEY)
    this.token = token
    return token
}

user.statics.verifyToken = async function (token, email) {
    const userByToken = await this.findOne({ token: token })
    const userByEmail = await this.findOne({ email: email })

    if (userByToken == null || userByEmail == null || userByToken.id != userByEmail.id) {
        return false
    } else {
        return true
    }
}

// Method to find a user by referralCode
user.statics.findByReferralCode = function (referralCode) {
    return this.findOne({ referralCode: referralCode }).exec()
}

// Method to add an email to a user's referredUsers
user.methods.addReferredUser = function (newEmail) {
    // Check if the email is not already in the referredUsers array
    if (!this.referredUsers.includes(newEmail)) {
        this.referredUsers.push(newEmail)
    }
    return this.save() // Save the updated user document
}

// Static method to generate a unique referral code
user.statics.generateUniqueReferralCode = async function () {

    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    const length = 8

    while (true) {
        const code = Array.from({ length }, () => characters.charAt(Math.floor(Math.random() * characters.length))).join('')

        // Check if the generated code already exists in the database
        const existingUser = await this.findOne({ referralCode: code })

        if (!existingUser) {
            return code // Return the code if it's unique
        }
        // If the code already exists, generate a new one and loop again
    }
}

// Method to find and update a user by ID
user.statics.findAndUpdateById = function (userId, updateFields) {
    return this.findByIdAndUpdate(userId, updateFields, { new: true }).exec()
}

const userModel = mongoose.model('user', user)

module.exports = userModel