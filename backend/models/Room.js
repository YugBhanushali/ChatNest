// models/Room.js
const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  roomId: { type: String, required: true },
  roomImg: { type: String },
  messages: [
    {
      userId: { type: String, required: true },
      userName: { type: String, required: true },
      message: { type: String, required: true },
      createdAt: { type: Date, default: Date.now },
    },
  ],
});

const Room = mongoose.model("Room", roomSchema);

module.exports = Room;
