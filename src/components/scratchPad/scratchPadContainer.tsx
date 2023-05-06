import { useEffect, useRef } from "react";
import { useScratchPadContext } from "../../context";
import DirectoryTab from "../repos/directoryTab";
import SearchTab from "../search/searchTab";
import ScatchPadTab from "./scratchPadTab";
import { TaskContextWrapper } from "../../context/taskContex";

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

function ScratchPadContainer() {
  const messagesEndRef = useRef(null);

  const { activeTab } = useScratchPadContext();

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  useEffect(() => {
    scrollToBottom();
  }, [history]);

  return (
    <TaskContextWrapper>
      <div className="relative w-full p-6 h-[50rem] overflow-auto bg-gray-200">
        {activeTab === "Scratch Pad" && <ScatchPadTab />}
        {activeTab === "Repos" && <DirectoryTab />}
        {activeTab === "Search" && <SearchTab />}
      </div>
    </TaskContextWrapper>
  );
}
export default ScratchPadContainer;
