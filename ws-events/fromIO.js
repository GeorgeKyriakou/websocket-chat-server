const presets = require("../presets/messages");

const rooms = {};

const onIoConnect = (socket, io) => {
  /** ************* Connect/Disconnect stuff ************* */
  socket.emit(
    "msgFromServer",
    JSON.stringify({ id: socket.id, msg: presets.GREET_USER })
  ); //broadcast to the specific user that has just connected

  socket.broadcast.emit("msgFromServer", {
    id: socket.id,
    msg: presets.USER_CONNECTED,
  }); //broadcast to everyone else

  //Update users in room list

  socket.on("joinRoom", (data) => {
    console.log({ data });
    const { room, username, id } = data;
    if (!rooms.hasOwnProperty(room)) {
      rooms[room] = [];
    }
    const usersInRoom = rooms[room];
    if (usersInRoom.findIndex((u) => u.username === username) === -1) {
      usersInRoom.push({ username, id });
    }
    io.emit("updateUsersInRoom", { users: usersInRoom });
  });

  socket.on("leavingRoom", (data) => {
    const { room, username } = data;
    console.log(`${username} is leaving the chat`);
    const usersInRoom = rooms[room].filter((user) => user.username !== username);

    socket.broadcast.emit("updateUsersInRoom", { users: usersInRoom});
    socket.broadcast.emit("msgFromServer", {
      msg: presets.USER_DISCONNECTED,
    });
  });

  /** ************* Handle messeging stuff ************* */
  socket.on("msgFromUser", ({ msg, username }) => {
    io.emit("msgFromServer", { id: socket.id, msg, username }); //broadcast to everyone regardless
  });
};

exports.onIoConnect = onIoConnect;
