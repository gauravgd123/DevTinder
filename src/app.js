const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");


app.use(express.json());

app.post("/signup",async(req,res)=>{
    
    const user = new User(req.body);
    await user.save();
    res.send("data sent succesfully");
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
 

