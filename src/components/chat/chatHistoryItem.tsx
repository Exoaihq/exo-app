import { useEffect, useState } from "react";
import { ChatMessage, ChatUserType } from "../../api";
import { formatTimeStampToHumanReadableTime } from "../../hooks/parseTimeStamp";

export function AssistentMessage({
  content,
  date,
}: {
  content: string;
  date: string;
}) {
  return (
    <div className="flex flex-wrap justify-start mb-6 -mx-3">
      <div className="w-auto max-w-full px-3 flex-0">
        <div className="relative flex flex-col min-w-0 break-words bg-white border-0 dark:bg-gray-950 dark:shadow-soft-dark-xl shadow-soft-xl rounded-2xl bg-clip-border">
          <div className="flex-auto px-4 py-2">
            <p className="mb-1">{content}</p>
            <div className="flex items-center leading-normal text-sm opacity-60">
              <i className="mr-1 leading-normal ni leading-none ni-check-bold text-sm"></i>
              <small>{formatTimeStampToHumanReadableTime(date)}</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function UserMessage({
  content,
  date,
  messagesEndRef,
}: {
  content: string;
  date: string;
  messagesEndRef: any;
}) {
  return (
    <div className="flex flex-wrap justify-end mb-6 -mx-3 text-right">
      <div className="w-auto max-w-full px-3 flex-0">
        <div className="relative flex flex-col min-w-0 break-words bg-gray-200 border-0 dark:bg-gray-950 dark:shadow-soft-dark-xl shadow-soft-xl rounded-2xl bg-clip-border">
          <div className="flex-auto px-4 py-2">
            <p className="mb-1"> {content}</p>
            <div className="flex items-center justify-end leading-normal text-sm opacity-60">
              <i className="mr-1 leading-normal ni leading-none ni-check-bold text-sm"></i>
              <small>{formatTimeStampToHumanReadableTime(date)}</small>
            </div>
          </div>
        </div>
      </div>
      <div style={{ float: "left", clear: "both" }} ref={messagesEndRef}></div>
    </div>
  );
}

function ImageMessage() {
  return (
    <div className="flex flex-wrap justify-start mb-6 -mx-3">
      <div className="w-5/12 max-w-full px-3 flex-0">
        <div className="relative flex flex-col min-w-0 break-words bg-white border-0 dark:bg-gray-950 dark:shadow-soft-dark-xl shadow-soft-xl rounded-2xl bg-clip-border">
          <div className="flex-auto p-2">
            <div className="w-full max-w-full p-0 flex-0">
              <img
                className="h-auto max-w-full mb-2 rounded-xl"
                src="https://images.unsplash.com/photo-1602142946018-34606aa83259?ixlib=rb-1.2.1&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;auto=format&amp;fit=crop&amp;w=1762&amp;q=80"
                alt="Rounded Image"
              />
            </div>
            <div className="flex items-center leading-normal text-sm opacity-60">
              <i className="mr-1 leading-normal ni leading-none ni-check-bold text-sm"></i>
              <small>4:47pm</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChatHistoryItem({
  message,
  messagesEndRef,
}: {
  message: ChatMessage;
  messagesEndRef: any;
}) {
  const { role, content, created_at } = message;

  const line =
    role === ChatUserType.assistant ? (
      <AssistentMessage content={content} date={created_at} />
    ) : (
      <UserMessage
        content={content}
        date={created_at}
        messagesEndRef={messagesEndRef}
      />
    );
  return line;
}

export function LoadingMessage() {
  const [loadingElipsis, setLoadingElipsis] = useState("...");
  useEffect(() => {
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
  }, []);
  return (
    <div className="flex flex-wrap justify-start mb-6 -mx-3">
      <div className="w-auto max-w-full px-3 flex-0">
        <div className="relative flex flex-col min-w-0 break-words bg-white border-0 dark:bg-gray-950 dark:shadow-soft-dark-xl shadow-soft-xl rounded-2xl bg-clip-border">
          <div className="flex-auto px-4 py-2">
            <p className="mb-1">{"Exo is typing" + loadingElipsis}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatHistoryItem;
