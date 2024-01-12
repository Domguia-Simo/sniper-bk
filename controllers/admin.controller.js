const userModel = require('../models/userModel')
const adminModel = require('../models/adminModel')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv').config()

// Funtions to login an administrator
const loginAdmin =async(req ,res)=>{
    try{
        let {email ,password} = req.body

        if(!email || !password){
            return res.status(400).json({error:'Please all the fields are required'})
        }
        console.log(req.body)

        const admin = await adminModel.findOne({email:email})
        console.log(admin )
            if(admin == null){
                return res.status(400).json({error:'Not such email existing'})
            }
            else{
                if(admin.password == password){
                    let token =  await jwt.sign({id:admin._id ,email:admin.email} ,process.env.JWT_SECRET_KEY)

                    admin.token = token;
                    admin.save()

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

// Functions to register an administrator
const registerAdmin=async(req ,res)=>{
    try{
        console.log(req.body)
        let {name ,surName ,email ,password ,confirm} = req.body

        if(!name || !surName || !password || !confirm || !email){
            return res.status(400).json({error:"Please all the fields are required"})
        }

        const existing = await adminModel.findOne({email:email})
            if(existing != null){
                return res.status(400).json({error:"Email already in use"})
            }

            if(password != confirm){
                return res.status(400).json({error:'Passwords must be identical'})
            }

        // Logic for hashing the passsword 

        const admin = new adminModel({
            name:name,
            surName:surName,
            email:email,
            password:password
        })
        admin.save()
        .then(respond => {
            console.log(respond)
            return res.status(200).json({message:`Admin ${respond.name} Created successfully`})
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


// Function to get all the users informations
const getUserInfo=async(req ,res)=>{
    try{
        userModel.find()
        .then(users => {
            return res.status(200).json({users:users})
        })
        .catch(e => {
            console.log(e)
            return res.status(400).json({message:'Problem encountered while retriving users'})
        })
    }
    catch(e){
        console.log(e)
        return res.status(500).json({error:'Server error'})
    }
}

module.exports = {getUserInfo ,registerAdmin ,loginAdmin}