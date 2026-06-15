import Editor from "@monaco-editor/react";

type Props = {
  code: string;
  language: string
  setCode: (value: string) => void;
};

function CodeEditor({
  code,
  setCode,
  language,
}: Props) {
  return (
    <Editor
      height="80vh"
      language={language}
      value={code}
      onChange={(value) =>
        setCode(value || "")
      }
    />
  );
}

export default CodeEditor;