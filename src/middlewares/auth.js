const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async(req,res,next)=>{
    
    try{

        // Read the token from the req cookies
        // const cookies = req.cookies;
        // const {token} = cookies;
        // or

        const {token} = req.cookies;
        if(!token){
            // throw new Error("Token is not valid");
            return res.status(401).send("Please Login");
        }

        // Validate the token
        // const decodedObj = await jwt.verify(token,"DEV@Tinder$790");
        const decodedObj = await jwt.verify(token,process.env.JWT_SECRET);
        const {_id} = decodedObj;
    
        // Find the user
        const user = await User.findById(_id);
        if(!user){
            throw new Error("User not found");
        }

        req.user = user;
        next();
    }catch(err){
        res.status(400).send("Error :" + err.message);
      }
}

module.exports = {
    userAuth
}

// Extra code for just understanding

// const adminAuth = (req,res,next) => {
//     console.log("Admin auth is running");
//     const token = "abhh";
//     const isauth = token === "abhh";
//     if(!isauth){
//         res.status(401).send("Unauthorised access");
//     }else{
//         next();
//     }
// }

// const userAuth = (req,res,next) => {
//     console.log("User auth is running");
//     const token = "abhh";
//     const isauth = token === "abhh";
//     if(!isauth){
//         res.status(401).send("Unauthorised access");
//     }else{
//         next();
//     }
// }

// module.exports = {
//     adminAuth,
//     userAuth,
// }