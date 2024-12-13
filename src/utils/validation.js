const validator = require("validator");

const validateSignUpData = (req)=>{
    const {firstName,lastName,emailId,password} =  req.body;

    if(!firstName || !lastName){
        throw new Error("Please enter your data");
    }
    else if(!firstName > 4){
        throw new Error("Less than required length");        
    }
    else if(!validator.isEmail(emailId)){
        throw new Error("Invalid EmailID");
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error("Please enter a strong password");   
    }

}

const validateEditProfileData = (req)=>{
        const allowedEditFields = [
            'firstName',
            'lastName',
            'age',
            'about',
        ];
    
        const isupdateAllowed = Object.keys(req.body).every(field =>
        allowedEditFields.includes(field));

        return isupdateAllowed;

}


module.exports = 
{
    validateSignUpData,
    validateEditProfileData
};