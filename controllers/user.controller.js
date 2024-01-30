const userModel = require('../models/userModel')
const vsCardJs = require('vcards-js')
const fs = require('fs')
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

                const token = await user.createToken()
                // user.save()
                console.log(token)
                const userSend = {
                    id: user.id,
                    name: user.name,
                    region: user.region,
                    phoneNumber: user.phoneNumber,
                    email: user.email,
                    code: user.referralCode,
                    balance: user.balance ?? 0
                }

                return res.status(200).json({ message: 'User connected successfully', token, user: userSend })
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
        const { name, phone, region, email, password, confirm, code } = req.body

        let affiliatorEmail = ''

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

        if (code) {
            const affiliator = await userModel.findByReferralCode(code)
            if (affiliator) {
                affiliatorEmail = affiliator.email
                affiliator.addReferredUser(email)
            }
        }

        const userCode = await userModel.generateUniqueReferralCode()

        const user = new userModel({
            name: name,
            region: region,
            phoneNumber: phone,
            email: email,
            password: password,
            amount: 0,
            affiliator: affiliatorEmail,
            referralCode: userCode,
        })

        const token = await user.createToken()


        await user.save()

        const userSend = {
            id: user.id,
            name: user.name,
            region: user.region,
            phoneNumber: user.phoneNumber,
            email: user.email,
            code: user.referralCode,
            balance: user.balance
        }


        // Creating an saving the vcf file
        vsCard.firstName = name
        vsCard.email = email
        vsCard.cellPhone = phone
        vsCard.url = region

        vsCard.saveToFile(`./vcf cards/${name}.vcf`)

        return res.status(200).json({ message: "User information save successfully", token, user: userSend })

    }
    catch (e) {
        console.log(e)
        return res.status(500).json({ error: "Server error." })
    }
}

// Function to disconnect a user from its current session
const logout = async (req, res) => {
    try {
        let { email, token } = req.body
        const user = await userModel.findOne({ email: email })

        user.deleteToken(token)
        await user.save()

        return res.status(200).json({ message: 'logout successful' })

    }
    catch (e) {
        console.log(e)
        return res.status(500).json({ error: 'Prblem encoutered while loging out' })
    }
}

const modify = async (req, res) => {
    try {
        const { name, phone, region, email, code, id } = req.body

        if (!name || !phone || !region || !email || !code) {
            return res.status(400).json({ error: "Please all the fields are required" })
        }

        await userModel.findAndUpdateById(id, {
            name: name,
            region: region,
            phoneNumber: phone,
            email: email,
            referralCode: code,
        },)

        return res.status(200).json({ message: 'User details successfully modified' })

    } catch (error) {
        console.log(e)
        return res.status(500).json({ error: "Server error." })
    }

}

const verifyAuth = async (req, res, next) => {
    try {

        const token = req.headers.authorization.split(' ')[1]
        const email = req.body.email ?? req.query.email

        if (token == undefined || !token) {
            return res.status(400).json({ error: 'Access denied' })
        }

        const isAuthenticated = await userModel.verifyToken(token, email)

        if (!isAuthenticated) {
            return res.status(400).json({ error: 'Invalid token' })
        }

        return next()

    } catch (error) {
        console.log(e)
        return res.status(500).json({ error: "Server error." })
    }

}

const uploadAvatar = async (req, res) => {
    try {

        const email = req.body.email

        const user = await userModel.findOne({ email: email })

        const uploadedFile = req.file
        console.log('file: ' + req.file)

        if (!uploadedFile) {
            res.status(400).json({ message: 'No file uploaded' })
            return
        }

        console.log('Received file:', uploadedFile.originalname)

        const filePath = `/Profile Pictures/${email}/${uploadedFile.originalname}`

        user.avatar = filePath

        await user.save()

        console.log('File saved at:', filePath)

        res.status(200).json({ message: 'Avatar was uploaded and saved successfully' })


    } catch (error) {
        res.status(500).json({ message: 'Error occured in server' })
        console.log(error)
    }

}

const downloadAvatar = async (req, res) => {
    try {

        const email = req.query.email

        const user = await userModel.findOne({ email: email })

        const avatarPath = user.avatar

        if (avatarPath == null || avatarPath == '') {
            return res.status(400).json({ message: 'No file uploaded' })
        }

        // Get the file descriptor for the avatar file.
        const fd = fs.openSync('.' + avatarPath, 'r')

        // Read the avatar file.
        const data = fs.readFileSync(fd)

        // Close the avatar file.
        fs.closeSync(fd)

        // Set the HTTP response headers.
        res.writeHead(200, { 'Content-Type': 'image/jpeg' }) // Adjust the content type as needed

        // Write the avatar file data to the response body.
        res.end(data)


    } catch (error) {
        res.status(500).json({ message: 'Error occured in server' })
        console.log(error)
    }

}



module.exports = { register, login, logout, modify, verifyAuth, uploadAvatar, downloadAvatar }