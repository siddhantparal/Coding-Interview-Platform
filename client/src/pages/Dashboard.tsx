import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import api from "../api";

function Dashboard() {
  const navigate = useNavigate();

  const [rooms, setRooms] = useState<any[]>([]);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const response =
        await api.get("/rooms/my-rooms");

      setRooms(response.data.rooms);
    } catch (error) {
      console.error(error);
    }
  };

  const createRoom = async () => {
    try {
      const response =
        await api.post(
          "/rooms/create"
        );

      const roomId =
        response.data.room.roomId;

      navigate(
        `/interview/${roomId}`
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      style={{
        padding: "20px",
      }}
    >
      <h1>
        Interview Dashboard
      </h1>

      <button
        onClick={createRoom}
      >
        Create Room
      </button>

      <hr />

      <h2>My Rooms</h2>

      {rooms.map((room) => (
        <div
          key={room._id}
          style={{
            marginBottom: "10px",
          }}
        >
          <Link
            to={`/interview/${room.roomId}`}
          >
            {room.roomId}
          </Link>
        </div>
      ))}
    </div>
  );
}

export default Dashboard;