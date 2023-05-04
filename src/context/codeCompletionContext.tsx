/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import { createContext, useContext, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { textIncludeScratchPad } from "../utils/parsingReturnedCode";
import { useDirectoryContext } from "./directoryContext";
import { useScratchPadContext } from "./scratchPadContext";

import { sendCodeToAgent } from "../api/agent";
import { useFileUploadContext } from "./fileUpdateContext";
import { useSearchContext } from "./searchContext";
import { useSessionContext } from "./sessionContext";

export const CodeCompletionContextWrapper = (props: any) => {
  const queryClient = useQueryClient();
  const { session, baseApiUrl, sessionId } = useSessionContext();
  const { content, selectedFile, setSelectedFile, setContent } =
    useFileUploadContext();
  const { setShowFileSection } = useDirectoryContext();
  const { setActiveTab } = useScratchPadContext();
  const { setLoading } = useSessionContext();
  const [scratchPadLoading, setScratchPadLoading] = useState(false);
  const [code, setCode] = useState("");
  const [projectDirectory, setProjectDirectory] = useState("");
  const { setSearchResults, setSearchPhrase } = useSearchContext();

  const [scratchPadContent, setScratchPadContent] = useState("");

  const useCodeCompletion = useMutation(sendCodeToAgent, {
    onSuccess: async (res) => {
      setActiveTab("Scratch Pad");
      setShowFileSection(true);
      queryClient.invalidateQueries("messages");
      queryClient.invalidateQueries("ai-completed-code");
      const { metadata, completedCode, search } = res;
      const { projectDirectory, newFile } = metadata;

      setLoading(false);
      setScratchPadLoading(false);
      setSelectedFile(null);
      setContent("");

      if (search) {
        setSearchResults(search);
        setActiveTab("Search");
      }

      if (newFile) {
        setActiveTab("Repos");
      }

      projectDirectory && setProjectDirectory(projectDirectory);

      if (completedCode && selectedFile) {
        setCode(completedCode);
        await window.api.createOrUpdateFile({
          completedCode,
          metadata: {
            projectDirectory: selectedFile.path,
            newFile: false,
            projectFile: "",
            requiredFunctionality: "",
          },
          choices: [],
        });
      } else if (completedCode) {
        setCode(completedCode);
      }
    },
    onError(error: Error) {
      console.log(error);
    },
    onSettled: () => {
      setLoading(false);
      setScratchPadLoading(false);
    },
  });

  async function handleGetFile(fullpath: string) {
    return await window.api.getFile(fullpath);
  }

  const handleCodeChatMutation = async (contentToUpdate?: string) => {
    setLoading(true);

    // The user may update the code in the file. This get the updated code
    const updatedContent = content
      ? await handleGetFile(selectedFile.path)
      : "";

    let newCode = contentToUpdate ? contentToUpdate : updatedContent;

    if (textIncludeScratchPad(projectDirectory) && code) {
      newCode = code;
    }

    useCodeCompletion.mutate({
      baseApiUrl,
      session,
      codeContent: newCode,
      fullFilePathWithName: selectedFile ? selectedFile.path : "",
      sessionId,
      scratchPadContent,
    });
  };

  const value = {
    handleCodeChatMutation,
    useCodeCompletion,
    code,
    setCode,
    scratchPadLoading,
    scratchPadValue: scratchPadContent,
    setScratchPadValue: setScratchPadContent,
  };
  return (
    <CodeCompletionContext.Provider value={value}>
      {props.children}
    </CodeCompletionContext.Provider>
  );
};

export const CodeCompletionContext = createContext({
  handleCodeChatMutation: {} as any,
  useCodeCompletion: {} as any,
  code: "",
  setCode: (value: string) => {},
  scratchPadLoading: false,
  scratchPadValue: "",
  setScratchPadValue: (value: string) => {},
});

export const useCodeCompletionContext = () => useContext(CodeCompletionContext);
