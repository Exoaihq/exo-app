import { useEffect, useRef } from "react";
import { useDirectoryContext } from "../../context/directoryContext";
import {
  useScratchPadContext,
  useAiCompletedCodeContext,
  useCodeCompletionContext,
} from "../../context";
import DirectoryTab from "./directoryTab";
import CompletedCode from "./completedCode.tsx/completedCode";
import { GetAiCompletedCodeResponseObject } from "src/api";
import Divider from "../divider";
import LoadingIndicator from "./completedCode.tsx/loadingIndicator";

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

function ScratchPadContainer({ handleFileSelect }: ScratchPadContainerProps) {
  const messagesEndRef = useRef(null);

  const { activeTab } = useScratchPadContext();
  const { newFile, selectedFile, showFileSection } = useDirectoryContext();
  const { scratchPadLoading } = useCodeCompletionContext();
  const { data } = useAiCompletedCodeContext();

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  useEffect(() => {
    scrollToBottom();
  }, [history]);

  return (
    <div className="relative w-full p-6 h-[40rem] overflow-auto">
      {true && !newFile && activeTab === "Scratch Pad" && (
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
      {scratchPadLoading && (
        <div className="mt-8">
          <LoadingIndicator />
        </div>
      )}
      {data && data.length > 0 && <Divider />}
      {data &&
        data.length > 0 &&
        data.map((item: GetAiCompletedCodeResponseObject, index: any) => {
          return <CompletedCode key={index} data={item} />;
        })}
      {activeTab === "Repos" && <DirectoryTab />}
    </div>
  );
}
export default ScratchPadContainer;
