const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);

const { Worker } = require("worker_threads");

function createWorker(port) {
  return new Promise(function (resolve, reject) {
    const worker = new Worker("./worker_server.js", {
      workerData: { port: port },
    });
    worker.on("message", (data) => {
      resolve(data);
    });
    worker.on("error", (msg) => {
      reject(`An error ocurred: ${msg}`);
    });
  });
}

// app.get("/test", async (req, res) => {
//   const workerPromises = [];
//   for (let i = 0; i < THREAD_COUNT; i++) {
//     workerPromises.push(createWorker(3000+i));
//   }
//   const thread_results = await Promise.all(workerPromises);
//   res.status(200).send("Nothing");
// });

const workerPromises = [];
for (let i = 1; i < 2; i++) {
  workerPromises.push(createWorker(3000 + i));
}

app.get("/", (req, res) => {
  res.send("<h1>Hello world</h1>");
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});
