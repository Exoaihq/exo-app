import { useEffect, useRef } from "react";
import { useScratchPadContext } from "../../context";
import DirectoryTab from "../repos/directoryTab";
import ScatchPadTab from "./scratchPadTab";

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
    <div className="relative w-full p-6 h-[50rem] overflow-auto bg-gray-200">
      {activeTab === "Scratch Pad" && <ScatchPadTab />}
      {activeTab === "Repos" && <DirectoryTab />}
    </div>
  );
}
export default ScratchPadContainer;
