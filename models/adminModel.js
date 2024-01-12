const mongoose = require('mongoose')
const {Schema} = require('mongoose')

const admin = new Schema({
    name:{type:String ,require:true},
    surName:{type:String ,require:true},
    email:{type:String ,require:true},
    password:{type:String ,require:true},
    permissions:{type:String},
    accountType:{type:String ,default:'admin'}
})

const adminModel = mongoose.model('admin' ,admin)

module.exports = adminModel