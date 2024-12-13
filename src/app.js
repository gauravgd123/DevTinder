const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
const cookieParser = require("cookie-parser");

const authRouter = require("./routes/authRoute"); 
const profileRouter = require("./routes/profileRoute");
const requestRouter = require("./routes/requestRoute");
const userRouter = require("./routes/userRoute");

app.use(express.json());   //MiddleWare
app.use(cookieParser());

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);
app.use("/",userRouter);


connectDB()
.then(()=>{
    console.log("Connection Established"); 
    app.listen(7777,()=>{
        console.log("server running on port no 7777"); 
    });
})
.catch((err)=>{
    console.log("Connection failed" + err);
});
 

