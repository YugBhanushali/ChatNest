const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const roomRoutes = require("./routes/roomRoutes");
const http = require("http");
const User = require("./models/User.js");
const Room = require("./models/Room.js");
const { Server } = require("socket.io");
require("dotenv").config();

function generateRandomString(length) {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  let result = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }

  return result;
}

mongoose
  .connect(String(process.env.MONGO_URI), {
    // useNewUrlParser: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB", err);
  });

const app = express();

const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: "*",
});

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", authRoutes);
app.use("/", roomRoutes);

io.on("connection", (socket) => {
  //room will have the id
  //   socket.on("joinRoom", (userData) => {
  //     const { roomId, userId } = userData;
  //     socket.join(String(roomId));
  //     console.log(roomId);
  //     io.to(String(roomId)).emit(
  //       "joined",
  //       `Hey everyone ${userId} joined the room`
  //     );
  //   });
  console.log(socket.id, "---> socket id");
  socket.on("joinRoom", async (userData) => {
    const { roomId, userId } = userData;
    socket.join(String(roomId));

    try {
      // Check if the user exists
      let user = await User.findOne({ userId: String(userId) });
      console.log(user);
      if (!user) {
        // Handle error: User not found
        return;
      }

      // Check if the room exists
      let room = await Room.findOne({ roomId });
      if (!room) {
        // Room doesn't exist, create a new one
        room = new Room({
          roomId,
          roomImg: String(generateRandomString(10)),
          users: [user._id], // Add the user's ObjectId to the new room
          messages: [],
        });
        await room.save();
      } else {
        // Room already exists, add the user to it if not already present
        if (!room.users.includes(user._id)) {
          room.users.push(user._id);
          await room.save();
        }
      }

      if (!user.rooms.includes(room._id)) {
        user.rooms.push(room._id);
        await user.save();
      }

      // Emit a message to all users in the room
      io.to(String(roomId)).emit(
        "joined",
        `Hey everyone ${userId} joined the room and the roomId is ${roomId}`
      );
    } catch (err) {
      console.error("Error joining room:", err);
      // Handle error
    }
  });

  socket.on("addToRoom", (data) => {
    console.log(socket.id, "joined", data);
    socket.join(String(data));
  });

  socket.on("room-message", async (roomMsg) => {
    // const { roomId, userId, userName, message } = roomMsg;
    // io.to(String(roomId)).emit("room-msg", roomMsg);
    // console.log(`Message from ${userId}: ${message},`);
    // socket.emit("test", "sending to socket");
    const { roomId, userId, message } = roomMsg;
    try {
      let user = await User.findOne({ userId: String(userId) });
      let room = await Room.findOne({ roomId });
      console.log(user, room);
      if (room && user) {
        room.messages.push({
          userId: user.userId,
          userName: user.username,
          message: message,
        });
        await room.save();
        io.to(String(roomId)).emit("room-msg", roomMsg);
      }
    } catch (err) {
      console.error("Error sending message:", err);
      // Handle error
    }
  });

  console.log(socket.id);
});

// app.listen(9001, () => {
//   console.log(`Server at 9001`);
// });

httpServer.listen(process.env.PORT || 8000, () => {
  console.log(`WS at 8000`);
});
