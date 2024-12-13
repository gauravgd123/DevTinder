const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema({
    fromUserId : {
        type : mongoose.Schema.Types.ObjectId,
        required: true,
        ref:"User",
    },
    toUserId : {
        type : mongoose.Schema.Types.ObjectId,
        required: true,

    },
    status: {
        type: String,
        required: true,
        enum: {
            values: ["ignored", "interested", "accepted", "rejected"],
            message: "{VALUE} is not a valid status type",
        },
    },
    
},
{
    timestamps : true,
}
); 

connectionRequestSchema.pre("save", function (next) {  //it is a type of middleware. Used for Schema based validation.
    const connectionRequest = this;
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error(" Cannaot send request to yourself ");
    };
    next();

});

const ConnectionRequestModel = new mongoose.model("ConnectionRequest",connectionRequestSchema);

 module.exports = ConnectionRequestModel;