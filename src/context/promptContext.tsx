/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { createContext, useContext, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { ChatMessage, MessagePrompts } from "../api";
import { getPrompts, submitPrompt } from "../api/prompt";
import { useSessionContext } from "./sessionContext";

export const PromptContextWrapper = (props: any) => {
  const queryClient = useQueryClient();
  const { session, baseApiUrl, sessionId } = useSessionContext();
  const [selectedMessage, setSelectedMessage] = useState<ChatMessage | null>(
    null
  );
  const [selectedPrompt, setSelectedPrompt] = useState<MessagePrompts | null>();

  const useAddNewFileMutation = useMutation(submitPrompt, {
    onSuccess: async (res) => {
      queryClient.invalidateQueries("messages");
    },
    onError(error: Error) {
      console.log(error);
    },
    onSettled: () => {},
  });

  function handleSubmitPrompt() {
    if (selectedPrompt) {
      useAddNewFileMutation.mutate({
        promptId: selectedPrompt.id,
        session,
        sessionId,
        baseApiUrl,
      });
      setSelectedPrompt(null);
    }
  }

  const { data } = useQuery({
    queryKey: "prompt",
    queryFn: () => getPrompts({ session, baseApiUrl, sessionId }),
    enabled: !!session,
  });

  const value = {
    prompts: data,
    selectedPrompt,
    setSelectedPrompt,
    handleSubmitPrompt,
    selectedMessage,
    setSelectedMessage,
  };
  return (
    <PromptContext.Provider value={value}>
      {props.children}
    </PromptContext.Provider>
  );
};

export const PromptContext = createContext({
  prompts: [] as any,
  selectedPrompt: null as any,
  setSelectedPrompt: (selectedPrompt: MessagePrompts | null) => {},
  handleSubmitPrompt: () => {},
  selectedMessage: null as any,
  setSelectedMessage: (selectedMessage: ChatMessage | null) => {},
});

export const usePromptContext = () => useContext(PromptContext);
