import { createContext, useContext, useEffect } from "react";
import { useMutation, useQuery } from "react-query";
import {
  getAiCompletedCode,
  GetAiCompletedCodeResponseObject,
  updateAiCompletedCode,
} from "../api";
import { useSessionContext } from "./sessionContext";

export const AiCompletedCodeContextWrapper = (props: any) => {
  const { session, baseApiUrl, sessionId } = useSessionContext();
  const { data } = useQuery({
    queryKey: "ai-completed-code",
    queryFn: () => getAiCompletedCode({ session, baseApiUrl, sessionId }),
    enabled: !!session,
    refetchInterval: 10000,
  });

  const useUpdateAiCodeMutation = useMutation(updateAiCompletedCode, {
    onSuccess: async (res) => {},
    onError(error: Error) {
      console.log(error);
    },
    onSettled: () => {},
  });

  const value = {
    data,
  };

  useEffect(() => {
    if (data && data.length > 0) {
      data.forEach(async (code: GetAiCompletedCodeResponseObject) => {
        const { location, writen_to_file_at, file_name, path } = code;

        if (code.code && file_name && path && !writen_to_file_at) {
          window.api
            .createOrUpdateFile({
              completedCode: code.code,
              metadata: {
                projectDirectory: path + "/" + file_name,
                newFile: false,
                projectFile: "",
                requiredFunctionality: "",
              },
              choices: [],
            })
            .then((res) => {
              useUpdateAiCodeMutation.mutate({
                session,
                baseApiUrl,
                sessionId,
                id: code.id,
                values: {
                  writen_to_file_at: new Date().toISOString(),
                },
              });
            });
        }

        // Handle updating exisiting code
        if (
          code.code === null &&
          file_name &&
          path &&
          !writen_to_file_at &&
          location === "existingFile"
        ) {
          const fileContent = await window.api.getFile(path + "/" + file_name);

          useUpdateAiCodeMutation.mutate({
            session,
            baseApiUrl,
            sessionId,
            id: code.id,
            values: {
              existing_code: fileContent,
            },
          });
        }
      });
    }
  }, [data]);

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
