// @Import EXPRESS
const express = require("express");
const app = express();

// @Import CORS, HTTP and added "app" to HTPP server
const http = require("http").Server(app);
const cors = require("cors");

//Imported and configured SOCKET IO
const socketIO = require("socket.io")(http, {
  cors: {
    origin: "http://localhost:3000",
  },
});

let users = [];

socketIO.on("connection", (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);

  //sends the message to all the users on the server
  socket.on("message", (data) => {
    socketIO.emit("messageResponse", data);
  });

  // typing event

  socket.on("typing", (data) => socket.broadcast.emit("typingResponse", data));

  //Listens when a new user joins the server
  socket.on("newUser", (data) => {
    //Adds the new user to the list of users
    users.push(data);
    // console.log(users);
    //Sends the list of users to the client
    socketIO.emit("newUserResponse", users);
  });

  socket.on("disconnect", () => {
    console.log("🔥: A user disconnected");

    users.filter((user) => user.sockerID !== socket.id);

    socketIO.emit("newUserResponse", users);
    socket.disconnect();
  });
});

// @PORT
const PORT = 4000;

app.use(cors());

app.get("/api", (req, res) => {
  res.json({
    message: "Hello World!",
  });
});

http.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
