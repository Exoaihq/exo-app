import { useEffect, useRef } from "react";

function SavedRepoMenu({
  open,
  setOpen,
  handleIndexRepo,
  directory,
  handleAddNewFile,
  handleRemoveRepo,
}: {
  open: boolean;

  setOpen: (open: boolean) => void;
  handleIndexRepo: (directory: any) => void;
  directory: any;
  handleAddNewFile: (addFileDirectrory: string) => void;
  handleRemoveRepo: (directoryId: string) => void;
}) {
  const ref = useRef(null);
  const handleClickOutside = (event: { target: any }) => {
    if (ref.current && !ref.current.contains(event.target)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <div hidden={!open}>
      <ul
        ref={ref}
        className="z-100 min-w-44 text-sm shadow-soft-3xl duration-250 before:duration-350 before:font-awesome before:ease-soft before:text-5.5 dark:bg-gray-950 absolute top-0 right-0 left-auto m-0 mt-2 block origin-top cursor-pointer list-none rounded-lg border-0 border-solid border-transparent bg-white bg-clip-padding px-2 py-4 text-left text-slate-500"
      >
        <li className="relative">
          <button
            className="py-1.2 lg:ease-soft clear-both block w-full whitespace-nowrap rounded-lg px-4 font-normal text-slate-500 transition-colors hover:bg-gray-200 hover:text-slate-700 focus:bg-gray-200 focus:text-slate-700 dark:hover:bg-gray-200/80 dark:hover:text-slate-700 lg:duration-300"
            onClick={() => {
              setOpen(false);
              handleIndexRepo(directory);
            }}
          >
            Refresh
          </button>
        </li>
        <li className="relative">
          <button
            className="py-1.2 lg:ease-soft clear-both block w-full whitespace-nowrap rounded-lg px-4 font-normal text-slate-500 transition-colors hover:bg-gray-200 hover:text-slate-700 focus:bg-gray-200 focus:text-slate-700 dark:hover:bg-gray-200/80 dark:hover:text-slate-700 lg:duration-300"
            onClick={() => handleAddNewFile(directory.file_path)}
          >
            Add file
          </button>
        </li>

        <li className="relative">
          <hr className="h-px my-2 bg-gradient-to-r from-transparent via-black/40 to-transparent" />
        </li>
        <li className="relative">
          <button
            onClick={() => handleRemoveRepo(directory.id)}
            className="py-1.2 text-danger lg:ease-soft clear-both block w-full whitespace-nowrap rounded-lg px-4 font-normal text-red-600 transition-colors hover:bg-gray-200 focus:bg-gray-200 dark:hover:bg-gray-200/80 lg:duration-300"
          >
            Remove Repo
          </button>
        </li>
      </ul>
    </div>
  );
}

export default SavedRepoMenu;
