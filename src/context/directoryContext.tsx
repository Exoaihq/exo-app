/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import { createContext, useContext, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";

import {
  createDirectory,
  createFiles,
  getDirectories,
  GetDirectoriesResponseObject,
  updateDirectoryToAddFileTo,
} from "../api";
import { useSessionContext } from "./sessionContext";

export const DirectoryContextWrapper = (props: any) => {
  const queryClient = useQueryClient();
  const { session, baseApiUrl, sessionId, setLoading } = useSessionContext();
  const [toastOpen, setToast] = useState(false);
  const [directoryToIndex, setDirectoryToIndex] =
    useState<GetDirectoriesResponseObject | null>(null);

  const [repo, setRepo] = useState("");
  const [repoToAddFile, setSetRepoToAddFile] = useState("");

  const [showFileSection, setShowFileSection] = useState(false);
  const [indexingLoading, setIndexingLoading] = useState(false);

  function toggleToast() {
    setToast(!toastOpen);
  }

  const useAddNewFileMutation = useMutation(updateDirectoryToAddFileTo, {
    onSuccess: async (res) => {
      queryClient.invalidateQueries("messages");
    },
    onError(error: Error) {
      console.log(error);
    },
    onSettled: () => {
      setIndexingLoading(false);
    },
  });

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
      queryClient.invalidateQueries("messages");
    },
    onError(error: Error) {
      console.log(error);
    },
    onSettled: () => {
      setLoading(false);
    },
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
      directoryId: directoryToIndex.id,
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

  function handleAddNewFile(selectedRepo: string) {
    setSetRepoToAddFile(selectedRepo);
    console.log("add new file", selectedRepo);

    useAddNewFileMutation.mutate({
      session,
      baseApiUrl,
      sessionId,
      directory: selectedRepo,
    });
  }

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
    handleAddNewFile,
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
  showFileSection: false,
  setShowFileSection: (showFileSection: boolean) => {},
  indexingLoading: false,
  handleAddNewFile: (addFileDirectrory: string) => {},
});

export const useDirectoryContext = () => useContext(DirectoryContext);
