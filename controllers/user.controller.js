const userModel = require('../models/userModel')


const saveUser=async(req ,res)=>{
    try{
        let {name ,surName ,phone ,region ,email} = req.body
        console.log(req.body)

        if(!name || !surName || !phone || !region || !email){
            return res.status(400).json({error:"Please all the fields are required"})
        }

        const existing = await userModel.findOne({email:email})
            if(existing != null){
                return res.status(400).json({error:"Email already in use"})
            }

        const user = new userModel({
            name:name,
            surName:surName,
            region:region,
            phoneNumber:phone,
            email:email
        })
        user.save()
        .then(respond => {
            console.log(respond)
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

module.exports = {saveUser}