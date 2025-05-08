const express = require("express");
const profileRouter = express.Router();
const {userAuth} = require("../middlewares/auth");
const {validateEditProfileData} = require("../utils/validation");

// ------------------- Profile Api ----------

profileRouter.get("/profile/view", userAuth ,async(req,res)=>{

    // try{
    //   const cookies = req.cookies;
  
    //   // Now we will extract the token from the cookie and write the validation logic
    //   const {token} = cookies;
  
    //   if(!token){
    //     throw new Error(" Invalid Token ");
    //   }
  
    //   //Vlidate the token
    //   const decodedMessage = await jwt.verify(token,"DEV@Tinder$790");
    //   // console.log(decodedMessage);
    //   const {_id} = decodedMessage;
    //   console.log("This is loked in user : "+_id);
    
    //   const user = await User.findById(_id);
  
    //   if(!user){
    //     throw new Error("User does not exist");
    //   }
    
    //   res.send(user);
    // }catch(err){
    //   res.status(400).send("Error :" + err.message);
    // }
  
    try{
  
      const user = req.user;
      res.send(user);
  
    }catch(err){
        res.status(400).send("Error :" + err.message);
      }
  
  })

profileRouter.patch("/profile/edit",userAuth, async(req,res)=>{
  try{
    
    if(!validateEditProfileData(req)){
      // return res.status(400).send("Invalid edit request");
      throw new Error("Invalid Edit Request");
    }

    const loggedInUser = req.user;
    // console.log(loggedInUser);
    // loggedInUser.firstName = req.body.firstName;
    // loggedInUser.lastName = req.body.lastName;
    // Or
    // Understand this code 
    Object.keys(req.body).forEach(key => (loggedInUser[key]= req.body[key])); 
    // console.log(loggedInUser);
    // Now we have to save the data in the db
    await loggedInUser.save();

    res.send(`${loggedInUser.firstName} your profile updated succesfully`);

  }catch(err){
    res.status(400).send("Error :" + err.message);
  }
})  

module.exports = profileRouter;