import { useRef } from "react";
import { GetDirectoriesResponseObject } from "../../api";
import { useDirectoryContext } from "../../context/directoryContext";
import { useFileUploadContext } from "../../context/fileUpdateContext";
import Divider from "../divider";
import { PlusIcon } from "../icons";

import SavedRepoItem from "./saveRepoItem";

function DirectoryTab() {
  const { directories, handleAddRepo, setRepo, repo, handleAddNewFile } =
    useDirectoryContext();

  const { newFile, selectedFile, setSelectedFile, handleGetFile } =
    useFileUploadContext();

  function handleAddRepoOrFile() {
    if (repo) {
      handleAddRepo();
      setRepo("");
    } else if (selectedFile) {
      handleGetFile(selectedFile.path);
    }
  }

  async function getDirectory() {
    window.api.selectFolder().then((res) => setRepo(res));
  }

  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  function handleFileSelect(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files[0];
    setSelectedFile(file);
  }

  return (
    <div>
      <div className="flex  items-center">
        <button
          className="p-3 mt-4 rounded-lg bg-gradient-to-tl from-primary-500 to-primary-700 text-gray-200 inline-flex items-center gap-2 justify-center hover:text-primary-200 hover:bg-blue-300 "
          onClick={getDirectory}
        >
          Select Repo
        </button>
        <p className="mt-4 ml-4 mr-4">or</p>
        {!newFile && (
          <button
            onClick={handleButtonClick}
            className="p-3 mt-4 rounded-lg bg-gradient-to-tl from-primary-500 to-primary-700 text-gray-200 inline-flex items-center gap-2 justify-center hover:text-primary-200 hover:bg-blue-300 "
          >
            Select File
            <input
              style={{
                display: "none",
              }}
              ref={fileInputRef}
              id="file"
              className="p-3 mt-4 rounded-lg bg-gradient-to-tl from-primary-500 to-primary-700 text-primary-200 inline-flex items-center gap-2 justify-center hover:text-primary-200 hover:bg-blue-300 "
              type="file"
              onChange={handleFileSelect}
            />
          </button>
        )}
      </div>
      <input
        className="w-full p-2 bg-white border-2 border-slate-200 rounded-lg mt-10"
        type="text"
        value={repo || selectedFile?.path || ""}
        onChange={(event) => setRepo(event.target.value)}
      />
      <div className="flex flex-row">
        {(selectedFile || repo) && (
          <button
            disabled={repo === "" && !selectedFile}
            onClick={handleAddRepoOrFile}
            className="p-2 mt-4 rounded-lg bg-primary-500 text-gray-200 inline-flex items-center gap-2 justify-center hover:text-gray-600 hover:bg-primary-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <PlusIcon className="w-4 h-4" />
            Add {selectedFile ? "File" : "Repo"}
          </button>
        )}
        {repo && <p className="mt-4 ml-4 mr-4">or</p>}
        {repo && (
          <div>
            <button
              onClick={() => handleAddNewFile(repo)}
              className="p-2 mt-4 rounded-lg bg-primary-500 text-gray-200 inline-flex items-center gap-2 justify-center hover:text-gray-600 hover:bg-primary-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <PlusIcon className="w-4 h-4" /> Add new file
            </button>
          </div>
        )}
      </div>
      <h3 className="mt-20">Saved Repos</h3>

      <Divider />
      <div className="grid grid-flow-row-dense gap-2 grid-cols-1 grid-rows-3">
        {directories && directories.length > 0 ? (
          directories.map((directory: GetDirectoriesResponseObject) => {
            return <SavedRepoItem directory={directory} key={directory.id} />;
          })
        ) : (
          <p className="text-gray-600">No saved repos</p>
        )}
      </div>

      {directories && directories.length > 0 && (
        <h3 className="mt-20">Recently Added</h3>
      )}
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
