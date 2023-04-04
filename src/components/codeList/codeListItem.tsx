import { useState } from "react";
import { useFileUploadContext } from "../../context/fileUpdateContext";
import { formatDate } from "../../hooks/parseTimeStamp";
import Divider from "../divider";
import { ChevronDownIcon, ChevronUpIcon } from "../icons";

export interface CodeListItemProps {
  date: string;
  title: string;
  code: string;
  index: number;
  filePath?: string;
  fileName?: string;
}

const CodeListItem = (props: CodeListItemProps) => {
  const [showCode, setShowCode] = useState(props.index === 0 ? true : false);
  const { handleGetFile } = useFileUploadContext();
  const { date, title, code } = props;

  function toggle() {
    setShowCode(!showCode);
  }

  function truncateText(text: string) {
    if (!text) return "";
    return text.length > 20 ? text.substring(0, 20) + "..." : text;
  }

  return (
    <div>
      <button
        onClick={() =>
          handleGetFile(
            props.filePath ? props.filePath + "/" + props.fileName : ""
          )
        }
        className="p-3 mt-4 rounded-lg bg-blue-500 text-gray-200 inline-flex items-center gap-2 justify-center hover:text-gray-600 hover:bg-blue-300 "
      >
        Select
      </button>
      <p className="text-sm">{formatDate(date)}</p>
      <div className="flex flex-row space-between">
        <p className="grow">{truncateText(title)}</p>
        <button onClick={toggle} className={"basis-1/4"}>
          {showCode ? (
            <ChevronUpIcon className={"w-6 h-6"} />
          ) : (
            <ChevronDownIcon className={"w-6 h-6"} />
          )}
        </button>
      </div>
      <Divider />

      <pre hidden={!showCode} className="flex bg-slate-100 rounded-lg p-4 mb-4">
        {code}
      </pre>
    </div>
  );
};

export default CodeListItem;
