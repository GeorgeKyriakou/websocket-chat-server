const express = require("express");
const router = express.Router();
const http = require("http");
const socketIO = require("socket.io");
const presets = require("./presets/messages");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(router);
app.use(cors());
app.options("*", cors());

//Run when a client connects
io.on("connect", (socket) => {
  /** ************* Connect/Disconnect stuff ************* */
  socket.emit(
    "msgFromServer",
    JSON.stringify({ id: socket.id, msg: presets.GREET_USER })
  ); //broadcast to the specific user that has just connected

  socket.broadcast.emit("msgFromServer", {
    id: socket.id,
    msg: presets.USER_CONNECTED,
  }); //broadcast to everyone else

  socket.on("disconnect", () => {
    socket.broadcast.emit("msgFromServer", {
      id: null,
      msg: presets.USER_DISCONNECTED,
    });
  });

  /** ************* Handle messeging stuff ************* */
  socket.on("msgFromUser", ({msg, username}) => {
    io.emit("msgFromServer", { id: socket.id, msg, username }); //broadcast to everyone regardless
  });
});


const PORT = 8080;
server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}` );
});
