const express = require("express");
const connectDB = require("./config/database");
const app = express();
const cookieParser = require("cookie-parser");
const {userAuth} = require("./middlewares/auth");
const cors = require("cors");

app.use(cors({
  //! Our backend should know from where our frontend is hosted
  origin:"http://localhost:5173",
  credentials:true,
}));
app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);
app.use("/",userRouter);


// ------------------- This api is just for practice and taught how to make api Start ------------------

// //--------------------------- Feed get api -/feed -----------------------------

// app.get("/user", async (req, res) => {
//   const userEmail = req.body.emailId;

//   try {
//     const users = await User.find({ emailId: userEmail });
//     if (users.length === 0) {
//       res.send("User not found");
//     } else {
//       res.send(users);
//     }
//   } catch (err) {
//     res.status(400).send("Something went wrong");
//   }
// });

// // this api get all the users from the database
// app.get("/feed", async (req, res) => {
//   try {
//     const users = await User.find({});
//     res.send(users);
//   } catch (err) {
//     res.status(400).send("Something went wrong");
//   }
// });

// // -------------------------------- Delete api ----------------------------

// app.delete("/user", async (req, res) => {
//   const userId = req.body.i;
//   try {
//     await User.findByIdAndDelete(userId);
//     res.send("User deleted succesfully");
//   } catch (err) {
//     res.status(400).send("Something went wrong");
//   }
// });

// // ------------------------ Update ---------------------------

// app.patch("/user/:userId", async (req, res) => {
//   const userId = req.params?.userId;
//   const data = req.body;

//   try {
//     const ALLOWED_UPDATES = [
//       "photoUrl",
//       "about",
//       "gender",
//       "age",
//       "skills",
//     ];
//     const isUpdateAllowed = Object.keys(data).every((k) =>
//       ALLOWED_UPDATES.includes(k)
//     );
//     if (!isUpdateAllowed) {
//       throw new Error("Update not allowed");
//     }
//      if(data?.skills.length > 10){
//         throw new Error("Skills can not be more than 10");
//      }
//     await User.findByIdAndUpdate({ _id: userId }, data, {
//       runValidators: true,
//     });
//     res.send("User Upadated");
//   } catch (err) {
//     res.status(400).send("Update Failed : " + err.message);
//   }
// });


// ----------------- This api is just for practice and taught how to make api End -----------



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
