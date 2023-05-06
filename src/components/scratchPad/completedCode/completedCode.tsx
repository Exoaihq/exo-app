import { GetAiCompletedCodeResponseObject } from "../../../api";
import CodeListItem from "../../codeList/codeListItem";

const CompletedCode = ({
  data,
  key,
  defaultOpen,
}: {
  data: GetAiCompletedCodeResponseObject;
  key: number;
  defaultOpen: boolean;
}) => {
  return (
    <CodeListItem
      key={key}
      date={data.created_at}
      completed={data.completed_at}
      title={
        data.functionality
          ? data.functionality
          : data.code
          ? `${data.code.substring(0, 50)}...`
          : "Code:"
      }
      code={data.code}
      index={key}
      defaultOpen={defaultOpen}
    />
  );
};

export default CompletedCode;
