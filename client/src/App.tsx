import { useEffect, useState } from "react";
import socket from "./socket";
import CodeEditor from "./components/CodeEditor";

function App() {
  const roomId = "test-room";

  const [code, setCode] = useState(
    "// Start coding..."
  );

  useEffect(() => {
    socket.emit(
      "join-room",
      roomId
    );

    socket.on(
      "code-update",
      (incomingCode) => {
        setCode(incomingCode);
      }
    );

    return () => {
      socket.off("code-update");
    };
  }, []);

  const handleCodeChange = (
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
  };

  return (
    <div>
      <h2
        style={{
          padding: "10px",
        }}
      >
        Collaborative Interview
      </h2>

      <CodeEditor
        code={code}
        setCode={handleCodeChange}
      />
    </div>
  );
}

export default App;