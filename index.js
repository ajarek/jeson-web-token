const express = require("express")
const dotenv = require("dotenv")
const jsonwebtoken = require("jsonwebtoken")
const cookieParser = require("cookie-parser")
const mongoose =require('mongoose')


dotenv.config()

const app = express()
mongoose.connect('mongodb://127.0.0.1:27017/mongo-test',()=>{console.log('Connection to mongodb database was successful!🌳');})
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.set('view engine', 'ejs')
app.use(cookieParser())

app.use(require('./routes/users'))
app.use(require('./routes/register'))
app.use(require('./routes/forgot-password'))


app.listen(3000,()=>console.log('backend is up port 3000 🚀'))