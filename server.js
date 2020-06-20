const express = require('express');
const bodyParser = require('body-parser');
const socketIO = require('socket.io');
const http = require("http");
const path = require('path');

const DEFAULT_PORT = 3000;

class Server {

  constructor() {
    this.initialize();
  }

  initialize() {
    this.app = express();
    this.httpServer = http.createServer(this.app);
    this.io = socketIO(this.httpServer);
    this.activeSockets = [];

    this.configureApp();
    this.configureRoutes();
    this.handleSocketConnection();
  }

  configureApp() {
    this.app.use(express.static(path.join(__dirname, "./public")));
  }

  configureRoutes() {
    this.app.get("/", (req, res) => {
      res.sendFile("index.html");
    });
  }

  handleSocketConnection() {
    this.io.on("connection", socket => {
      const existingSocket = this.activeSockets.find(
        existingSocket => existingSocket === socket.id
      );

      if (!existingSocket) {
        this.activeSockets.push(socket.id);

        socket.emit("update-user-list", {
          users: this.activeSockets.filter(
            existingSocket => existingSocket !== socket.id
          )
        });

        socket.broadcast.emit("update-user-list", {
          users: [socket.id]
        });
      }

      socket.on("call-user", (data) => {
        socket.to(data.to).emit("call-made", {
          offer: data.offer,
          socket: socket.id
        });
      });

      socket.on("make-answer", data => {
        socket.to(data.to).emit("answer-made", {
          socket: socket.id,
          answer: data.answer
        });
      });

      socket.on("reject-call", data => {
        socket.to(data.from).emit("call-rejected", {
          socket: socket.id
        });
      });

      socket.on("disconnect", () => {
        this.activeSockets = this.activeSockets.filter(
          existingSocket => existingSocket !== socket.id
        );
        socket.broadcast.emit("remove-user", {
          socketId: socket.id
        });
      });
    });
  }

  listen(callback) {
    this.httpServer.listen(DEFAULT_PORT, () => {
      callback(DEFAULT_PORT);
    });
  }
}


const server = new Server();

server.listen(port => {
  console.log("Server is listening on http://localhost:" + port);
});
