const jwt = require('jsonwebtoken')
const adminModel = require('../models/adminModel')

const verifyAuths=async(req ,res ,next)=>{
    try{
        let token 
        token = req.headers.authorization.split(' ')[1]
        if(token == undefined || !token){
            return res.status(400).json({error:'Access denied'})
        }
        else{
            const admin = await adminModel.findOne({token:token})
                if(admin == null){
                    return res.status(400).json({error:'Invalid token'})
                }else{
                    next()
                }
        }
    }
    catch(e){
        console.log(e)
        return res.status(500).json({error:'Server error'})
    }
}

module.exports ={verifyAuths}


