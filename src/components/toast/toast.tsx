import { useEffect, useRef } from "react";
import { InformationCirclIcon } from "../icons";

function SimpleToast({
  message,
  title,
  buttonText,
  cancelButtonText,
  open,
  handleClose,
  handleSubmit,
}: {
  message: string;
  title: string;
  buttonText: string;
  cancelButtonText: string;
  open: boolean;
  handleClose: () => void;
  handleSubmit: () => void;
}) {
  const ref = useRef(null);
  const handleClickOutside = (event: { target: any }) => {
    if (ref.current && !ref.current.contains(event.target)) {
      handleClose();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <div
      hidden={!open}
      ref={ref}
      id="toast-interactive"
      className="w-full max-w-xs p-4 text-gray-500 bg-white rounded-lg shadow dark:bg-gray-800 dark:text-gray-400"
      role="alert"
    >
      <div className="flex" ref={ref}>
        <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-blue-500 bg-blue-100 rounded-lg dark:text-blue-300 dark:bg-blue-900">
          <InformationCirclIcon />
          <span className="sr-only">Information circle</span>
        </div>
        <div className="ml-3 text-sm font-normal">
          <span className="mb-1 text-sm font-semibold text-gray-900 dark:text-white">
            {title}
          </span>
          <div className="mb-2 text-sm font-normal">{message}</div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <button
                onClick={handleSubmit}
                className="inline-flex justify-center w-full px-2 py-1.5 text-xs font-medium text-center text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-800"
              >
                {buttonText}
              </button>
            </div>
            <div onClick={handleClose}>
              <button className="inline-flex justify-center w-full px-2 py-1.5 text-xs font-medium text-center text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:bg-gray-600 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-700 dark:focus:ring-gray-700">
                {cancelButtonText}
              </button>
            </div>
          </div>
        </div>
        <button
          onClick={handleClose}
          type="button"
          className="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
          data-dismiss-target="#toast-interactive"
          aria-label="Close"
        >
          <span className="sr-only">Close</span>
          <svg
            aria-hidden="true"
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            ></path>
          </svg>
        </button>
      </div>
    </div>
  );
}

export default SimpleToast;
