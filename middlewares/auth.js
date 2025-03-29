const jwt = require('jsonwebtoken');
const {Users} = require('../models/models');

const authenticate = async(req, res, next) => {
        const token = req.cookies.sessionId;
        if(!token){
            return res.json({sucess: false, message: "Acess denied! No token provided"});
        } 
        try {
            const verified = jwt.verify(token, process.env.TOKEN_SECRET);
            const user = await Users.findOne({_id: verified.id});
            if(!user){
                return res.json({sucess: false, message: "Invalid credentials! Access Denied."});
            }
            req.user = user;
            next();
        } catch (error) {
            if(error.name === 'TokenExpiredError')
            return res.json({sucess: false, message: "Token Expired! Please login."});
        }
}

module.exports = authenticate;