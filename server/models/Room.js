const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    roomId: {
      type: String,
      required: true,
      unique: true,
    },

    interviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    language: {
      type: String,
      default: "javascript",
    },

    currentCode: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Room", roomSchema);