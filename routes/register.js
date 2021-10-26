const  User  = require("../models/User");
const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();

router.post("/register", async (req, res) => {
    try {
       

        const user = new User(req.body);

        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        user.password = await bcrypt.hash(user.password, salt);
        await user.save();

        res.send(user);
    } catch (error) {
        console.log(error);
        res.send("An error occured");
    }
});


module.exports = router;