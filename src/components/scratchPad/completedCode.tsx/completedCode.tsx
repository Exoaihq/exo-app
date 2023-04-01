import { ChevronUpIcon, ChevronDownIcon } from "../../../components/icons";
import { GetAiCompletedCodeResponseObject } from "../../../api";
import { useState } from "react";
import Divider from "../../../components/divider";
import { formatDate } from "../../../hooks/parseTimeStamp";

const CompletedCode = ({
  data,
}: {
  data: GetAiCompletedCodeResponseObject;
}) => {
  const [showCode, setShowCode] = useState(true);

  function toggle() {
    setShowCode(!showCode);
  }

  function truncateText(text: string) {
    if (!text) return "";
    return text.length > 20 ? text.substring(0, 20) + "..." : text;
  }

  return (
    <div>
      <p className="text-sm">{formatDate(data.completed_at)}</p>
      <div className="flex flex-row space-between">
        <p className="grow">{truncateText(data.functionality)}</p>
        <button onClick={toggle} className={"basis-1/4"}>
          {showCode ? (
            <ChevronUpIcon className={"w-6 h-6"} />
          ) : (
            <ChevronDownIcon className={"w-6 h-6"} />
          )}
        </button>
      </div>
      <Divider />

      <pre hidden={!showCode} className="bg-slate-100 rounded-lg p-4 mb-4">
        {data.code}
      </pre>
    </div>
  );
};

export default CompletedCode;
