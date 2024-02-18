const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const User = require("./models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Room = require("./models/Room");
const bodyParser = require("body-parser");
const cors = require("cors");

function generateRandomString(length) {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  let result = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }

  return result;
}

const jwtSecret = "your-secret-key";

const app = express();

// app.use(bodyParser.urlencoded({ extended: false }))
//mongoDB config
mongoose
  .connect("mongodb://localhost:27017/chatApp", {
    // useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB", err);
  });

app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const httpServer = createServer();
const io = new Server(httpServer, {
  /* options */
  cors: "*",
});

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

app.post("/signup", async (req, res) => {
  try {
    const { username, userId, password, email } = req.body;
    console.log(req.body);
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      username,
      userId,
      password: hashedPassword,
      email,
    });
    await user.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error("Error signing up:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: String(email) });
    console.log(user);
    if (user) {
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (passwordMatch) {
        // Generate JWT token
        const token = jwt.sign({ userId: user.userId }, jwtSecret, {
          expiresIn: "1h",
        });
        res
          .status(200)
          .json({ message: "Login successful", token, user: user });
      } else {
        res.status(401).json({ error: "Invalid credentials" });
      }
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (err) {
    console.error("Error logging in:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

let tokenBlacklist = [];

app.get("/logout", (req, res) => {
  try {
    const { userId } = req.query;

    // Perform any necessary validation or verification of userId and token
    // For example, check if the token is valid and matches the user's token
    // (This validation depends on your authentication mechanism)

    // Clear the session or token, or perform any other necessary logout operations
    // For example, if using JWT, you might invalidate the token

    // Return success response
    res.status(200).json({ message: "User logged out successfully" });
  } catch (err) {
    console.error("Error logging out user:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST endpoint to get all rooms of a user
app.post("/user/rooms", async (req, res) => {
  try {
    const { userId } = req.body;

    // Find the user based on the provided user ID
    const user = await User.findOne({ userId }).populate("rooms");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Extract the rooms array from the user document
    const rooms = user.rooms;

    res.status(200).json({ rooms });
  } catch (err) {
    console.error("Error fetching user's rooms:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Middleware to check if token is blacklisted
const checkTokenBlacklist = (req, res, next) => {
  const { token } = req.headers;
  if (token && tokenBlacklist.includes(token)) {
    return res.status(401).json({ error: "Token revoked" });
  }
  next();
};

// Protected route example
app.get("/protected", checkTokenBlacklist, (req, res) => {
  res.status(200).json({ message: "You are authorized" });
});

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  // console.log(token);

  if (!token) {
    return res.status(401).json({ error: "Token is required" });
  }

  jwt.verify(token, "your-secret-key", (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Invalid token" });
    }
    req.userId = decoded.userId;
    next();
  });
};

// Protected route to check if user is logged in
app.get("/api/check-login", verifyToken, (req, res) => {
  // If the middleware didn't throw an error, the token is valid
  res.json({ loggedIn: true, userId: req.userId });
});

// Route to get user information by userId
app.get("/api/user/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find the user by userId
    const user = await User.findOne({ userId });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Return the user information
    res.status(200).json({ user });
  } catch (err) {
    console.error("Error fetching user information:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Route to get room information by roomId
app.get("/api/room/:roomId", async (req, res) => {
  try {
    const roomId = req.params.roomId;

    // Find the room by roomId
    const room = await Room.findOne({ roomId });

    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    // Return the room information
    res.status(200).json({ room });
  } catch (err) {
    console.error("Error fetching room information:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Route to remove a user from a room
app.delete("/api/room/remove-user/:roomId/:userId", async (req, res) => {
  try {
    const { roomId, userId } = req.params;

    // Find the user by userId
    const user = await User.findOne({ userId });

    // Find the room by roomId
    const room = await Room.findOne({ roomId });

    if (!user || !room) {
      return res.status(404).json({ error: "User or room not found" });
    }

    // Remove the user from the room's users array
    room.users.pull(user._id);
    await room.save();

    // Remove the room from the user's rooms array
    user.rooms.pull(room._id);
    await user.save();

    // Return success response
    res.status(200).json({ message: "User removed from room successfully" });
  } catch (err) {
    console.error("Error removing user from room:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(9001, () => {
  console.log(`Server at 9001`);
});

httpServer.listen(8000, () => {
  console.log(`WS at 8000`);
});
