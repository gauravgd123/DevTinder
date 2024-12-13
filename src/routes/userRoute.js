const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const { set } = require("mongoose");



//Recieved connection requests

userRouter.get("/user/requests/recieved", userAuth, async(req,res)=>{
    try{
        const loggedInUser = req.user;

        const connectionRequests = await ConnectionRequest.find({
            toUserID : loggedInUser._id,
            status: "interested",
        }).populate("fromUserId", ['firstName, lastName']);

        res.json({
            message:"User fetched succcessfully",
            data: connectionRequests,
        
        });
    }
    catch(err){
        res.status(404).send(err.message);
    }
});

//fetch connected users

userRouter.get("/user/requests/recieved", userAuth, async(req,res)=>{
    
    try{
        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequest.find({
            $or: [
                { toUserId: loggedInUser._id, status: "accepted" },
                { fromUserId: loggedInUser._id, status: "accepted" },
            ]
        }).populate("fromUserId","firstName, lastName");

        const data = connectionRequests.map((row) => row.fromUserId);

        res.send(data);
    }
    catch(err){
        res.status(400).send(err.message);
    };
});

//User Feed

userRouter.get("/feed", userAuth, async(req,res)=>{
    try{
    const loggedInUser = req.user;
    
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit)|| 10;
    limit = limit>50? 50: limit;

    const skip = (page-1)*2;

    const connectionRequests = await ConnectionRequest.find({
        $or: [
            {fromUserId : loggedInUser._id},{toUserId : loggedInUser._id }
        ]
    }).select(" fromUserId  toUserId ");
    res.send(connectionRequests);


    const hideUsersFromFeed = new Set();
    connectionRequests.forEach((req) =>{
        hideUsersFromFeed.add(req.fromUserId.toString());
        hideUsersFromFeed.add(req.toUserId.toString());
    });

    const users = await ConnectionRequest.find({
        $and: [
            { _id: {$nin: Array.from(hideUsersFromFeed) } },
            { _id: {$ne: loggedInUser._id } }
        ]
    }).skip(skip).limit(limit);

    console.log(hideUsersFromFeed);

}
catch(err){
    res.status(400).send("Invalid Request"+ err.message);
}
});


module.exports = userRouter;

