const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  createRoom,
  getMyRooms,
} = require("../controllers/roomController");

router.post(
  "/create",
  protect,
  createRoom
);

router.get(
  "/my-rooms",
  protect,
  getMyRooms
);

module.exports = router;