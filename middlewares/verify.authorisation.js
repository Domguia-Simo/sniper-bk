const jwt = require('jsonwebtoken')

const verifyAuths=async(req ,res ,next)=>{
    try{
        console.log(req.headers)
        return res.send("Blocked")
        // next()
    }
    catch(e){

    }
}

module.exports ={verifyAuths}


