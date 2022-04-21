module.exports.videoCallSetup = (io) => {
  // io.on("connection", (socket) => {
  //   socket.emit("me", socket.id);

  //   socket.on("disconnect", () => {
  //     socket.broadcast.emit("callEnded");
  //   });

  //   socket.on("callUser", (data) => {
  //     io.to(data.userToCall).emit("callUser", {
  //       signal: data.signalData,
  //       from: data.from,
  //       name: data.name,
  //     });
  //   });

  //   socket.on("answerCall", (data) => {
  //     io.to(data.to).emit("callAccepted", data.signal);
  //   });
  // });
  io.on("connection", function (socket) {
    socket.on("join", function (data) {
      socket.join(data.roomId);
      socket.room = data.roomId;
      const sockets = io.of("/").in().adapter.rooms[data.roomId];
      if (sockets.length === 1) {
        socket.emit("init");
      } else {
        if (sockets.length === 2) {
          io.to(data.roomId).emit("ready");
        } else {
          socket.room = null;
          socket.leave(data.roomId);
          socket.emit("full");
        }
      }
    });
    socket.on("signal", (data) => {
      io.to(data.room).emit("desc", data.desc);
    });
    socket.on("disconnect", () => {
      const roomId = Object.keys(socket.adapter.rooms)[0];
      if (socket.room) {
        io.to(socket.room).emit("disconnected");
      }
    });
  });
};
