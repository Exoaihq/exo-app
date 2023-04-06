// tsx
import React from "react";
import ScratchPadHeader from "../scratchPad/scratchPadHeader";
import { RefreshIcon } from "../icons";

function ChatHeader() {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <div className="relative md:flex items-center justify-between p-3">
        <a className="flex" href="https://www.getexo.dev/" target="_blank">
          <img
            width={30}
            height={30}
            src="https://www.getexo.dev/_next/image?url=%2Flogo.png&w=64&q=75"
            alt="logo"
          />
          <span className="block ml-4 font-bold text-gray-600">Exo</span>
        </a>
        <button
          className="inline-flex items-center p-2 hover:text-blue-500"
          onClick={handleRefresh}
          aria-label="Refresh"
        >
          <RefreshIcon className="w-6 h-6" />
        </button>
      </div>
      <div className="md:hidden">
        <ScratchPadHeader />
      </div>
    </div>
  );
}

export default ChatHeader;
