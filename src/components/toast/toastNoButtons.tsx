import { useEffect, useRef } from "react";
import { InformationCirclIcon } from "../icons";

function SimpleToastNoButtons({
  message,
  title,
  open,
  handleClose,
}: {
  message?: string;
  title: string;
  open: boolean;
  handleClose: () => void;
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
          {message && <div className="mb-2 text-sm font-normal">{message}</div>}
        </div>
      </div>
    </div>
  );
}

export default SimpleToastNoButtons;
