const mongoose = require('mongoose');
var validator = require('validator');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    firstName:{
        type : String,
        // index:true,
        required:true,
        // minLength : 4,
        // maxLength : 50
    },
    lastName:{
        type : String,
        minLength:2,
        maxLength : 50

    },
    emailId:{
        type : String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid email address :" + value);
            }
        }
    },
    password:{
        type : String,
        required:true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Enter strong password :" + value);
            }
        }
    },
    age:{
        type : Number,
        min : 18
    },
    gender:{
        type : String,
        enum : {
            values:["male","female","Male","Female","other"],
            message : `{VALUES} is not a valid gender type`
        }
        // validate(value){
        //     if(!["male","female","others"].includes(value)){
        //         throw new Error("Gender data is not valid");
        //     }
        // }
    },
    photoUrl:{
        type : String,
        default : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZBRuNmLAcG7jeYen4RMtk8QV-rAd823QkgA&s",

        // Help to validate the url of image
        
        // validate(value){
        //     if(!validator.isURL(value)){
        //         throw new Error("Invalid photo url :" + value);
        //     }
        // }
    },
    about:{
        type : String,
        default : "This is the user"
    },
    skills:{
        type : [String]
    }
},{
    timestamps : true
})

//! Schema helper fumctions 
userSchema.methods.getJWT = async function (){
    const user  = this;
    const token =  await jwt.sign({_id:user._id},"DEV@Tinder$790",{expiresIn:"1d"});
    return token;
}

userSchema.methods.validatePassword = async function(passwordInputByUser){
    const user = this;
    const passwordHash = user.password;
    const isPasswordValid = await bcrypt.compare(passwordInputByUser,passwordHash);
    return isPasswordValid;
}

// const userModel = mongoose.model("User",userSchema);

// module.exports = userModel;

module.exports = mongoose.model("User",userSchema);