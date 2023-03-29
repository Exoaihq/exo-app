import { useSessionContext } from "../context/sessionContext";

function ChatHeader() {
  const { handleLogout } = useSessionContext();
  return (
    <div className="border-gray-300 pb-3 border-b">
      <div className="relative flex items-center p-3 ">
        <a className="flex" href="https://www.getexo.dev/" target="_blank">
          <img
            width={30}
            height={30}
            src="https://www.getexo.dev/_next/image?url=%2Flogo.png&w=64&q=75"
            alt="logo"
          />
          <span className="block ml-4 font-bold text-gray-600">Exo</span>
        </a>
        {handleLogout && (
          <button
            className="absolute top-4 right-2 ml-4 text-gray-500"
            onClick={handleLogout}
          >
            Logout
          </button>
        )}
      </div>
    </div>
  );
}

export default ChatHeader;
