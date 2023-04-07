/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { createContext, useContext, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { fileUpload } from "../api";
import { useSessionContext } from "./sessionContext";

export type ActiveTab = "Scratch Pad" | "Repos" | "Chat";

export const FileUploadContextWrapper = (props: any) => {
  const { session, baseApiUrl, sessionId } = useSessionContext();
  const { loading, setLoading } = useSessionContext();
  const [selectedFile, setSelectedFile] = useState<File>(null);
  const [newFile, setNewFile] = useState(false);
  const [content, setContent] = useState("");
  const queryClient = useQueryClient();

  const useFileUploadMutation = useMutation(fileUpload, {
    onSuccess: async (res) => {
      queryClient.invalidateQueries("messages");
      const { metadata } = res;
      const { newFile } = metadata;

      newFile !== null && setNewFile(newFile);
    },
    onError(error: Error) {
      console.log(error);
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  const handleFileUpload = async (
    value: string,
    contentToUpdate: string,
    path?: string
  ) => {
    setLoading(true);

    useFileUploadMutation.mutate({
      baseApiUrl,
      session,
      codeContent: contentToUpdate,
      fullFilePathWithName: selectedFile ? selectedFile.path : path,
      sessionId,
    });
  };

  async function handleGetFile(fullpath: string) {
    const res = await window.api.getFile(fullpath);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    setSelectedFile({ path: fullpath });
    setContent(res);

    if (res) {
      handleFileUpload("", res, fullpath);
    }
  }

  const value = {
    setSelectedFile,
    selectedFile,
    newFile,
    setNewFile,
    handleGetFile,
    setContent,
    content,
  };
  return (
    <FileUploadContext.Provider value={value}>
      {props.children}
    </FileUploadContext.Provider>
  );
};

export const FileUploadContext = createContext({
  setSelectedFile: (file: File) => {},
  selectedFile: null,
  newFile: false,
  setNewFile: (newFile: boolean) => {},
  handleGetFile: async (value: string) => await ({} as any),
  setContent: (value: string) => {},
  content: "",
});

export const useFileUploadContext = () => useContext(FileUploadContext);
