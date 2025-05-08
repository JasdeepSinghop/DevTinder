const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

// -> Send Connection Request <-
requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    // const user = req.user;

    // // Sending connection request
    //  console.log("Sending a connection request");
    // res.send("Connection request sent by : "+user.firstName);

    //! This connectio request code is an intern level code beacuse it does not have validations how can you write the expert level code
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      //! Problem 1 - Validations problem is solved
      const allowedStatus = ["ignored", "interested"];
      if (!allowedStatus.includes(status)) {
        //! Always write return if you will not write return the code will move ahead
        return res
          .status(400)
          .json({ message: "Invalid status type " + status });
      }

      //! Problem 2 -  Redundent entries , if their is an existing ConnectionRequest
      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId: fromUserId, toUserId: toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingConnectionRequest) {
        return res
          .status(400)
          .send({ message: "Connection Request Already Existed" });
      }

      //! Problem 3 - check weather the toUserId is present in our db or not
      const toUser = await User.findById(toUserId);
      if (!toUser) {
        res.status(400).json({ message: "User not found exist" });
      }

      //! Problem 4 -  user try to send request to itself is solved by using pre mongoose schema method which come from connectionRequest.js modles file
      //! It is not mandetory to check or write this code from pre method you can check this here also
      //   if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
      //     throw new Error("Cannot send connection request to yourself");
      // }

      // ConnectionRequest is the model we created and imported from ConnectioRequestSchema
      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();
      res.json({
        // message: "Connection Request sent succefully!",
        message:
          req.user.firstName + " is " + status + " in " + toUser.firstName,
        data,
      });
    } catch (err) {
      res.status(400).send("Error : " + err.message);
    }
  }
);

// -> Review Connection Request <=
requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;

      // Validate the status
      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ message: "Status not allowed" });
      }

      // requestId is present in db or not and the sent request user is only accepting the request
      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });

      if (!connectionRequest) {
        return res
          .status(404)
          .json({ message: "Connection request not found" });
      }

      connectionRequest.status = status;

      const data = await connectionRequest.save();

      res.json({ message: "Connection request " + status, data });
    } catch (err) {
      throw new Error("Error : " + err.message);
    }
  }
);

module.exports = requestRouter;
