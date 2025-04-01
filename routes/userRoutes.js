const express = require('express');
const router = express.Router();
const {Users} = require('../models/models');
const authenticate = require('../middlewares/auth');
const jwt = require('jsonwebtoken');

router.post(`/signUp`, async (req, res) => {
    const {email, password} = req.body;
    if(!email || !password){
        return res.json({sucess: false, message: "Please provide email & password!"});
    }
    const user = await Users.findOne({email});
    if(user){
        return res.json({sucess: false, message: "User already exits! Please login."})
    }
    const newUser = new Users({
        email,
        password,
    })
    try {
        await newUser.save();
        const token = jwt.sign({id:newUser._id}, process.env.TOKEN_SECRET, {expiresIn: "10m"});
        res.cookie('sessionId', token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        })
        return res.json({sucess: true, message: "User added succesfully!"});
    } catch (error) {
        console.error("Error adding new user!", error);
        res.json({sucess: false, message: "Error adding new user!"});
    }
})

router.post(`/signIn`, async (req, res) => {
    const {email, password} = req.body;
    if(!email || !password){
        return res.json({sucess: false, message: "Please provide email & password!"});
    }
    const user = await Users.findOne({email,password});
    if(!user){
        return res.json({sucess: false, message: "Incorrect Email or Password!"})
    }
    try {
        const token = jwt.sign({id:user._id}, process.env.TOKEN_SECRET, {expiresIn: "10m"});
        res.cookie('sessionId', token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        })
        return res.json({sucess: true, message: "Login Successful!"});
    } catch (error) {
        console.error("Error adding new user!", error);
        res.json({sucess: false, message: "Error adding new user!"});
    }
})

router.get(`/data`, authenticate, async(req,res) => {
    const id = req.user._id;
    try {
        const user = await Users.findOne({_id:id});
        if(!user)
            return res.json({sucess: false, message:"Error finding user!"});
        return res.json({sucess: true, email: user.email});
    } catch (error) {
        console.error(error);
        return res.json({sucess: false, message: "Internal Server error!"});
    }
})

module.exports = router;