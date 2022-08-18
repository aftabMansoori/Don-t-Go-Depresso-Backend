module.exports.videoCallSetup = (io) => {
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
  // io.on("connection", (socket) => {
  //   console.log(`New User connected: ${socket.id}`);

  //   socket.on("disconnect", () => {
  //     socket.disconnect();
  //     console.log("User disconnected!");
  //   });

  //   socket.on("BE-check-user", ({ roomId, userName }) => {
  //     let error = false;

  //     io.sockets.in(roomId).clients((err, clients) => {
  //       clients.forEach((client) => {
  //         if (socketList[client] == userName) {
  //           error = true;
  //         }
  //       });
  //       socket.emit("FE-error-user-exist", { error });
  //     });
  //   });

  //   /**
  //    * Join Room
  //    */
  //   socket.on("BE-join-room", ({ roomId, userName }) => {
  //     // Socket Join RoomName
  //     socket.join(roomId);
  //     socketList[socket.id] = { userName, video: true, audio: true };

  //     // Set User List
  //     io.sockets.in(roomId).clients((err, clients) => {
  //       try {
  //         const users = [];
  //         clients.forEach((client) => {
  //           // Add User List
  //           users.push({ userId: client, info: socketList[client] });
  //         });
  //         socket.broadcast.to(roomId).emit("FE-user-join", users);
  //         // io.sockets.in(roomId).emit('FE-user-join', users);
  //       } catch (e) {
  //         io.sockets.in(roomId).emit("FE-error-user-exist", { err: true });
  //       }
  //     });
  //   });

  //   socket.on("BE-call-user", ({ userToCall, from, signal }) => {
  //     io.to(userToCall).emit("FE-receive-call", {
  //       signal,
  //       from,
  //       info: socketList[socket.id],
  //     });
  //   });

  //   socket.on("BE-accept-call", ({ signal, to }) => {
  //     io.to(to).emit("FE-call-accepted", {
  //       signal,
  //       answerId: socket.id,
  //     });
  //   });

  //   socket.on("BE-send-message", ({ roomId, msg, sender }) => {
  //     io.sockets.in(roomId).emit("FE-receive-message", { msg, sender });
  //   });

  //   socket.on("BE-leave-room", ({ roomId, leaver }) => {
  //     delete socketList[socket.id];
  //     socket.broadcast
  //       .to(roomId)
  //       .emit("FE-user-leave", { userId: socket.id, userName: [socket.id] });
  //     io.sockets.sockets[socket.id].leave(roomId);
  //   });

  //   socket.on("BE-toggle-camera-audio", ({ roomId, switchTarget }) => {
  //     if (switchTarget === "video") {
  //       socketList[socket.id].video = !socketList[socket.id].video;
  //     } else {
  //       socketList[socket.id].audio = !socketList[socket.id].audio;
  //     }
  //     socket.broadcast
  //       .to(roomId)
  //       .emit("FE-toggle-camera", { userId: socket.id, switchTarget });
  //   });
  // });
};
