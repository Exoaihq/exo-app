function ChatHeader() {
  return (
    <div className="relative flex items-center p-3 border-b border-gray-300">
      <a className="flex" href="https://www.getexo.dev/" target="_blank">
        <img
          width={30}
          height={30}
          src="https://www.getexo.dev/_next/image?url=%2Flogo.png&w=64&q=75"
          alt="logo"
        />
        <span className="block ml-4 font-bold text-gray-600">Exo</span>
      </a>
    </div>
  );
}

export default ChatHeader;
