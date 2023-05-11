/* eslint-disable @typescript-eslint/no-empty-function */
import { createContext, useContext } from "react";
import { useMutation, useQueryClient } from "react-query";

import { writeTestsForFiles } from "../api";
import { useDirectoryContext } from "./directoryContext";
import { useSessionContext } from "./sessionContext";

interface WriteTestContextWrapperProps {
  children: React.ReactNode;
}

export const WriteTestContextWrapper = (
  props: WriteTestContextWrapperProps
) => {
  const queryClient = useQueryClient();
  const { session, baseApiUrl, sessionId } = useSessionContext();
  const { setRepo } = useDirectoryContext();

  const useWriteTestMutation = useMutation(writeTestsForFiles, {
    onSuccess: async (res) => {
      queryClient.invalidateQueries("directory");
      queryClient.invalidateQueries("messages");
    },
    onError(error: Error) {
      console.log(error);
    },
    onSettled: () => {},
  });

  async function handleWriteTests(repo: string) {
    const files = await window.api.getAndParseDirectories({
      file_path: repo,
    });

    const request = {
      files,
      session,
      sessionId,
      baseApiUrl,
      directoryPath: repo,
    };

    useWriteTestMutation.mutate(request);

    setRepo(null);
  }

  const value = { handleWriteTests };
  return (
    <WriteTestContext.Provider value={value}>
      {props.children}
    </WriteTestContext.Provider>
  );
};

export const WriteTestContext = createContext({
  handleWriteTests: (repo: string) => {},
});

export const useWriteTestContext = () => useContext(WriteTestContext);
