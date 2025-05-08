const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
//! Variable is created to use in the query to not write the same things again and again
const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills";

//! Get all the pending connection request of loggedIn user
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    //! ref,populate concept is used
    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA);
    // }).populate("fromUserId","firstName lastName");
    // Or
    // }).populate("fromUserId",["firstName","lastName"]);

    if (connectionRequests.length === 0) {
      return res.send("No request");
    }
    res.json({ message: "Data fetched succesfully", connectionRequests });
  } catch (err) {
    res.status(400).send("Error : " + err.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    const data = connectionRequests.map((row) => {
      //! Read this
      //? Why you have attached toString() over here and why you have written this logic

      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });

    res.json({
      message: "Connections fetch succesfully",
      data: data,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    // User should see all the cards
    // 0 - The user should not see his own card.
    // 1 - The user should not see cards of his connections.
    // 2 - The user should not see the cards which he ignored.
    // 3 - The user should not see the cards which he is intrested or sent request.

    const loggedInUser = req.user;

    //! parseInt beacuse this will come in form of string so before use this we have to convert it into int
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    //! data senitize check on limit if user ask like page = 1 and limit  = 100000 it will be a great problem
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    //! Step 1 -  Find all the connection request either I have sent or recived
    //! select method
    const connectionRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    })
      // select method
      .select("fromUserId  toUserId");
    // .populate("fromUserId", "firstName")
    // .populate("toUserId", "firstName");

    //! Step 2 - Find all the unique people which you dont want to show in feed
    //! Set() datastructure is used add the a thing in an array but it will not allow us to add the already added thing again in array
    //! Find all the unique user
    const hideUsersFromFeed = new Set();
    connectionRequests.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString());
    });
    // console.log(hideUsersFromFeed);

    const users = await User.find({
      //! Find all the _id which is not present in array of hideUsersFromFeed and which is also not self
      // _id : {$nin : Array.from(hideUsersFromFeed)}
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $nin: loggedInUser._id } },
      ],
    })
      //! send only nessary data do not send all data like password and everything so we will use select() method
      .select(USER_SAFE_DATA)
      //! skip() and limit() for pagination 
      .skip(skip)
      .limit(limit);
    res.json({ data : users });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = userRouter;
