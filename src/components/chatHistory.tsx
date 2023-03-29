import { useEffect, useRef, useState } from "react";
import { ChatMessage, ChatUserType } from "../api";

function ChatHistory({
  history,
  loading,
}: {
  history: ChatMessage[];
  loading: boolean;
}) {
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
        {history &&
          history.map((item, index) => {
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
