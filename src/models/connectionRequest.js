const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      //! reference to the User collection
      ref:"User",
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref:"User",
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["ignored", "interested", "accepted", "rejected"],
        message: `{VALUE} is incorrect status type`,
      },
    },
  },
  { timestamps: true }
);

//! This pre method is always call before every save 
connectionRequestSchema.pre("save",function (next){
    const connectionRequest = this;

    //! Problem  4 - the user send connect to itself 
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("Cannot send connection request to yourself");
    }
    next();
})

//! Compound index
connectionRequestSchema.index({fromUserId:1 , toUserId:1 });

const ConnectionRequestModel = new mongoose.model(
  "ConnectRequest",
  connectionRequestSchema
);

module.exports = ConnectionRequestModel;
