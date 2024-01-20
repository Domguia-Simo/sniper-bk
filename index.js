const express = require('express')
const cors = require('cors')
const path = require('path')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const app = express()

// Initial configurations
app.use(cors())
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())

// Mongo DB connection
// const url = 'mongodb://127.0.0.1:27017/sniper'
const url = 'mongodb+srv://domguiasimoulrich:xEQ5LtenPwDA3nPW@cluster0.kj8xdp0.mongodb.net/sniper'
mongoose.connect(url)
.then(con => {
    console.log('DB connection successfull ')
})
.catch(e => {
    console.log('Error with the db connection ' + e)
})

// Routes
const userRoutes = require('./routes/userRoutes.js')
const adminRoutes = require('./routes/admnRoutes.js')

// Serving staic files
app.use('/documentation',express.static(path.join(__dirname ,'documentation') )) //documentation

app.get('/',(req ,res)=>{
    res.send("Welcome to snipper business center backend")
})

app.use('/api/user' ,userRoutes)
app.use('/api/admin' ,adminRoutes)


app.get('*',(req ,res)=>{
    res.send("Not Found")
})

app.listen(5000,()=>{
    console.log("Server running on localhost port 5000")
})