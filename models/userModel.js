const mongoose = require('mongoose')
const {Schema} = require('mongoose')

const user = new Schema({
    name:{type:String ,require:true},
    surName:{type:String ,require:true},
    region:{type:String ,require:true},
    phoneNumber:{type:Number ,require:true},
    email:{type:String ,require:true},
    password:{type:String ,require:true},
    token:{type:String}
})

const userModel = mongoose.model('user' ,user)

module.exports = userModel