/* eslint-disable @typescript-eslint/no-empty-function */
import { createContext, useContext, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { ChatMessage, createMessage, getMessages } from "../api";
import { useCodeCompletionContext } from "./codeCompletionContext";
import { useSessionContext } from "./sessionContext";

export const MessageContextWrapper = (props: any) => {
  const queryClient = useQueryClient();
  const { session, baseApiUrl, sessionId } = useSessionContext();
  const { handleCodeChatMutation } = useCodeCompletionContext();
  const { data } = useQuery({
    queryKey: "messages",
    queryFn: () => getMessages({ session, baseApiUrl, sessionId }),
    enabled: !!session,
    refetchInterval: 600000,
  });

  const useCreateMessage = useMutation(createMessage, {
    onSuccess: async (res) => {
      queryClient.invalidateQueries("messages");
      handleCodeChatMutation();
    },
  });

  useEffect(() => {
    if (data && data.length > 0 && data[data.length - 1]) {
      console.log(data[data.length - 1].created_location);
      if (data[data.length - 1].created_location === "browser") {
        handleCodeChatMutation();
      }
    }
  }, [data]);

  const value = { useCreateMessage, messages: data };
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
