import { useState } from "react";
import CodeEditor from "./components/CodeEditor";

function App() {
  const [code, setCode] =
    useState("// Start coding...");

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
        setCode={setCode}
      />
    </div>
  );
}

export default App;