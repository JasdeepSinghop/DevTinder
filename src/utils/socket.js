const socket = require("socket.io");

const initializeSocket = (server) => {
  //! Configuring socket
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  io.on("connection", (socket) => {
    // Handle events
    socket.on("joinChat",({firstName,userId,targetUserId}) =>{

      // const room = "uniqueId";
      const roomId = [userId,targetUserId].sort().join("_");
      console.log(firstName+" joined room : "+ roomId);
      socket.join(roomId);

    });

    socket.on("sendMessage",({
      firstName,userId,targetUserId,text
    }) =>{
      const roomId = [userId,targetUserId].sort().join("_");
      console.log(firstName+" "+text);
        io.to(roomId).emit("messageReceived",{firstName,text});
    });

    socket.on("disconnect",() =>{
        
    });

  });
};

module.exports = initializeSocket;