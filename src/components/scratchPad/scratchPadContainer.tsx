import { useEffect, useRef } from "react";
import { useDirectoryContext } from "../../context/directoryContext";
import { useScratchPadContext } from "../../context/scratchPadContext";
import DirectoryTab from "./directoryTab";

export enum ChatUserType {
  system = "system",
  user = "user",
  assistant = "assistant",
}

export interface ChatMessage {
  role: ChatUserType;
  content: string;
}

declare global {
  interface Window {
    showDirectoryPicker: () => Promise<any>;
    showSaveFilePicker: () => Promise<any>;
  }
}

export interface ScratchPadContainerProps {
  handleFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  code?: string;
}

function ScratchPadContainer({
  code,
  handleFileSelect,
}: ScratchPadContainerProps) {
  const messagesEndRef = useRef(null);

  const { activeTab } = useScratchPadContext();
  const { newFile, selectedFile, showFileSection } = useDirectoryContext();

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  useEffect(() => {
    scrollToBottom();
  }, [history]);

  return (
    <div className="relative w-full p-6 h-[40rem] overflow-auto">
      {showFileSection && !newFile && (
        <div>
          {" "}
          <input type="file" onChange={handleFileSelect} />
          {selectedFile && (
            <div>
              <p>You have selected the file: {selectedFile.name}</p>
            </div>
          )}
        </div>
      )}
      {code && (
        <div className=" flex items-center">
          <div className="bg-slate-300 h-0.5 w-full"></div>
        </div>
      )}
      {code && <pre className="bg-slate-100 p-4">{code}</pre>}
      {activeTab === "Repos" && <DirectoryTab />}
    </div>
  );
}
export default ScratchPadContainer;
