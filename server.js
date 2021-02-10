const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const cors = require("cors");

const { onIoConnect } = require("./ws-events/fromIO");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);


app.use(cors());
app.options("*", cors());

//Run when a client connects
io.on("connect", (socket) => {
  onIoConnect(socket, io);
});


const PORT = 8080;
server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
