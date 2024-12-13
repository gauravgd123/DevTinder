const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");


//sending connection request.
requestRouter.post("/request/send/:status/:toUserId",userAuth, async (req,res)=>{
    try{
        const fromUserId = req.user;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const allowedStatus = [ "interested", "ignored" ];
        if(!allowedStatus.includes( status )){
            return res
            .status(400)
            .json({
                message: status + " Status is Invalid"  },
            )
        }

        const user = await User.findById( toUserId ); 
        if(!user){
            return res.status(400)
            .json({
                message: " User is not present ",
            })
        }


        //checking if this request is already present
        const existingConnectionRequest = await ConnectionRequest.findOne({  
            $or: [
                {fromUserId, toUserId},
                {fromUserId: toUserId, toUserId: fromUserId },
            ],
        });

        if(existingConnectionRequest){
            return res
            .status(400)
            .send({
                message:" A request is already sent once ",
            })
        }

        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status,
        });

        const data = await connectionRequest.save();

        res.json({
            message: " Connection request sent",
            data,
        });

    }
    catch(err){
        res.status(400).send( "Error" + err.message );
    }
});


requestRouter.post("/request/review/:status/:requestId", userAuth, async(req,res)=>{
   try{ 
    const loggedInUser = req.user;
    if(!loggedInUser){
        res.status(400).send("invalid User");
    }

    const allowedStatus = [ "accepted", "rejected" ];
    const status = req.params.status;
    const requestId = req.params.requestId;

    if(!allowedStatus.includes(status)){
        return res.status(400).json({
            message: "This is a Invalid status request",
        })
    };


    const connectionRequest = await ConnectionRequest.findOne({
        fromUserId: requestId,
        status: "interested",
        toUserId: loggedInUser._id
    });

    if(!connectionRequest){
        return res.status(404)
        .json({
            message : "Connection request is not present",
        })
    };

    connectionRequest.status = status;
    const data = await connectionRequest.save();

    res.json({
        message: "Connection request is " + status,
        data,
    });
    
}
catch(err){
    res.status(404).send(" ERROR" + err.message);
};

})

module.exports = requestRouter;
