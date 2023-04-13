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
      title={data.functionality}
      code={data.code}
      index={key}
      defaultOpen={defaultOpen}
    />
  );
};

export default CompletedCode;
