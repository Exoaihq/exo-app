import { Fragment, useEffect, useState } from "react";
import { ChatMessage, ChatUserType, MessagePrompts } from "../../api";
import { usePromptContext } from "../../context/promptContext";
import { formatTimeStampToHumanReadableTime } from "../../hooks/parseTimeStamp";
import SimpleToast from "../toast/toast";

export function AssistentMessage({
  content,
  date,
  children,
}: {
  content: string;
  date: string;
  children?: any;
}) {
  return (
    <div className="flex flex-wrap justify-start mb-6 -mx-3">
      <div className="w-auto max-w-full px-3 flex-0">
        <div className="relative flex flex-col min-w-0 break-words bg-white border-0 dark:bg-gray-950 dark:shadow-soft-dark-xl shadow-soft-xl rounded-2xl bg-clip-border">
          <div className="flex-auto px-4 py-2">
            <p className="mb-1">{content}</p>
            {children}
            <div className="flex items-center leading-normal text-sm opacity-60">
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
  const { role, content, created_at, message_prompts } = message;

  const {
    selectedPrompt,
    setSelectedPrompt,
    handleSubmitPrompt,
    setSelectedMessage,
    selectedMessage,
  } = usePromptContext();

  const toggleOpen = (prompt: MessagePrompts) => {
    setSelectedMessage(message);

    setSelectedPrompt(prompt);
  };

  const toggleClosed = () => {
    setSelectedPrompt(null);
  };

  const line =
    role === ChatUserType.assistant ? (
      <AssistentMessage content={content} date={created_at}>
        <>
          {message_prompts && message_prompts.length > 0 && (
            <div className="relative">
              <div className="flex flex-row">
                <p className="m-0">
                  You can also select one of these preset functions:
                </p>
                {message_prompts.map((prompt, index) => {
                  return (
                    <Fragment key={index}>
                      <button
                        onClick={() => toggleOpen(prompt)}
                        className="px-1 font-medium text-primary-600 dark:text-blue-500 hover:underline"
                      >
                        {prompt.name}
                        {message_prompts.length - 1 !== index && ", "}
                      </button>
                    </Fragment>
                  );
                })}
              </div>
              <div className="absolute -top-40 right-0">
                {selectedPrompt && selectedMessage.id === message.id && (
                  <SimpleToast
                    message={selectedPrompt?.description || ""}
                    open={
                      selectedPrompt && selectedMessage.id === message.id
                        ? true
                        : false
                    }
                    title={selectedPrompt?.name || ""}
                    buttonText="Run Function"
                    cancelButtonText="Cancel"
                    handleClose={toggleClosed}
                    handleSubmit={handleSubmitPrompt}
                  />
                )}
              </div>
            </div>
          )}
        </>
      </AssistentMessage>
    ) : role === ChatUserType.user ? (
      <UserMessage
        content={content}
        date={created_at}
        messagesEndRef={messagesEndRef}
      />
    ) : (
      <></>
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
