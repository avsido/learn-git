const http = require("http");
const fs = require("fs");
const path = require("path");
const socketIo = require("socket.io");

// Path to the client directory
const clientPath = path.join(__dirname, "../client");

// Create a basic HTTP server
const server = http.createServer((req, res) => {
  // Serve the HTML file
  fs.readFile(path.join(clientPath, "index.html"), (err, data) => {
    if (err) {
      res.writeHead(500);
      return res.end("Error loading index.html");
    }

    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(data);
  });
});

const io = socketIo(server);

io.on("connection", (socket) => {
  console.log("a user connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("user disconnected:", socket.id);
  });

  socket.on("chat message", (msg) => {
    console.log("message: " + msg);

    io.emit("chat message", msg, socket.id); // Broadcast the message to all clients with sender's ID
  });
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
