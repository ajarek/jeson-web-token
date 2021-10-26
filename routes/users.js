
const express = require("express");
const  User  = require("../models/User");
const router = express.Router();
const jsonwebtoken = require("jsonwebtoken");
const authenticate = require('../middleware/auth')
const bcrypt = require("bcrypt");

router.get('/',(req,res)=>{
	res.render('start')
})


router.get('/api/users',authenticate,(req,res)=>{
	
   let Name= req.query.data
   
   
    res.render('home',{data:Name})
})
router.get('/login',(req,res)=>{
 res.render('login')
})

router.post('/login',async(req,res)=>{
    const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(400).send("Invalid email or password");

        const validPassword = await bcrypt.compare(
            req.body.password,
            user.password
        );
        if (!validPassword)
            return res.status(400).send("Invalid email or password");
    const accessToken=jsonwebtoken.sign({_id:this._id},process.env.TOKEN_SECRET,{expiresIn:20})
    const refreshToken=jsonwebtoken.sign({_id:this._id},process.env.REFRESH_TOKEN_SECRET,{expiresIn:525600})
    res.cookie('jsonwebtoken', accessToken, {
		maxAge: 86400000,
		httpOnly: true,
	})
	
	res.redirect('/api/users/?data='+user.name)
	
	
})
router.get('/logout',async(req,res)=>{
	res.cookie('jsonwebtoken','',{maxAge:1})
    res.redirect('/')

})
router.post('/api/auth/refresh', (req, res) => {
	const refreshToken = req.body.token
     
	if (!refreshToken) {
		return res.status(401)
	}

	// TODO: Check if refreshToken exists in DB

	const validToken = jsonwebtoken.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)

	if (!validToken) {
		return res.status(403)
	}

	const accessToken = generateAccessToken({ id: 1 })

	res.send({ accessToken })
})

function generateAccessToken(payload) {
	return jsonwebtoken.sign(payload, process.env.TOKEN_SECRET, { expiresIn: 86400 }) // 86400
}


module.exports = router;