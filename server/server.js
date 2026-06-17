const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const testRoutes = require("./routes/testRoutes");
const roomRoutes = require("./routes/roomRoutes");
const executeRoutes = require("./routes/executeRoutes");
const http = require("http");
const { Server } = require("socket.io");


dotenv.config();

console.log("URI START");
console.log(process.env.MONGO_URI);
console.log("URI END");

connectDB();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log(
    "User Connected:",
    socket.id
  );

  socket.on(
    "join-room",
    (roomId) => {
      socket.join(roomId);
    }
  );

  socket.on(
    "leave-room",
    (roomId) => {
      socket.leave(roomId);
    }
  );

  socket.on(
    "send-message",
    ({ roomId, message, sender  }) => {
      io.to(roomId).emit(
        "receive-message",
        {
          message,
          sender,
          timestamp:
          new Date().toLocaleTimeString(),
        }
      );
    }
  );

  socket.on(
    "disconnect",
    () => {
      console.log(
        "User Disconnected:",
        socket.id
      );
    }
  );
});

app.use(cors());

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/execute", executeRoutes);
app.get("/", (req, res) => {
  res.send("Interview Platform API Running");
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

