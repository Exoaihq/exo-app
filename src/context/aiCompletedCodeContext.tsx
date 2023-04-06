import { createContext, useContext } from "react";
import { useQuery } from "react-query";
import { getAiCompletedCode, GetAiCompletedCodeResponseObject } from "../api";
import { useSessionContext } from "./sessionContext";

export const AiCompletedCodeContextWrapper = (props: any) => {
  const { session, baseApiUrl, sessionId } = useSessionContext();
  const { data } = useQuery({
    queryKey: "ai-completed-code",
    queryFn: () => getAiCompletedCode({ session, baseApiUrl, sessionId }),
    enabled: !!session,
    refetchInterval: 10000,
  });

  const value = {
    data,
  };
  return (
    <AiCompletedCodeContext.Provider value={value}>
      {props.children}
    </AiCompletedCodeContext.Provider>
  );
};

export const AiCompletedCodeContext = createContext({
  data: [] as GetAiCompletedCodeResponseObject[],
});

export const useAiCompletedCodeContext = () =>
  useContext(AiCompletedCodeContext);
