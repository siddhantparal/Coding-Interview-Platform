const Room = require("../models/Room");
const { v4: uuidv4 } = require("uuid");

exports.createRoom = async (req, res) => {
  try {
    const room = await Room.create({
      roomId: uuidv4(),
      interviewer: req.user.id,
    });

    res.status(201).json({
      success: true,
      room,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

exports.getMyRooms = async (req, res) => {
  try {
    const rooms = await Room.find({
      interviewer: req.user.id,
    });

    res.json({
      success: true,
      count: rooms.length,
      rooms,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

exports.updateCode = async (req, res) => {
  try {
    const { roomId, code } = req.body;

    const room = await Room.findOneAndUpdate(
      { roomId },
      {
        currentCode: code,
      },
      {
        new: true,
      }
    );

    res.json({
      success: true,
      room,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

exports.getRoom = async (req, res) => {
  try {
    const room = await Room.findOne({
      roomId: req.params.roomId,
    });

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    res.json({
      success: true,
      room,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};