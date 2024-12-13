const express = require("express");
const profileRouter = express.Router();
const User = require("../models/user");
const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validation");

profileRouter.get("/profile/user", userAuth, async(req,res)=>{
    const userEmail = req.body.emailId;

    try{
    const users = await User.find({emailId: userEmail});
    res.send(users);
    }
    catch(err){
        res.status(404).send("Not found");
    }
});

//Update
 profileRouter.patch("/profile/edit", userAuth, async (req,res)=>{

    try{
        if(!validateEditProfileData(req)){
            throw new Error("Invalid Edit Request");
        }
        const loggedInUser = req.user;
        console.log(loggedInUser);
        
         Object.keys(req.body).forEach((key)=>(loggedInUser[key] = req.body[key]));

         await loggedInUser.save(); 
         res.status(200).send("data updated successfully");
    }
    catch(err){
        res.status(404).send("Update Failed" + err.message) ;  
    }
});


module.exports = profileRouter;