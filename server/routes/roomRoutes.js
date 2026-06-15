const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  createRoom,
  getMyRooms,
  updateCode,
  getRoom,
  updateLanguage,
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

router.put(
  "/code",
  protect,
  updateCode
);

router.get(
  "/:roomId",
  protect,
  getRoom
);

router.put(
  "/language",
  protect,
  updateLanguage
);

module.exports = router;

