const express = require("express");
const authRouter = express.Router();
const { validateSignUpData } = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// --------------------- Signup api ----------
authRouter.post("/signup", async (req, res) => {
  // console.log(req.body);
  //    const userObj = {
  //     firstName : "Jasdeep",
  //     lastName : "Singh",
  //     emailId : "jasdeepsingh@gmail.com",
  //     password : "123456",
  //    }

  //    const user = new User(userObj);

  //or

  // const user = new User({
  //          firstName : "Ms",
  //          lastName : "Dhoni",
  //          emailId : "dhoni@gmail.com",
  //          password : "65789678",
  //         });

  try {
    //Validation of the data
    validateSignUpData(req);

    //Encrypt the password and then store the user into database
    const { firstName, lastName, emailId, password } = req.body;

    const passwordHash = await bcrypt.hash(password, 10);
    console.log(passwordHash);

    //Creating new instance of User model
    //  const user = new User(req.body); bad way to send data or make new instance
    // Always send data or make instance by explecitly typing it
    //  const user = new User(req.body);
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });

    const savedUser = await user.save();
    // This code is added in ui part 5 start
    const token = await savedUser.getJWT();
    res.cookie("token",token,{
      expires: new Date(Date.now() + 8 * 3600000)
    });
    // This code is added in ui part 5 end
    // res.send("User added sucessfully");
    res.json({message: "User added sucessfully",data:savedUser});
  } catch (err) {
    res.status(400).send("Error : " + err.message);
  }
});

// --------------------- Login Api -----------
authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId: emailId });

    if (!user) {
      // throw new Error("EmailId is not present in Db");
      throw new Error("Invalid cradentials");
    }

    // const isPasswordValid = await bcrypt.compare(password,user.password);
    //! Schema helper method from user.js modles
    const isPasswordValid = await user.validatePassword(password);

    if (isPasswordValid) {
      // Create a JWT token

      // const token = await jwt.sign({_id:user._id},"DEV@Tinder$790",{expiresIn:"1d"});
      // console.log(token);
      //! Schema helper method from user.js modles 
      const token = await user.getJWT();

      // Add the token to cookie and send response back
      res.cookie("token", token, {
        expires: new Date(Date.now() + 80 * 9000000),
      });

      res.send(user);
    } else {
      // throw new Error("Password is not valid");
      throw new Error("Invalid cradentials");
    }
  } catch (err) {
    res.status(400).send("Error :" + err.message);
  }
});

// ----------------- Logout Api --------------
authRouter.post("/logout", async (req,res) => {
  res.cookie("token", null, { expires: new Date(Date.now()) });
  res.send("Logout Succesfull");
});

module.exports = authRouter;
