import { Fragment, useEffect, useState } from "react";
import { GetDirectoriesResponseObject } from "../../api";
import { useDirectoryContext } from "../../context";
import { ExoConfigContextWrapper } from "../../context/exoConfigContext";

import { formatTimeStampToHumanReadableShortDateTime } from "../../hooks/parseTimeStamp";
import Divider from "../divider";
import {
  LoadingSpinnerIcon,
  MenuIcon,
  RefreshIcon,
  UpArrowOnPaperIcon,
} from "../icons";
import SimpleToast from "../toast/toast";
import ExoConfig from "./exoConfig";
import SavedRepoMenu from "./savedRepoMenu";

export interface ExoConfigType {
  directoryName: string;
  explanation: string;
  codeStandards: string[];
  testFrameworks: string[];
}

function SavedRepoItem({
  directory,
}: {
  directory: GetDirectoriesResponseObject;
}) {
  const {
    handleIndexRepo,
    indexingLoadingId,
    setToast,
    toastOpen,
    directoryToIndex,
    submitIndexRepo,
    handleAddNewFile,
    handleRemoveRepo,
    metadata,
  } = useDirectoryContext();

  const [open, setOpen] = useState(false);
  const [exoConfig, setExoConfig] = useState<ExoConfigType>({
    directoryName: "",
    explanation: "",
    codeStandards: [],
    testFrameworks: [],
  });
  const [configSnippetId, setConfigSnippetId] = useState<number>(null);
  const { showConfigId } = useDirectoryContext();

  function getIndexMessageTitle() {
    if (!directoryToIndex) {
      return "";
    }
    return `${
      directoryToIndex?.indexed_at
        ? `Refresh ${directoryToIndex?.directory_name}`
        : `Index ${directoryToIndex?.directory_name}`
    }?`;
  }

  function getIndexMessage() {
    if (!directoryToIndex) {
      return "";
    }
    return `${
      directoryToIndex?.indexed_at
        ? `Refreshing the index for this repo will add any new files and update any existing files.`
        : `Indexing this repo will allow you to search and edit files within the repo. It does take a couple mintues to index.`
    }`;
  }

  const getExpoConfig = () => {
    if (!directory || !directory.exoConfig) {
      return "";
    } else {
      const exoConfigString = directory.exoConfig.code_snippet[0].code_string;
      const exoParsed = JSON.parse(exoConfigString);

      if (exoParsed) {
        setExoConfig(exoParsed);
        setConfigSnippetId(directory.exoConfig.code_snippet[0].id);
      }
    }
  };

  useEffect(() => {
    getExpoConfig();
  }, [directory]);

  return (
    <Fragment key={directory.id}>
      {directory && directory.saved && (
        <div className="flex flex-wrap  pb-0 bg-white rounded-lg divide-x ">
          <div className="flex-1 p-3">
            <div className="flex flex-col m-1 mx-3">
              <h5 className="bg-clip-text  from-primary-700 to-primary-500">
                {directory.directory_name}
              </h5>
            </div>
          </div>
          <div className="grow p-3">
            {directory.indexed_at && (
              <p className="font-light">
                {`Indexed: ${formatTimeStampToHumanReadableShortDateTime(
                  directory.indexed_at
                )}`}
              </p>
            )}
            <p>
              File Count:{" "}
              {metadata &&
                metadata?.directoryFileCount?.find(
                  (dir: { name: string }) =>
                    dir.name === directory.directory_name
                ).fileCount}
            </p>
          </div>
          <div className="flex flex-col pl-2 justify-between">
            <div className="relative">
              <button className="ml-2" onClick={() => setOpen(true)}>
                <MenuIcon className={"w-6 h-6 text-gray-400"} />
              </button>

              <SavedRepoMenu
                open={open}
                setOpen={setOpen}
                handleAddNewFile={handleAddNewFile}
                directory={directory}
                handleIndexRepo={handleIndexRepo}
                handleRemoveRepo={handleRemoveRepo}
              />
            </div>

            <div className="mb-2 mr-2">
              {indexingLoadingId === directory.id && !directory.indexed_at ? (
                <LoadingSpinnerIcon
                  className={
                    "w-4 h- mr-2 text-primary-700 animate-spin dark:text-gray-600 fill-primary-700"
                  }
                />
              ) : (
                <button
                  onClick={() => {
                    handleIndexRepo(directory);
                  }}
                  className="py-2.2 px-3.6 text-xs rounded-1.8 inline-block whitespace-nowrap  bg-[#e4e8ed] text-center align-baseline font-bold uppercase leading-none text-[#5974a2]"
                >
                  {directory.indexed_at ? (
                    <RefreshIcon className="w-3 h-3" />
                  ) : (
                    <UpArrowOnPaperIcon className="w-3 h-3" />
                  )}
                </button>
              )}
            </div>
          </div>
          {directory && showConfigId === directory.id && exoConfig && (
            <ExoConfigContextWrapper
              exoConfig={exoConfig}
              configSnippetId={configSnippetId}
            >
              <Divider />
              <ExoConfig />
            </ExoConfigContextWrapper>
          )}
          {directoryToIndex && directoryToIndex.id === directory.id && (
            <div className="absolute">
              <SimpleToast
                title={getIndexMessageTitle()}
                message={getIndexMessage()}
                buttonText="Yes"
                cancelButtonText="Not now"
                open={toastOpen}
                handleClose={() => setToast(false)}
                handleSubmit={submitIndexRepo}
              />
            </div>
          )}
        </div>
      )}
    </Fragment>
  );
}

export default SavedRepoItem;
