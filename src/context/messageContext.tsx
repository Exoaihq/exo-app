/* eslint-disable @typescript-eslint/no-empty-function */
import { createContext, useContext } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { createMessage, getMessages } from "../api";
import { useCodeCompletionContext } from "./codeCompletionContext";
import { useSessionContext } from "./sessionContext";

export const MessageContextWrapper = (props: any) => {
  const queryClient = useQueryClient();
  const { session, baseApiUrl, sessionId } = useSessionContext();
  const { handleCodeChatMutation } = useCodeCompletionContext();
  const messagesApi = useQuery({
    queryKey: "messages",
    queryFn: () => getMessages({ session, baseApiUrl, sessionId }),
    enabled: !!session,
  });

  const useCreateMessage = useMutation(createMessage, {
    onSuccess: async (res) => {
      queryClient.invalidateQueries("messages");
      handleCodeChatMutation();
    },
  });

  const value = { useCreateMessage, messages: messagesApi.data };
  return (
    <MessageContext.Provider value={value}>
      {props.children}
    </MessageContext.Provider>
  );
};

export const MessageContext = createContext({
  useCreateMessage: {} as any,
  messages: [] as any,
});

export const useMessageContext = () => useContext(MessageContext);
