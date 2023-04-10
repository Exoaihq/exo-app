import { useState } from "react";
import { useFileUploadContext } from "../../context/fileUpdateContext";
import { formatTimeStampToHumanReadableTime } from "../../hooks/parseTimeStamp";
import { decimalToPercentage } from "../../utils/parsingReturnedCode";
import { ChevronDownIcon, ChevronUpIcon } from "../icons";

export interface SearchListItemProps {
  id: number;
  created_at: string;
  file_name: string;
  code_string: string;
  parsed_code_type: string | null;
  relative_file_path: string;
  similarity: number;
  code_explaination: string;
  account_id: string;
}

export interface CardProps {
  created_at: string;
  file_name: string;
  parsed_code_type: string | null;
  relative_file_path: string;
  similarity: string;
  code_explaination: string;
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
  relative_file_path,
  handleGetFile,
  similarity,
  parsed_code_type,
  selectedFile,
}: CardProps) {
  const fullPath =
    relative_file_path && file_name ? relative_file_path + "/" + file_name : "";

  return (
    <div
      className={`flex space-x-4 items-center rounded-lg ${
        selectedFile?.path === fullPath ? "bg-primary-500" : "bg-white"
      } shadow-lg p-4 mb-4`}
      data-eid="_task_3_title_id"
    >
      {file_name && relative_file_path && (
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
        <p>{relative_file_path}</p>
        <div className="flex flex-row">
          <p className="basis-1/4">{similarity}</p>
          <p className="grow">Type: {parsed_code_type}</p>
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
    parsed_code_type,
    relative_file_path,
    similarity,
    code_explaination,
  } = props;

  function toggle() {
    setShowCode(!showCode);
  }

  return (
    <div className="p-2" onClick={toggle}>
      <Card
        parsed_code_type={parsed_code_type}
        file_name={file_name}
        created_at={formatTimeStampToHumanReadableTime(created_at)}
        showCode={showCode}
        relative_file_path={relative_file_path}
        handleGetFile={handleGetFile}
        similarity={decimalToPercentage(similarity)}
        selectedFile={selectedFile}
        code_explaination={code_explaination}
      />

      <div hidden={!showCode}>
        <pre className="flex bg-slate-100 rounded-lg p-4 mb-4 max-w-fit">
          {code_explaination}
        </pre>
      </div>
    </div>
  );
};

export default SearchListItem;
