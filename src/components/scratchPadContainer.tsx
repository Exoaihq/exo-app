import { useEffect, useRef } from "react";

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
  setFunctionality: (value: string) => void;
  functionality: string;
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
  setFunctionality,
  functionality,
}: ScratchPadContainerProps) {
  const messagesEndRef = useRef(null);

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
    <div className="relative w-full p-6 h-[40rem]">
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
      <ul className="space-y-2 h-full">
        {projectDirectory && (
          <p>
            Project directory: {projectDirectory}{" "}
            <ClearButton clearText={() => clearText("projectDirectory")} />{" "}
          </p>
        )}

        {newFile !== null && (
          <p>
            New file: {newFile !== null && (newFile ? "Yes" : "No")}{" "}
            <ClearButton clearText={() => clearText("newFile")} />{" "}
          </p>
        )}

        {projectFile && (
          <p>
            Code file: {projectFile}{" "}
            <ClearButton clearText={() => clearText("projectFile")} />{" "}
          </p>
        )}
        {requiredFunctionality && (
          <p>
            Functionality: {requiredFunctionality}{" "}
            <ClearButton clearText={() => clearText("requiredFunctionality")} />{" "}
          </p>
        )}
      </ul>
    </div>
  );
}
export default ScratchPadContainer;
