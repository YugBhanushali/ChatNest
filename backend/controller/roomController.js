const User = require("../models/user");
const Room = require("../models/Room.js");

exports.getAllRoomsOfUser = async (req, res) => {
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
};

// get user information by userId
exports.getUserInfo = async (req, res) => {
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
};

// get room information by roomId
exports.getRoomInfo = async (req, res) => {
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
};

// to remove a user from a room
exports.removeUserFromRoom = async (req, res) => {
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
};
