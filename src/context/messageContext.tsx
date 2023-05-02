/* eslint-disable @typescript-eslint/no-empty-function */
import { createContext, useContext, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { ChatMessage, createMessage, getMessages } from "../api";
import { useCodeCompletionContext } from "./codeCompletionContext";
import { useSessionContext } from "./sessionContext";

interface MessageContextWrapperProps {
  children: React.ReactNode;
}

export const MessageContextWrapper = (props: MessageContextWrapperProps) => {
  const queryClient = useQueryClient();
  const { session, baseApiUrl, sessionId } = useSessionContext();
  const { handleCodeChatMutation } = useCodeCompletionContext();
  const { data: messages } = useQuery({
    queryKey: "messages",
    queryFn: () => getMessages({ session, baseApiUrl, sessionId }),
    enabled: !!session,
    refetchInterval: 5000,
  });

  const useCreateMessage = useMutation(createMessage, {
    onSuccess: async (res) => {
      queryClient.invalidateQueries("messages");
      handleCodeChatMutation();
    },
  });

  useEffect(() => {
    const lastMessage = messages?.[messages.length - 1];
    if (lastMessage?.created_location === "browser") {
      handleCodeChatMutation();
    }
  }, [messages]);

  const value = { useCreateMessage, messages };
  return (
    <MessageContext.Provider value={value}>
      {props.children}
    </MessageContext.Provider>
  );
};

export const MessageContext = createContext({
  useCreateMessage: {} as any,
  messages: [] as ChatMessage[],
});

export const useMessageContext = () => useContext(MessageContext);
