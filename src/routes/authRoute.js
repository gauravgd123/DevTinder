const express = require("express");
const authRouter = express.Router();
const { validateSignUpData } = require("../utils/validation");
const User = require("../models/user");
const  bcrypt  = require("bcrypt");
const jwt = require("jsonwebtoken");


//SignUp 
authRouter.post("/signup",async(req,res)=>{

    try{
        validateSignUpData(req);     //Validation

        const { firstName, lastName, emailId, password } = req.body;

        const passwordHash = await bcrypt.hash(password, 10);  //encrypting the password
        
        const user = new User({
            firstName,
            lastName,
            emailId, 
            password: passwordHash, 
        });
        
        await user.save();
        res.send("data sent succesfully");
    }
    catch(err){
        {
            res.status(400).send( err.message);
        }
}
});

//Login
authRouter.post("/login", async( req, res )=>{
    try{
        const { emailId, password } = req.body;
        console.log(req.body);

        const user = await User.findOne({ emailId: emailId });
        if( !user ){
            throw new Error(" User is not Present ");
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(isPasswordValid){

            const jwtToken = jwt.sign({ _id : user._id }, "thisisacookieeeedsjksdbs",{expiresIn : "1D"});
            console.log("The jwtToken is:" + jwtToken);
            
            res.cookie("token", jwtToken); 
            res.send("Login Successful");
        }
        else{
            throw new Error("Invalid Credentials");
        }
    }
    catch(err){
        res.status(400).send(err.message);
    }
})


//Logout

authRouter.post("/logout", async(req,res)=>{
    res.cookie("token", null, {
        expires: new Date(Date.now())
    });
    res.send("Logged Out successfully");
})

module.exports  = authRouter;
