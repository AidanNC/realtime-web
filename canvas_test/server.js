const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use(express.static(__dirname));

io.on("connection", (socket) => {
  socket.on("player update", (msg) => {
    socket.broadcast.emit("player update", msg);
  });
});

app.get("/", (req, res) => {
  //   res.send("<h1>"+workerData.port+"</h1>");
  res.sendFile(__dirname + "/index.html");
});

server.listen(3000, () => {
  console.log("listening on *:" + 3000);
});