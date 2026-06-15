import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";

import socket from "../socket";
import CodeEditor from "../components/CodeEditor";

function InterviewRoom() {
  const { roomId } = useParams();

  const [code, setCode] = useState(
    "// Start coding..."
  );

  useEffect(() => {
    if (!roomId) return;
    loadRoom();

    socket.emit("join-room", roomId);

    socket.on(
      "code-update",
      (incomingCode) => {
        setCode(incomingCode);
      }
    );

    return () => {
      socket.emit("leave-room", roomId);

      socket.off("code-update");
    };
  }, [roomId]);

const handleCodeChange = async (
  newCode: string
) => {
  setCode(newCode);

  socket.emit(
    "code-change",
    {
      roomId,
      code: newCode,
    }
  );

  try {
    await api.put(
      "/rooms/code",
      {
        roomId,
        code: newCode,
      }
    );
  } catch (error) {
    console.error(error);
  }
};

  const loadRoom = async () => {
  try {
    const response =
      await api.get(
        `/rooms/${roomId}`
      );

    setCode(
      response.data.room.currentCode ||
      "// Start coding..."
    );
  } catch (error) {
    console.error(error);
  }
};

  return (
    <div>
      <div
        style={{
          padding: "10px",
          borderBottom:
            "1px solid #ccc",
        }}
      >
        Room: {roomId}
      </div>

      <CodeEditor
        code={code}
        setCode={handleCodeChange}
      />
    </div>
  );
}

export default InterviewRoom;