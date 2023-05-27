const { workerData, parentPort } = require("worker_threads");
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use(express.static(__dirname));

io.on("connection", (socket) => {
  socket.on("chat message", (msg) => {
    io.emit("chat message", msg);
  });
});

app.get("/", (req, res) => {
  //   res.send("<h1>"+workerData.port+"</h1>");
  res.sendFile(__dirname + "/index.html");
});

server.listen(workerData.port, () => {
  console.log("listening on *:" + workerData.port);
});

parentPort.postMessage("Done");
