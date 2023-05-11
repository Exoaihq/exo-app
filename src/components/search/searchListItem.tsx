import { useState } from "react";
import { useFileUploadContext } from "../../context/fileUpdateContext";
import { formatTimeStampToHumanReadableShortDateTime } from "../../hooks/parseTimeStamp";
import { decimalToPercentage } from "../../utils/parsingReturnedCode";
import { ChevronDownIcon, ChevronUpIcon } from "../icons";

export interface SearchListItemProps {
  id: number;
  created_at: string;
  file_name: string;
  code_string: string;
  content: string;
  file_path: string;
  similarity: number;
  file_explaination: string;
  account_id: string;
}

export interface CardProps {
  created_at: string;
  file_name: string;
  content: string | null;
  file_path: string;
  similarity: string;
  file_explaination: string;
  showCode: boolean;
  handleGetFile: (filePath: string) => void;
  selectedFile: {
    path: string;
  };
}

function Card({
  file_name,
  created_at,
  showCode,
  file_path,
  handleGetFile,
  similarity,
  content,
  selectedFile,
}: CardProps) {
  const fullPath = file_path && file_name ? file_path + "/" + file_name : "";
  console.log("created_at", created_at);
  return (
    <div
      className={`flex space-x-4 items-center rounded-lg ${
        selectedFile?.path === fullPath ? "bg-primary-500" : "bg-white"
      } shadow-lg p-4 mb-4`}
      data-eid="_task_3_title_id"
    >
      {file_name && file_path && (
        <button
          onClick={() => handleGetFile(fullPath)}
          className="p-2 rounded-lg bg-primary-700 text-gray-200 inline-flex items-center gap-2 justify-center hover:text-gray-600 hover:bg-blue-300 "
        >
          Select
        </button>
      )}
      <div className="grow mt-1">
        <div className="flex flex-row space-x-1">
          <h5 className="grow ">{file_name}</h5>
        </div>
        <p>{file_path}</p>
        <div className="flex flex-row">
          <p className="basis-1/4">{similarity}</p>
          <p className="basis-1/4">Created: {created_at}</p>
        </div>
      </div>
      <div className="flex">
        <div className="ml-auto">
          <button className={"basis-1/4"}>
            {showCode ? (
              <ChevronUpIcon className={"w-6 h-6"} />
            ) : (
              <ChevronDownIcon className={"w-6 h-6"} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

const SearchListItem = (props: SearchListItemProps) => {
  const [showCode, setShowCode] = useState(false);
  const { handleGetFile, selectedFile } = useFileUploadContext();
  const {
    created_at,
    file_name,
    content,
    file_path,
    similarity,
    file_explaination,
  } = props;

  function toggle() {
    setShowCode(!showCode);
  }

  return (
    <div className="p-2" onClick={toggle}>
      <Card
        content={content}
        file_name={file_name}
        created_at={formatTimeStampToHumanReadableShortDateTime(created_at)}
        showCode={showCode}
        file_path={file_path}
        handleGetFile={handleGetFile}
        similarity={decimalToPercentage(similarity)}
        selectedFile={selectedFile}
        file_explaination={file_explaination}
      />

      <div hidden={!showCode}>
        <pre className="flex bg-slate-100 rounded-lg p-4 mb-4 max-w-fit">
          {file_explaination}
        </pre>
      </div>
    </div>
  );
};

export default SearchListItem;
