/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import { createContext, useContext, useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";

import {
  createDirectory,
  createFiles,
  DirectoryMetadata,
  getDirectories,
  GetDirectoriesResponseObject,
  updateDirectory,
  updateDirectoryToAddFileTo,
} from "../api";
import { useSessionContext } from "./sessionContext";

export const filesToExcule = [
  "yarn.lock",
  ".json",
  "supabase.ts",
  "yarn-error.log",
  ".eslintrc.json",
  ".git",
  ".gitignore",
  ".DS_Store",
  "package-lock.json",
  ".png",
  ".jpg",
  ".jpeg",
  ".svg",
  ".ico",
  ".pdf",
  ".woff",
  ".woff2",
  ".ttf",
  ".eot",
  ".otf",
  ".txt",
  "_error.js",
  "_buildManifest.js",
  "_ssgManifest.js",
  "polyfills.js",
  "react-refresh.js",
  "webpack.js",
  "build-manifest.json",
  "react-loadable-manifest.json",
  ".CVS",
  "amp.js",
  "amp.js.map",
  ".hot-update.js",
  ".prettierrc.js",
  "jest.config.js",
  "jest.setup.js",
  "next-env.d.ts",
  "next-sitemap.config.js",
  "next.config.js",
];

export const DirectoryContextWrapper = (props: any) => {
  const queryClient = useQueryClient();
  const { session, baseApiUrl, sessionId, setLoading } = useSessionContext();
  const [toastOpen, setToast] = useState(false);
  const [directoryToIndex, setDirectoryToIndex] =
    useState<GetDirectoriesResponseObject | null>(null);

  const [repo, setRepo] = useState("");
  const [repoToAddFile, setSetRepoToAddFile] = useState("");
  const [run, setRun] = useState(false);

  const [showFileSection, setShowFileSection] = useState(false);
  const [indexingLoadingId, setIndexingLoadingId] = useState(null);
  const [lastCheckedTime, setLastCheckedTime] = useState(null);
  const [showConfigId, setShowConfigId] = useState(false);

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
      setIndexingLoadingId(null);
    },
  });

  const useUpdateDirectory = useMutation(updateDirectory, {
    onSuccess: async (res) => {
      queryClient.invalidateQueries("directory");
      queryClient.invalidateQueries("messages");
    },
    onError(error: Error) {
      console.log(error);
    },
    onSettled: () => {},
  });

  const useCreateFilesMutation = useMutation(createFiles, {
    onSuccess: async (res) => {
      queryClient.invalidateQueries("directory");
      queryClient.invalidateQueries("messages");
    },
    onError(error: Error) {
      console.log(error);
    },
    onSettled: () => {},
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

  function handleRemoveRepo(directoryId: string) {
    console.log("remove repo");
    useUpdateDirectory.mutate({
      session,
      baseApiUrl,
      sessionId,
      directoryId,
      values: {
        saved: false,
      },
    });
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
    setIndexingLoadingId(directoryToIndex.id);
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

  async function getChangedFiles(filePath: string, directoryId: string) {
    const { files, untrackedFiles } = await window.api.updateChangedFile(
      filePath
    );

    const fileArray = files.split("\n").map((file) => {
      return `${filePath}/${file}`;
    });

    const allFiles = [...fileArray, ...untrackedFiles];

    function substringMatch(str: string, substrings: string[]) {
      for (let i = 0; i < substrings.length; i++) {
        if (str.includes(substrings[i])) {
          return true;
        }
      }
      return false;
    }

    allFiles.forEach(async (file) => {
      if (substringMatch(file, filesToExcule)) {
        return;
      } else {
        const contents = await window.api.getFile(file);
        useCreateFilesMutation.mutate({
          session,
          baseApiUrl,
          sessionId,
          files: [
            {
              filePath: file,
              contents,
            },
          ],
          directoryId,
        });
      }
    });

    return fileArray;
  }

  useEffect(() => {
    const now = Date.now();
    const hasBeenTenMin = lastCheckedTime + 600000 < now;
    const afterTenMin = !lastCheckedTime || hasBeenTenMin;
    if (data && data.data && afterTenMin) {
      for (const directory of data.data) {
        if (directory.saved && directory.is_root_directory) {
          getChangedFiles(directory.file_path, directory.id);
          setLastCheckedTime(Date.now());
        }
      }
    }
  }, [data]);

  const value = {
    directories: data?.data,
    metadata: data?.metadata,
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
    indexingLoadingId,
    handleRemoveRepo,
    showConfigId,
    setShowConfigId,
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
  indexingLoadingId: null,
  handleAddNewFile: (addFileDirectrory: string) => {},
  handleRemoveRepo: (directoryId: string) => {},
  metadata: {} as DirectoryMetadata,
  showConfigId: null,
  setShowConfigId: (showConfigId: boolean) => {},
});

export const useDirectoryContext = () => useContext(DirectoryContext);
