import { Fragment } from "react";
import { GetDirectoriesResponseObject } from "../../api";
import { useDirectoryContext } from "../../context";
import { formatTimeStampToHumanReadableShortDateTime } from "../../hooks/parseTimeStamp";
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
          className="relative flex flex-col h-full min-w-0 break-words border-0 dark:bg-gray-950 dark:shadow-soft-dark-xl shadow-soft-xl rounded-2xl bg-clip-border bg-opacity-50 bg-secondary-300 hover:bg-opacity-100 hover:bg-gray-200 "
        >
          <div className="pb-0 border-black/12.5 rounded-t-2xl border-b-0 border-solid p-4">
            <div className="flex items-center gap-2 ">
              <p>{directory.directory_name}</p>
              {directory.indexed_at ? (
                <Fragment>
                  {indexingLoading ? (
                    <LoadingSpinnerIcon
                      className={
                        "w-4 h- mr-2 text-primary-700 animate-spin dark:text-gray-600 fill-primary-700"
                      }
                    />
                  ) : (
                    <RefreshIcon className="w-6 h-6" />
                  )}
                </Fragment>
              ) : (
                <UpArrowOnPaperIcon className="w-4 h-4" />
              )}
            </div>
            {directory.indexed_at && (
              <p className="font-light mr-2">
                {`Indexed: ${formatTimeStampToHumanReadableShortDateTime(
                  directory.indexed_at
                )}`}
              </p>
            )}
          </div>
        </div>
      )}
    </Fragment>
  );
}

export default SavedRepoItem;
