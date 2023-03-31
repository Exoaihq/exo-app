import { useEffect, useRef, useState } from "react";
import { useMessageContext } from "../../context/messageContext";
import { ChatMessage, ChatUserType } from "../../api";

const startingHistory = [
  {
    role: ChatUserType.assistant,
    content: "Hi! I'm your trusty Exo assistant. How can I help you today?",
  },
];

function ChatHistory({ loading }: { loading: boolean }) {
  const { messages } = useMessageContext();

  const messagesEndRef = useRef(null);
  const [loadingElipsis, setLoadingElipsis] = useState("...");

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  useEffect(() => {
    scrollToBottom();
  }, [history]);

  useEffect(() => {
    if (loading) {
      let count = 1;
      const maxDots = 4;

      function getNextEllipsis(): string {
        const ellipsis = ".".repeat(count);
        return ellipsis + " ".repeat(maxDots - count);
      }

      setInterval(() => {
        setLoadingElipsis(getNextEllipsis());
        if (count === maxDots) {
          count = 1;
        } else {
          count++;
        }
      }, 1000);
    }
  }, [loading]);

  return (
    <div className="relative w-full p-6 overflow-y-auto h-[40rem]">
      <ul className="space-y-2 h-full">
        <li className="flex justify-start">
          <div className="relative max-w-xl px-4 py-2 text-gray-700 rounded shadow">
            <span className="block">{startingHistory[0].content}</span>
          </div>
        </li>
        {messages &&
          messages.map((item: ChatMessage, index: any) => {
            const line =
              item.role === ChatUserType.assistant ? (
                <li className="flex justify-start" key={index}>
                  <div className="relative max-w-xl px-4 py-2 text-gray-700 rounded shadow">
                    <span className="block">{item.content}</span>
                  </div>
                </li>
              ) : (
                <li className="flex justify-end" key={index}>
                  <div className="relative max-w-xl px-4 py-2 text-gray-700 bg-gray-100 rounded shadow">
                    <span className="block">{item.content}</span>
                    <div
                      style={{ float: "left", clear: "both" }}
                      ref={messagesEndRef}
                    ></div>
                  </div>
                </li>
              );
            return line;
          })}
        {loading && (
          <li className="flex justify-start">
            <div className="relative max-w-xl px-4 py-2 text-gray-700 rounded shadow">
              <span className="block">{loadingElipsis}</span>
            </div>
          </li>
        )}
      </ul>
    </div>
  );
}

export default ChatHistory;
