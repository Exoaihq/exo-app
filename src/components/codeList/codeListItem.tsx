import { useState } from "react";
import { useFileUploadContext } from "../../context/fileUpdateContext";
import { formatTimeStampToHumanReadableTime } from "../../hooks/parseTimeStamp";
import Divider from "../divider";
import { ChevronDownIcon, ChevronUpIcon } from "../icons";
import LoadingIndicator from "../scratchPad/completedCode.tsx/loadingIndicator";
import SimpleToastNoButtons from "../toast/toastNoButtons";

export interface CodeListItemProps {
  date: string;
  title: string;
  code: string;
  completed: string | null;
  index: number;
  filePath?: string;
  fileName?: string;
  defaultOpen?: boolean;
}

const CodeListItem = (props: CodeListItemProps) => {
  const [showCode, setShowCode] = useState(props.defaultOpen);
  const { handleGetFile } = useFileUploadContext();
  const { date, title, code, completed, fileName, filePath } = props;
  const [showToast, setShowToast] = useState(false);

  function toggle() {
    setShowCode(!showCode);
  }

  function truncateText(text: string) {
    if (!text) return "";
    return text.length > 100 ? text.substring(0, 100) + "..." : text;
  }

  const handleCopyClick = () => {
    setShowToast(true);
    navigator.clipboard.writeText(code);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  return (
    <div className="p-2">
      <div className="flex">
        <div className="flex-auto px-4 py-2 ">
          <p className="grow">{truncateText(title)}</p>
          <div className="flex gap-3 items-center leading-normal text-sm opacity-60">
            <small>{formatTimeStampToHumanReadableTime(date)}</small>
            {fileName && filePath && (
              <button
                onClick={() =>
                  handleGetFile(filePath ? filePath + "/" + fileName : "")
                }
                className="p-2 rounded-lg bg-primary-700 text-gray-200 inline-flex items-center gap-2 justify-center hover:text-gray-600 hover:bg-blue-300 "
              >
                Select
              </button>
            )}
            {!completed && <LoadingIndicator />}
          </div>
        </div>
        {completed && (
          <button className={"basis-1/4"} onClick={toggle}>
            {showCode ? (
              <ChevronUpIcon className={"w-6 h-6"} />
            ) : (
              <ChevronDownIcon className={"w-6 h-6"} />
            )}
          </button>
        )}
      </div>

      <Divider />
      {showCode && code && (
        <div hidden={!showCode}>
          <pre className="relative bg-slate-100 rounded-lg p-4 mb-4 max-w-fit">
            <div className="absolute right-0 -top-20">
              <SimpleToastNoButtons
                title="Copied to the clipboard"
                open={showToast}
                handleClose={() => setShowToast(false)}
              />
            </div>
            {showCode && code && (
              <button
                className={
                  "absolute -top-2 -right-2 p-2 rounded-lg bg-primary-200 text-primary-700 inline-flex items-center gap-2 justify-center hover:text-gray-600 hover:bg-blue-300 opacity-60"
                }
                onClick={handleCopyClick}
              >
                Copy
              </button>
            )}
            {code}
          </pre>
        </div>
      )}
    </div>
  );
};

export default CodeListItem;
