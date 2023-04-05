/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import { createContext, useContext, useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { textIncludeScratchPad } from "../utils/parsingReturnedCode";
import { codeCompletion } from "../api";
import { useDirectoryContext } from "./directoryContext";
import { useScratchPadContext } from "./scratchPadContext";

import { useSessionContext } from "./sessionContext";
import { useFileUploadContext } from "./fileUpdateContext";

export const CodeCompletionContextWrapper = (props: any) => {
  const queryClient = useQueryClient();
  const { session, baseApiUrl, sessionId } = useSessionContext();
  const { content, selectedFile } = useFileUploadContext();
  const { setShowFileSection } = useDirectoryContext();
  const { setActiveTab } = useScratchPadContext();
  const { setLoading } = useSessionContext();
  const [scratchPadLoading, setScratchPadLoading] = useState(false);
  const [code, setCode] = useState("");
  const [projectDirectory, setProjectDirectory] = useState("");

  const [searchResults, setSearchResults] = useState<any>();

  const useCodeCompletion = useMutation(codeCompletion, {
    onSuccess: async (res) => {
      setShowFileSection(true);
      queryClient.invalidateQueries("messages");
      queryClient.invalidateQueries("ai-completed-code");
      const { metadata, completedCode, search } = res;
      const { projectDirectory, newFile } = metadata;

      setLoading(false);
      setScratchPadLoading(false);

      if (search) {
        setActiveTab("Scratch Pad");
        setSearchResults(search);
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
    // const newHistory = [
    //   ...history,
    //   { role: ChatUserType.user, content: value },
    // ];

    useCodeCompletion.mutate({
      baseApiUrl,
      session,
      codeContent: newCode,
      fullFilePathWithName: selectedFile ? selectedFile.path : "",
      sessionId,
    });
  };

  // useEffect(() => {
  //   if (loading) {
  //     setTimeout(() => {
  //       setScratchPadLoading(true);
  //     }, 5000);
  //   }
  // }, [loading]);

  const value = {
    handleCodeChatMutation,
    useCodeCompletion,
    code,
    setCode,
    scratchPadLoading,
    searchResults,
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
  searchResults: [],
});

export const useCodeCompletionContext = () => useContext(CodeCompletionContext);
