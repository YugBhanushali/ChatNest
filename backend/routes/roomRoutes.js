const express = require("express");
const router = express.Router();
const {
  getAllRoomsOfUser,
  getRoomInfo,
  getUserInfo,
  removeUserFromRoom,
} = require("../controller/roomController");

router.get("/api/user/:userId", getUserInfo);
router.get("/api/room/:roomId", getRoomInfo);
router.post("/user/rooms", getAllRoomsOfUser);
router.delete("/api/room/remove-user/:roomId/:userId", removeUserFromRoom);

module.exports = router;
