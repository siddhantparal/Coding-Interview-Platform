import { useEffect, useMemo, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { debounce } from "lodash";

import api from "../api";
import socket from "../socket";
import CodeEditor from "../components/CodeEditor";

function InterviewRoom() {
  const { roomId } = useParams();

  const [code, setCode] = useState(
    "// Start coding..."
  );
  const [messages, setMessages] =
  useState<any[]>([]);

  const [messageInput, setMessageInput] =
  useState("");

  const [language, setLanguage] =
    useState("javascript");

  const [output, setOutput] =
    useState("");

  const chatEndRef =
  useRef<HTMLDivElement>(
    null
  );

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

  useEffect(() => {
  chatEndRef.current?.scrollIntoView({
    behavior: "smooth",
  });
}, [messages]);

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
      socket.emit("leave-room", roomId);
      socket.off("code-update");
      socket.off("receive-message");
      saveCode.cancel();
    };
  }, [roomId, saveCode]);

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

  const sendMessage = () => {
  if (
    !messageInput.trim()
  )
    return;

  socket.emit(
    "send-message",
    {
      roomId,
      message: messageInput,
      sender:
      localStorage.getItem(
        "userEmail"
      )
    }
  );

  setMessageInput("");
};

  const runCode = async () => {
    if (language !== "python") {
      setOutput(
        "Code execution is currently available only for Python."
      );
      return;
    }

    try {
      const response =
        await api.post(
          "/execute",
          {
            code,
          }
        );

      setOutput(
        response.data.output
      );
    } catch (error) {
      console.error(error);

      setOutput(
        "Execution Failed"
      );
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

      <div style={{ padding: "10px" }}>
        <button
          onClick={runCode}
        >
          Run Code
        </button>
      </div>

      <div style={{ padding: "10px" }}>
        <select
          value={language}
          onChange={async (e) => {
            const selectedLanguage =
              e.target.value;

            setLanguage(
              selectedLanguage
            );

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

      <div
        style={{
          padding:
            "0 10px 10px 10px",
          fontSize: "14px",
          color: "#666",
        }}
      >
        Note: Code execution currently
        supports Python only.
      </div>

      <CodeEditor
        code={code}
        setCode={handleCodeChange}
        language={language}
      />

      <div
        style={{
          padding: "10px",
          borderTop:
            "1px solid #ccc",
        }}
      >
        <h3>Output</h3>

        <pre>
          {output}
        </pre>
      </div>

      <div
        style={{
        padding: "10px",
        borderTop:
        "1px solid #ccc",
  }}
>
  <h3>Chat</h3>

  <div
    style={{
      height: "200px",
      overflowY: "auto",
      border:
        "1px solid #ccc",
      padding: "10px",
      marginBottom: "10px",
    }}
  >
    {messages.map(
      (msg, index) => (
        <div
  key={index}
  style={{
    marginBottom: "10px",
  }}
>
  <div
    style={{
      fontSize: "12px",
      color: "gray",
    }}
  >
    [{msg.timestamp}] {msg.sender}
  </div>

  <div>
    {msg.message}
  </div>
</div>
      )
    )}

    <div ref={chatEndRef} />
  </div>

  <input
    type="text"
    value={messageInput}
    onChange={(e) =>
      setMessageInput(
        e.target.value
      )
    }
    placeholder="Type message..."
  />

        <button
          onClick={sendMessage}
  >
          Send
        </button>
      </div>
    </div>
  );
}

export default InterviewRoom;