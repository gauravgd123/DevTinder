const express = require("express");

const app = express();

app.listen(3000);
 
console.log("server is ready to use"); 

//Authentication for Sending Data

app.use("/admin",(req,res,next)=>{
    const token = "xyz";
    const isAdminAuthorized = token === "xyz" ;
    if(!isAdminAuthorized){
        res.status(402).send("Unathorized User");
    }
        console.log("Authorization is done");  
        next();
});

app.get("/admin/sent",(req,res,next)=>{
    res.send("Data Sent Successfully");
    next();
});

app.get("/admin/delete",(req,res,next)=>{
    res.send("Data deleted succesfully");
});
