const userModel = require('../models/userModel')
const vsCardJs = require('vcards-js')
const path = require('path')
const vsCard = vsCardJs()

// Functoin to login/connect a user
const login =async(req ,res)=>{
    try{
        let {email ,password} = req.body

        if(!email || !password){
            return res.status(400).json({error:'Please all the fields are required'})
        }
        console.log(req.body)

        const user = await userModel.findOne({email:email})
        console.log(user )
            if(user == null){
                return res.status(400).json({error:'Not such email existing'})
            }
            else{
                if(user.token){
                    console.log("a user is alreay loged in")
                    return res.status(200).json({error:'User already login'})
                }
                
                if(user.password == password){
                    let token =  await jwt.sign({id:user._id ,email:user.email} ,process.env.JWT_SECRET_KEY)

                    user.token = token;
                    user.save()

                    return res.status(200).json({message:'User connected successfully' ,token:token})
                }
                else{

                    return res.status(400).json({error:'Invalid email or password'})
                }
            }
    }
    catch(e){
        console.log(e)
        return res.status(500).json({error:'Server Error'})
    }
}


// Funcion to register a user into the system
const register=async(req ,res)=>{
    try{
        let {name ,surName ,phone ,region ,email ,password ,confirm} = req.body
        console.log(req.body)

        if(!name || !surName || !phone || !region || !email || !password || !confirm){
            return res.status(400).json({error:"Please all the fields are required"})
        }

        const existing = await userModel.findOne({email:email})
            if(existing != null){
                return res.status(400).json({error:"Email already in use"})
            }

            if(password != confirm){
                return res.status(400).json({error:'Passwords must be identical'})
            }

        const user = new userModel({
            name:name,
            surName:surName,
            region:region,
            phoneNumber:phone,
            email:email,
            password:password
        })
        user.save()
        .then(async (respond) => {
            console.log(respond)
            // Creating an saving the vcf file
            vsCard.firstName = name
            vsCard.lastName = surName
            vsCard.email = email
            vsCard.cellPhone = phone
            vsCard.url = region

            await vsCard.saveToFile(`./vcf cards/${name} ${surName}.vcf`)

            return res.status(200).json({message:"User information save successfully"})
        })
        .catch(e => {
            console.log(e)
            return res.status(400).json({error:"Problem encountered while saving"})
        })

    }
    catch(e){
        console.log(e)
        return res.status(500).json({error:"Server error."})
    }
}


// Function to disconnect a user from its current session
const logout=async(req ,res)=>{
    try{
        let {id} = req.body
        const user = userModel.findById({_id:id})
        .then(async (respond) => {
            respond.token = ''
            await respond.save()
            return res.status(200).json({message:'logout successful'})
        })
        .catch(e => {
            console.log(e)
            return res.status(500).json({error:'Prblem encoutered while loging out'})
        })

    }
    catch(e){
        console.log(e)
        return res.status(500).json({error:'Server error'})
    }
}
module.exports = {register ,login ,logout}