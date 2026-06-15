import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import { useMemo } from "react";
import { debounce } from "lodash";

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

const saveCode = useMemo(
  () =>
    debounce(
      async (
        roomId: string,
        code: string
      ) => {
        try {
          await api.put(
            "/rooms/code",
            {
              roomId,
              code,
            }
          );
        } catch (error) {
          console.error(error);
        }
      },
      1000
    ),
  []
);

const [language, setLanguage] =
  useState("javascript");

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

  
  if (roomId) {
  saveCode(
    roomId,
    newCode
  );
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
    setLanguage(
      response.data.room.language ||
      "javascript"
    );
    
  } catch (error) {
    console.error(error);
  }
};

useEffect(() => {
  return () => {
    saveCode.cancel();
  };
}, [saveCode]);

return (
  <div>
    <div
      style={{
        padding: "10px",
        borderBottom: "1px solid #ccc",
      }}
    >
      Room: {roomId}
    </div>

    <div style={{ padding: "10px" }}>
      <select
        value={language}
        onChange={async (e) => {
          const selectedLanguage =
            e.target.value;

          setLanguage(selectedLanguage);

          try {
            await api.put(
              "/rooms/language",
              {
                roomId,
                language:
                  selectedLanguage,
              }
            );
          } catch (error) {
            console.error(error);
          }
        }}
      >
        <option value="javascript">
          JavaScript
        </option>

        <option value="python">
          Python
        </option>

        <option value="java">
          Java
        </option>

        <option value="cpp">
          C++
        </option>

        <option value="c">
          C
        </option>

        <option value="go">
          Go
        </option>
      </select>
    </div>

    <CodeEditor
      code={code}
      setCode={handleCodeChange}
      language={language}
    />
  </div>
);
}

export default InterviewRoom;