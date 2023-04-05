import { Fragment, useEffect, useRef } from "react";
import { ChatMessage, ChatUserType } from "../../api";
import { useSessionContext } from "../../context";
import { useMessageContext } from "../../context/messageContext";
import ChatHistoryItem, {
  AssistentMessage,
  LoadingMessage,
} from "./chatHistoryItem";

const startingHistory = [
  {
    role: ChatUserType.assistant,
    content: "Hi! I'm your trusty Exo assistant. How can I help you today?",
  },
];

function ChatHistory() {
  const { messages } = useMessageContext();
  const { loading } = useSessionContext();

  const messagesEndRef = useRef(null);

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  function getCurrentTime() {
    return new Date().toString();
  }

  useEffect(() => {
    scrollToBottom();
  }, [history]);

  return (
    <div className="relative w-full p-6 overflow-y-auto h-[40rem]">
      <AssistentMessage
        content={startingHistory[0].content}
        date={getCurrentTime()}
      />
      {messages &&
        messages.map((item: ChatMessage, index: any) => {
          return (
            <Fragment key={index}>
              <ChatHistoryItem message={item} messagesEndRef={messagesEndRef} />
            </Fragment>
          );
        })}
      {loading && <LoadingMessage />}
      {/* {scratchPadLoading && (
          <li className="flex justify-start">
            <div className="relative max-w-xl px-4 py-2 text-gray-700 rounded shadow">
              <span className="block">
                I'm running your command. Feel free to continue out
                conversation...
              </span>
            </div>
          </li>
        )} */}
    </div>
  );
}

export default ChatHistory;
