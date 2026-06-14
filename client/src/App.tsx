import { useEffect } from "react";
import socket from "./socket";

function App() {
  useEffect(() => {
    socket.on("connect", () => {
      console.log(
        "Connected to Socket Server:",
        socket.id
      );
    });

    return () => {
      socket.off("connect");
    };
  }, []);

  return (
    <div
      style={{
        padding: "40px",
        fontSize: "24px",
      }}
    >
      Collaborative Interview Platform
    </div>
  );
}

export default App;