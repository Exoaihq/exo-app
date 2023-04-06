import { Fragment, useEffect, useRef, useState } from "react";
import { GetDirectoriesResponseObject } from "../../api";
import { useDirectoryContext } from "../../context";
import { formatTimeStampToHumanReadableShortDateTime } from "../../hooks/parseTimeStamp";
import {
  FourDots,
  LoadingSpinnerIcon,
  RefreshIcon,
  UpArrowOnPaperIcon,
} from "../icons";
import SimpleToast from "../toast/toast";

function SavedRepoItem({
  directory,
}: {
  directory: GetDirectoriesResponseObject;
}) {
  const {
    handleIndexRepo,
    indexingLoading,
    setToast,
    toastOpen,
    directoryToIndex,
    submitIndexRepo,
  } = useDirectoryContext();

  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const handleClickOutside = (event: { target: any }) => {
    console.log(ref.current.contains(event.target));
    if (ref.current && !ref.current.contains(event.target)) {
      setOpen(false);
    }
  };

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

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <Fragment key={directory.id}>
      {directory && directory.saved && (
        <div className="flex-auto p-6 pb-0 bg-white">
          <div className="flex flex-wrap items-center mb-4 -mx-3">
            <div className="w-9/12 max-w-full px-3 flex-0">
              <h5 className="z-10 mb-1 text-transparent bg-clip-text bg-gradient-to-tl from-primary-700 to-primary-500">
                <a href="javascript:;" className="text-transparent">
                  {directory.directory_name}
                </a>
              </h5>
            </div>
            <div className="w-3/12 max-w-full px-3 text-right flex-0">
              <div className="relative">
                <button onClick={() => setOpen(true)}>
                  <FourDots className={"w-6 h-6 text-gray-400"} />
                </button>

                <div hidden={!open}>
                  <ul
                    ref={ref}
                    className="z-100 min-w-44 text-sm shadow-soft-3xl duration-250 before:duration-350 before:font-awesome before:ease-soft before:text-5.5 dark:bg-gray-950 absolute top-0 right-0 left-auto m-0 mt-2 block origin-top cursor-pointer list-none rounded-lg border-0 border-solid border-transparent bg-white bg-clip-padding px-2 py-4 text-left text-slate-500"
                  >
                    <li className="relative">
                      <a
                        className="py-1.2 lg:ease-soft clear-both block w-full whitespace-nowrap rounded-lg px-4 font-normal text-slate-500 transition-colors hover:bg-gray-200 hover:text-slate-700 focus:bg-gray-200 focus:text-slate-700 dark:hover:bg-gray-200/80 dark:hover:text-slate-700 lg:duration-300"
                        href="javascript:;"
                      >
                        Refresh
                      </a>
                    </li>

                    <li className="relative">
                      <hr className="h-px my-2 bg-gradient-to-r from-transparent via-black/40 to-transparent" />
                    </li>
                    <li className="relative">
                      <a
                        className="py-1.2 text-danger lg:ease-soft clear-both block w-full whitespace-nowrap rounded-lg px-4 font-normal text-red-600 transition-colors hover:bg-gray-200 focus:bg-gray-200 dark:hover:bg-gray-200/80 lg:duration-300"
                        href="javascript:;"
                      >
                        Remove Repo
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          {directory &&
            directory.directory_explaination &&
            directory.directory_explaination !== "NULL" && (
              <p className="">{directory.directory_explaination}</p>
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

          <div className="flex m-1">
            {directory.indexed_at && (
              <p className="font-light mr-2">
                {`Indexed: ${formatTimeStampToHumanReadableShortDateTime(
                  directory.indexed_at
                )}`}
              </p>
            )}
            <Fragment>
              {indexingLoading && directory.id === directoryToIndex.id ? (
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
                  className="py-2.2 px-3.6 text-xs rounded-1.8 inline-block whitespace-nowrap ml-auto bg-[#e4e8ed] text-center align-baseline font-bold uppercase leading-none text-[#5974a2]"
                >
                  {directory.indexed_at ? (
                    <RefreshIcon className="w-3 h-3" />
                  ) : (
                    <UpArrowOnPaperIcon className="w-3 h-3" />
                  )}
                  <span className="ml-1">
                    {directory.indexed_at ? "Refresh" : "Index"}
                  </span>
                </button>
              )}
            </Fragment>
          </div>
        </div>
      )}
    </Fragment>
  );
}

export default SavedRepoItem;
