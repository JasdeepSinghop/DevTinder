const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
const {validateSignUpData} = require("./utils/validation");
const bcrypt = require("bcrypt");

app.use(express.json());

// --------------------- Signup api ----------------------------------
app.post("/signup", async (req, res) => {
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
   const {firstName,lastName,emailId,password} = req.body;

   const passwordHash = await bcrypt.hash(password,10);
   console.log(passwordHash);

 
   //Creating new instance of User model
  //  const user = new User(req.body); bad way to send data or make new instance 
  // Always send data or make instance by explecitly typing it 
  //  const user = new User(req.body);
   const user = new User({firstName,lastName,emailId,password:passwordHash});

    await user.save();
    res.send("User added sucessfully");
  } catch (err) {
    res.status(400).send("Error : " + err.message);
  }
});

//--------------------- Login Api ------------------------ 

app.post("/login",async(req,res)=>{

  try{

    const {emailId,password} = req.body;

    const user = await User.findOne({emailId:emailId});

    if(!user){
      // throw new Error("EmailId is not present in Db");
      throw new Error("Invalid cradentials");
    }

    const isPasswordValid = await bcrypt.compare(password,user.password);

    if(isPasswordValid){
      res.send("User Login Succesfull!!!!!");
    }else{
      // throw new Error("Password is not valid");
      throw new Error("Invalid cradentials");
    }

  }catch(err){
    res.status(400).send("Error :" + err.message);
  }

})

//--------------------------- Feed get api -/feed -----------------------------
// this api get all the users from the database

app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;

  try {
    const users = await User.find({ emailId: userEmail });
    if (users.length === 0) {
      res.send("User not found");
    } else {
      res.send(users);
    }
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

// -------------------------------- Delete api ----------------------------

app.delete("/user", async (req, res) => {
  const userId = req.body.i;
  try {
    await User.findByIdAndDelete(userId);
    res.send("User deleted succesfully");
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

// ------------------------ Update ---------------------------

app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;

  try {
    const ALLOWED_UPDATES = [
      "photoUrl",
      "about",
      "gender",
      "age",
      "skills",
    ];
    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );
    if (!isUpdateAllowed) {
      throw new Error("Update not allowed");
    }
     if(data?.skills.length > 10){
        throw new Error("Skills can not be more than 10");
     }
    await User.findByIdAndUpdate({ _id: userId }, data, {
      runValidators: true,
    });
    res.send("User Upadated");
  } catch (err) {
    res.status(400).send("Update Failed : " + err.message);
  }
});

//----------- Database Connection ------------

connectDB()
  .then(() => {
    console.log("Database Connected");
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch(() => {
    console.log("Database not connected");
  });
