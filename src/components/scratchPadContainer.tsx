import { useEffect, useRef, useState } from "react";

export enum ChatUserType {
  system = "system",
  user = "user",
  assistant = "assistant",
}

export interface ChatMessage {
  role: ChatUserType;
  content: string;
}

function ClearButton({
  clearText,
}: {
  clearText: React.MouseEventHandler<HTMLButtonElement>;
}) {
  return (
    <button
      onClick={clearText}
      style={{
        position: "relative",
        top: -5,
        right: -5,
        background: "none",
        border: "none",
        cursor: "pointer",
        fontSize: "1rem",
        color: "red",
        lineHeight: 1,
      }}
    >
      &times;
    </button>
  );
}

export interface ScratchPadContainerProps {
  requiredFunctionality: string;
  newFile: boolean | null;
  projectDirectory: string;
  projectFile: string;
  clearItem: (item: string) => void;
  showFileSection: boolean;
  handleFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  selectedFile: File | null;
  code?: string;
}

function ScratchPadContainer({
  requiredFunctionality,
  newFile,
  projectDirectory,
  projectFile,
  clearItem,
  showFileSection,
  handleFileSelect,
  selectedFile,
  code,
}: ScratchPadContainerProps) {
  const messagesEndRef = useRef(null);
  const [dev, setDev] = useState(true);

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  const clearText = (item: string) => {
    clearItem(item);
  };

  useEffect(() => {
    scrollToBottom();
  }, [history]);

  return (
    <div className="relative w-full p-6 h-[40rem] overflow-auto">
      {showFileSection && (
        <div>
          {" "}
          <input type="file" onChange={handleFileSelect} id="ctrl" />
          {selectedFile && (
            <div>
              <p>You have selected the file: {selectedFile.name}</p>
            </div>
          )}
        </div>
      )}
      {dev && (
        <div>
          <ul className="space-y-2 ">
            {projectDirectory && <p>Project directory: {projectDirectory} </p>}

            {newFile !== null && (
              <p>New file: {newFile !== null && (newFile ? "Yes" : "No")} </p>
            )}

            {projectFile && <p>Code file: {projectFile} </p>}
            {requiredFunctionality && (
              <p>Functionality: {requiredFunctionality} </p>
            )}
          </ul>
        </div>
      )}
      {code && (
        <div className="my-4 flex items-center">
          <div className="bg-slate-300 h-0.5 w-full"></div>
        </div>
      )}
      <pre>{code}</pre>
    </div>
  );
}
export default ScratchPadContainer;
