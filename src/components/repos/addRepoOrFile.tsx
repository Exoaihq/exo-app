import { useRef } from "react";
import { useDirectoryContext } from "../../context/directoryContext";
import { useFileUploadContext } from "../../context/fileUpdateContext";
import { PlusIcon } from "../icons";
import RepoActionButtons from "./repoActionButtons";

function AddRepoOrFile() {
  const { handleAddRepo, setRepo, repo, handleAddNewFile } =
    useDirectoryContext();

  const { newFile, selectedFile, setSelectedFile, handleGetFile } =
    useFileUploadContext();

  async function getDirectory() {
    window.api.selectFolder().then((res) => setRepo(res));
  }

  const fileInputRef = useRef(null);

  function handleAddRepoOrFile() {
    if (repo) {
      handleAddRepo();
      setRepo("");
    } else if (selectedFile) {
      handleGetFile(selectedFile.path);
    }
  }

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
    <>
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
        {selectedFile && (
          <button
            disabled={repo === "" && !selectedFile}
            onClick={handleAddRepoOrFile}
            className="p-2 mt-4 rounded-lg bg-primary-500 text-gray-200 inline-flex items-center gap-2 justify-center hover:text-gray-600 hover:bg-primary-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <PlusIcon className="w-4 h-4" />
            Add File
          </button>
        )}
        {repo && (
          <RepoActionButtons
            repo={repo}
            handleAddNewFile={handleAddNewFile}
            handleAddRepoOrFile={handleAddRepoOrFile}
            selectedFile={selectedFile}
          />
        )}
      </div>
    </>
  );
}

export default AddRepoOrFile;
