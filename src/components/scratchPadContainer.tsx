import { Key, useEffect, useRef, useState } from "react";
import { useDirectoryContext } from "../context/directoryContext";

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
    showDirectoryPicker: (options: any) => Promise<any>;
    showSaveFilePicker: () => Promise<any>;
  }
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
  const [dev, setDev] = useState(false);

  const { directories } = useDirectoryContext();

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  const clearText = (item: string) => {
    clearItem(item);
  };

  // async function getDir() {
  //   const dirHandle = await window.showDirectoryPicker({
  //     startsIn: "documents",
  //   });

  //   const firstFile = await dirHandle.values().next();
  //   const entries = await dirHandle.entries().next();

  //   const directory = await window.api.getDirectories(dirHandle.name);
  //   console.log(directory);

  //   console.log(dirHandle.name, firstFile, entries);
  //   // run code for dirHandle
  // }

  useEffect(() => {
    scrollToBottom();
  }, [history]);

  return (
    <div className="relative w-full p-6 h-[40rem] overflow-auto">
      {/* <button onClick={getDir}>Click</button> */}
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
        <div className=" flex items-center">
          <div className="bg-slate-300 h-0.5 w-full"></div>
        </div>
      )}
      {code && <pre className="bg-slate-100 p-4">{code}</pre>}
      {
        <div className="flex justify-end">
          <ul>
            {directories &&
              directories.map(
                (
                  item: {
                    file_path: string;
                  },
                  index: Key
                ) => {
                  return <li key={index}>{item.file_path}</li>;
                }
              )}
          </ul>
        </div>
      }
    </div>
  );
}
export default ScratchPadContainer;
