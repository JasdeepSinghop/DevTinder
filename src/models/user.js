const mongoose = require('mongoose');
var validator = require('validator');

const userSchema = new mongoose.Schema({
    firstName:{
        type : String,
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
        validate(value){
            if(!["male","female","others"].includes(value)){
                throw new Error("Gender data is not valid");
            }
        }
    },
    photoUrl:{
        type : String,
        default : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZBRuNmLAcG7jeYen4RMtk8QV-rAd823QkgA&s",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Invalid photo url :" + value);
            }
        }
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

// const userModel = mongoose.model("User",userSchema);

// module.exports = userModel;

module.exports = mongoose.model("User",userSchema);