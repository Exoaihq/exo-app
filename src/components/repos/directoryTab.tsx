import { GetDirectoriesResponseObject } from "../../api";
import { useDirectoryContext } from "../../context/directoryContext";
import Divider from "../divider";
import { PlusIcon } from "../icons";

import SimpleToast from "../toast/toast";
import SavedRepoItem from "./saveRepoItem";

function DirectoryTab() {
  const {
    directories,
    handleAddRepo,
    setRepo,
    repo,
    setToast,
    toastOpen,
    directoryToIndex,
    submitIndexRepo,
  } = useDirectoryContext();

  async function getDir() {
    const dirHandle = await window.showDirectoryPicker();
    setRepo("/" + dirHandle.name);
  }

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

  return (
    <div>
      <button
        className="p-3 mt-4 rounded-lg bg-blue-500 text-gray-200 inline-flex items-center gap-2 justify-center hover:text-gray-600 hover:bg-blue-300 "
        onClick={getDir}
      >
        Select Directory
      </button>
      <input
        className="w-full p-2 bg-white border-2 border-slate-200 rounded-lg mt-10"
        type="text"
        id="username"
        value={repo}
        onChange={(event) => setRepo(event.target.value)}
      />
      <button
        disabled={repo === ""}
        onClick={handleAddRepo}
        className="p-2 mt-4 rounded-lg bg-blue-500 text-gray-200 inline-flex items-center gap-2 justify-center hover:text-gray-600 hover:bg-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <PlusIcon className="w-4 h-4" />
        Add Repo
      </button>
      <Divider />
      <h3 className="mt-20">Saved Repos</h3>
      <Divider />
      <ul className="list-disc ml-4">
        {directories &&
          directories.map((directory: GetDirectoriesResponseObject) => {
            return <SavedRepoItem directory={directory} key={directory.id} />;
          })}
      </ul>
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

      <h3 className="mt-20">Recently Added</h3>
      <Divider />
      <ul className="list-disc ml-4">
        {directories &&
          directories.map(
            (directory: GetDirectoriesResponseObject, index: any) => {
              // Only show the last 10 directories
              if (index > 10) {
                return;
              }
              return (
                <div key={directory.id}>
                  <li className="font-light">{directory.file_path}</li>
                </div>
              );
            }
          )}
      </ul>
    </div>
  );
}

export default DirectoryTab;
