/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import { createContext, useContext, useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";

import {
  createDirectory,
  getDirectories,
  createFiles,
  GetDirectoriesRequest,
  GetDirectoriesResponseObject,
} from "../api";
import { useSessionContext } from "./sessionContext";

export const DirectoryContextWrapper = (props: any) => {
  const queryClient = useQueryClient();
  const { session, baseApiUrl, sessionId } = useSessionContext();
  const [toastOpen, setToast] = useState(false);
  const [directoryToIndex, setDirectoryToIndex] =
    useState<GetDirectoriesResponseObject | null>(null);
  const [newFile, setNewFile] = useState(false);
  const [repo, setRepo] = useState("");
  const [selectedFile, setSelectedFile] = useState<File>(null);
  const [showFileSection, setShowFileSection] = useState(false);
  const [indexingLoading, setIndexingLoading] = useState(false);

  function toggleToast() {
    setToast(!toastOpen);
  }

  const useCreateFilesMutation = useMutation(createFiles, {
    onSuccess: async (res) => {
      queryClient.invalidateQueries("directory");
    },
    onError(error: Error) {
      console.log(error);
    },
    onSettled: () => {
      setIndexingLoading(false);
    },
  });

  const useCreateRepoMutation = useMutation(createDirectory, {
    onSuccess: async (res) => {
      queryClient.invalidateQueries("directory");
    },
    onError(error: Error) {
      console.log(error);
    },
    onSettled: () => {},
  });

  function handleAddRepo() {
    if (!repo) {
      window.alert("Please enter a repo name");
    }
    useCreateRepoMutation.mutate({
      session,
      baseApiUrl,
      sessionId,
      directory: repo,
    });
    console.log("add repo", repo);
  }

  function handleIndexRepo(directory: GetDirectoriesResponseObject) {
    setDirectoryToIndex(directory);
    setToast(true);

    console.log("index repo", directory);
  }

  async function submitIndexRepo() {
    const res = await window.api.getAndParseDirectories(directoryToIndex);
    useCreateFilesMutation.mutate({
      session,
      baseApiUrl,
      sessionId,
      files: res,
    });
    setToast(false);
    setIndexingLoading(true);
    console.log(res);
  }

  const { data } = useQuery({
    queryKey: "directory",
    queryFn: () => getDirectories({ session, baseApiUrl, sessionId }),
    enabled: !!session,
  });

  // useEffect(() => {
  //   if (!repo && data && data.length > 0) {
  //     setRepo(data[0].file_path);
  //   }
  // }, [data]);

  const value = {
    directories: data,
    handleAddRepo,
    repo,
    setRepo,
    setToast,
    toggleToast,
    toastOpen,
    handleIndexRepo,
    directoryToIndex,
    submitIndexRepo,
    newFile,
    setNewFile,
    setSelectedFile,
    selectedFile,
    showFileSection,
    setShowFileSection,
    indexingLoading,
  };
  return (
    <DirectoryContext.Provider value={value}>
      {props.children}
    </DirectoryContext.Provider>
  );
};

export const DirectoryContext = createContext({
  directories: null,
  handleAddRepo: () => {},
  repo: null,
  setRepo: (repo: string) => {},
  setToast: (any: boolean) => {},
  toastOpen: false,
  handleIndexRepo: (directory: any) => {},
  directoryToIndex: null,
  submitIndexRepo: () => {},
  newFile: false,
  setNewFile: (newFile: boolean) => {},
  setSelectedFile: (file: File) => {},
  selectedFile: null,
  showFileSection: false,
  setShowFileSection: (showFileSection: boolean) => {},
  indexingLoading: false,
});

export const useDirectoryContext = () => useContext(DirectoryContext);
