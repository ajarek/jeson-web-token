const router =require('express').Router()
const jsonwebtoken = require('jsonwebtoken')
const  User  = require("../models/User");
const authenticate = require('../middleware/auth')
const bcrypt = require("bcrypt")

router.get('/forgot-password', (req, res, next) => {
    res.render('forgot-password')
})
router.post('/forgot-password',async (req, res, next) => {
    
    const {email} = req.body 
    const user = await User.findOne({ email: req.body.email });
    
    
    if(!user){
        res.send('User has not been registered!')
       return
    }
    
       
    const token=jsonwebtoken.sign({_id:this._id},process.env.TOKEN_SECRET,{expiresIn:300})
    res.cookie('jsonwebtoken', token, {
		maxAge: 86400000,
		httpOnly: true,
	})
       const link = `http://localhost:3000/reset-password/${user.id}/${token}`
       console.log(link)
       res.send('A link to reset your password has been sent to your e-mail')
})
router.get('/reset-password/:id/:token',authenticate,async (req, res, next) => {
const {id,token} = req.params


const user = await User.findOne({ _id:id });

if(id !== user._id.toString()){
    res.send('Invalid id...')
    return
}


try{

res.render('reset-password',{email:user.email})
}
catch(error){
    console.log(error.message)
    res.send(error.message)
}
})

router.post('/reset-password/:id/:token',async (req, res, next) => {
    const {id,token} = req.params
    const {password,password2} = req.body
    const user = await User.findOne({ _id:id });
    
if(id !== user._id.toString()){
    res.send('Invalid id...')
    return
}


try{
    if(password !== password2){
    res.send('passwords are not the same')
    return
}

    user.password = password
    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();

    res.send(user);
}
catch(error){
    console.log(error.message)
    res.send(error.message)
}
})
module.exports=router