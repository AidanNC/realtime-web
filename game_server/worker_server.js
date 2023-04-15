const { workerData, parentPort } = require("worker_threads");
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);

app.get("/", (req, res) => {
  res.send("<h1>"+workerData.port+"</h1>");
});

server.listen(workerData.port, () => {
  console.log("listening on *:"+workerData.port);
});

parentPort.postMessage("Done");
