const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName:{
        type : String,
        required:true,
        minLength : 4
    },
    lastName:{
        type : String
    },
    emailId:{
        type : String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true
    },
    password:{
        type : String,
        required:true
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
        default : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZBRuNmLAcG7jeYen4RMtk8QV-rAd823QkgA&s"
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