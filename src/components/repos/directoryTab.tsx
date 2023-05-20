import { GetDirectoriesResponseObject } from "../../api";
import { useDirectoryContext } from "../../context/directoryContext";
import { WriteTestContextWrapper } from "../../context/writeTestContext";
import Divider from "../divider";

import AddRepoOrFile from "./addRepoOrFile";
import SavedRepoItem from "./saveRepoItem";

function DirectoryTab() {
  const { directories } = useDirectoryContext();

  // async function handleCreatePr() {
  //   await window.api.createPr({
  //     baseDirectory: "/Users/kg/Repos/code-gen-app",
  //     fromBranch: "kevin/test-branch-4",
  //     toBranch: "main",
  //     title: "Test PR",
  //     description: "Test PR description",
  //   });
  // }

  // async function handleOpenWindow() {
  //   await window.api.openWindow({
  //     url: `https://github.com/login/oauth/authorize?client_id=12345&state=abcdefg`,
  //     width: 800,
  //     height: 600,
  //     title: "My Window",
  //   });
  // }

  return (
    <WriteTestContextWrapper>
      <AddRepoOrFile />
      <h5 className="mt-20">Saved Repos</h5>

      <Divider />
      <div className="grid grid-flow-row-dense gap-2 grid-cols-1 ">
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
    </WriteTestContextWrapper>
  );
}

export default DirectoryTab;
