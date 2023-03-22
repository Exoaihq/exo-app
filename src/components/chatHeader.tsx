import AvatarButton from "./avatarButton";

function ChatHeader() {
  return (
    <div className="relative flex items-center p-3 border-b border-gray-300">
      <AvatarButton />
      <span className="block ml-4 font-bold text-gray-600">Exo</span>
      <span className="absolute w-3 h-3 bg-green-600 rounded-full left-12 top-3"></span>
    </div>
  );
}

export default ChatHeader;
