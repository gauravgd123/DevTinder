const mongoose = require("mongoose");
//const validation = require("validator");

const userSchema = mongoose.Schema({
    firstName :{
        type: String,
        required: true,
        minLength:4,
        maxLength:20,
    },
    lastName :{
        type: String,
    },
    emailId:{
        type: String,
        unique: true,
        required:true,
        lowercase:true,
    
    },
    password:{
        type: String,
        required: true,
    },
    age:{
        type: Number,
        min:18,
    },
    gender:{
        type: String,
        validate(value){
            if(!['Male','Female','Others'].includes(value)){
                throw new Error("Gender data is not valid");
            }
        }
    },
    about:{
        type:String,
        default:"This is the about section",
    }
},{
    timestamps:true,
})

module.exports = mongoose.model("User",userSchema); 