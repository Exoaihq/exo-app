import { Fragment } from "react";
import { GetDirectoriesResponseObject } from "../../api";
import { useDirectoryContext } from "../../context";
import { formatDate } from "../../hooks/parseTimeStamp";
import { LoadingSpinnerIcon, RefreshIcon, UpArrowOnPaperIcon } from "../icons";

function SavedRepoItem({
  directory,
}: {
  directory: GetDirectoriesResponseObject;
}) {
  const { handleIndexRepo, indexingLoading } = useDirectoryContext();
  return (
    <Fragment key={directory.id}>
      {directory && directory.saved && (
        <div
          onClick={() => handleIndexRepo(directory)}
          className="flex flex-row items-center hover:text-blue-500"
        >
          <li className="font-light mr-2">
            {directory.directory_name}{" "}
            {directory.indexed_at &&
              ` | Indexed: ${formatDate(directory.indexed_at)}`}
          </li>
          {directory.indexed_at ? (
            <Fragment>
              {indexingLoading ? (
                <LoadingSpinnerIcon
                  className={
                    "w-4 h- mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                  }
                />
              ) : (
                <RefreshIcon className="w-4 h-4" />
              )}
            </Fragment>
          ) : (
            <UpArrowOnPaperIcon className="w-4 h-4" />
          )}
        </div>
      )}
    </Fragment>
  );
}

export default SavedRepoItem;
