const userModel = require('../models/userModel')
const vsCardJs = require('vcards-js')
const path = require('path')
const vsCard = vsCardJs()

// Functoin to login/connect a user
const login = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ error: 'Please all the fields are required' })
        }
        console.log(req.body)

        const user = await userModel.findOne({ email: email })
        console.log(user)
        if (user == null) {
            return res.status(400).json({ error: 'Not such email existing' })
        } else {
            if (user.token) {
                console.log("a user is already logged in")
                return res.status(200).json({ error: 'User already login' })
            }

            if (user.password == password) {

                const token = user.createToken()
                user.save()

                const userSend = {
                    name: user.name,
                    region: user.region,
                    phoneNumber: user.phoneNumber,
                    email: user.email,
                }

                return res.status(200).json({ message: 'User connected successfully', token: token, user: userSend})
            }
            else {

                return res.status(400).json({ error: 'Invalid email or password' })
            }
        }
    }
    catch (e) {
        console.log(e)
        return res.status(500).json({ error: 'Server Error' })
    }
}

// Funcion to register a user into the system
const register = async (req, res) => {
    try {
        const { name, phone, region, email, password, confirm } = req.body
        console.log(req.body)

        if (!name || !phone || !region || !email || !password || !confirm) {
            return res.status(400).json({ error: "Please all the fields are required" })
        }

        const existing = await userModel.findOne({ email: email })
        if (existing != null) {
            return res.status(400).json({ error: "Email already in use" })
        }

        if (password != confirm) {
            return res.status(400).json({ error: 'Passwords must be identical' })
        }


        const user = new userModel({
            name: name,
            region: region,
            phoneNumber: phone,
            email: email,
            password: password
        })

        const token = user.createToken()

        await user.save()

        // Creating an saving the vcf file
        vsCard.firstName = name
        vsCard.email = email
        vsCard.cellPhone = phone
        vsCard.url = region

        vsCard.saveToFile(`./vcf cards/${name}.vcf`)

        return res.status(200).json({ message: "User information save successfully", status: true, token })

    }
    catch (e) {
        console.log(e)
        return res.status(500).json({ error: "Server error.", status: false })
    }
}

// Function to disconnect a user from its current session
const logout = async (req, res) => {
    try {
        let { email, token } = req.body
        const user = await userModel.findOne({ email: email })

        user.deleteToken(token)
        await user.save();

        return res.status(200).json({ message: 'logout successful' })

    }
    catch (e) {
        console.log(e)
        return res.status(500).json({ error: 'Prblem encoutered while loging out' })
    }
}


module.exports = { register, login, logout }