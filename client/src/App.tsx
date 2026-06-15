import { useEffect, useState } from "react";
import socket from "./socket";

function App() {
  const roomId = "test-room";

  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    socket.on("connect", () => {
      socket.emit("join-room", roomId);
    });

    socket.on(
      "receive-message",
      (data) => {
        setMessages((prev) => [
          ...prev,
          data,
        ]);
      }
    );

    return () => {
      socket.off("receive-message");
    };
  }, []);

  const sendMessage = () => {
    if (!message.trim()) return;

    socket.emit(
      "send-message",
      {
        roomId,
        message,
      }
    );

    setMessage("");
  };

  return (
    <div
      style={{
        padding: "30px",
      }}
    >
      <h1>Interview Chat</h1>

      <input
        value={message}
        onChange={(e) =>
          setMessage(e.target.value)
        }
        placeholder="Type message..."
      />

      <button onClick={sendMessage}>
        Send
      </button>

      <hr />

      {messages.map(
        (msg, index) => (
          <div key={index}>
            <strong>
              {msg.socketId}
            </strong>

            : {msg.message}
          </div>
        )
      )}
    </div>
  );
}

export default App;