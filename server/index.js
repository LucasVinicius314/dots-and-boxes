const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require('cors')
const path = require('path');

const port = process.env.PORT || 4001;
// const index = require("./routes");

const app = express();
app.use(cors());
app.use(express.static(path.join(__dirname, 'build')));
// app.use(index);

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

let interval;

io.on("connection", (socket) => {
  console.log("New client connected");
  if (interval) {
    clearInterval(interval);
  }
  getApiAndEmit(socket)
  socket.on("disconnect", () => {
    console.log("Client disconnected");
    clearInterval(interval);
  });
});

const getApiAndEmit = socket => {
  const response = new Date();
  // Emitting a new message. Will be consumed by the client
  socket.emit('call', response);
};

server.listen(port, () => console.log(`Listening on port ${port}`));