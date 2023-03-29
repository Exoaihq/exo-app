import ScratchPadHeader from "../scratchPad/scratchPadHeader";

function ChatHeader() {
  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <div className="relative md:flex items-center p-3">
        <a className="flex" href="https://www.getexo.dev/" target="_blank">
          <img
            width={29}
            height={29}
            src="https://www.getexo.dev/_next/image?url=%2Flogo.png&w=64&q=75"
            alt="logo"
          />
          <span className="block ml-4 font-bold text-gray-600">Exo</span>
        </a>
      </div>
      <div className="md:hidden">
        <ScratchPadHeader />
      </div>
    </div>
  );
}

export default ChatHeader;
