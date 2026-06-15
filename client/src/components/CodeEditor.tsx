import Editor from "@monaco-editor/react";

type Props = {
  code: string;
  setCode: (value: string) => void;
};

function CodeEditor({
  code,
  setCode,
}: Props) {
  return (
    <Editor
      height="80vh"
      defaultLanguage="javascript"
      value={code}
      onChange={(value) =>
        setCode(value || "")
      }
    />
  );
}

export default CodeEditor;