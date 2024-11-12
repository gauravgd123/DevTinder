const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");


app.use(express.json());   //MiddleWare

//GET user by Email

app.get("/user", async(req,res)=>{
    const userEmail = req.body.emailId;

    try{
    const users = await User.find({emailId: userEmail});
    res.send(users);
    }
    catch(err){
        res.status(404).send("Not found");
    }
});

//Feed API. Feed/get(To get details of all the users).

app.get("/feed",async (req,res)=>{

    try{
        const users = await User.find({});
        res.send(users);
    }
    catch(err){
        res.status(404).send("Not able to respond");
    }
});

//POST Api (user details to database)

app.post("/signup",async(req,res)=>{
    
    try{
    const user = new User(req.body);
    await user.save();
    res.send("data sent succesfully");
    }
    catch(err){
        if (err.code === 11000){
            res.status(404).send("Email already Registered");
        } 
        else{
            res.status(500).send("*check your credentials*");
        }
    }
});

//Delete Api

app.delete("/user",async (req,res)=>{
    const userId = req.body.userId;
    try{
        const user = await User.findByIdAndDelete({ _id: userId});
        res.send(user);
    }
    catch(err){
        res.status(404).send("Not found");
    }
});

//Update
app.patch("/user",async (req,res)=>{
    const userId = req.body.userId;
    const data = req.body;
    try{
    await User.findByIdAndUpdate({ _id: userId },data,{
        returnDocument:"after",
        runValidators:true,
    });
    res.send("data Updated successfully");
    }
    catch(err){
        res.status(404).send("Update Failed" + err.message) ;  
    }
});


connectDB()
.then(()=>{
    console.log("Connection Established"); 
    app.listen(7777,()=>{
        console.log("server running on port no 7777"); 
    });
})
.catch((err)=>{
    console.log("Connection failed");
});
 

