const User = require("../models/user");
const jwt = require("jsonwebtoken");

const userAuth = async (req,res,next)=>{
    try{
    const { token } = req.cookies;
    if(!token){
        throw new Error("Login please(Invalid Token)");
    }
    const decodedMesage = await jwt.verify(token,"thisisacookieeeedsjksdbs");

    const { _id } = decodedMesage;
    const user =  await User.findOne({ _id : _id });
    if(!user){
        throw new Error("User is not present");
    }

    req.user = user;
    next();
    }
    catch(err){
        res.status(400).send(err.message);
    }
}

module.exports = { 
    userAuth,
 };