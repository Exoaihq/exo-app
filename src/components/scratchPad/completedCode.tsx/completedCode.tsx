import { GetAiCompletedCodeResponseObject } from "../../../api";
import CodeListItem from "../../codeList/codeListItem";

const CompletedCode = ({
  data,
  key,
}: {
  data: GetAiCompletedCodeResponseObject;
  key: number;
}) => {
  return (
    <CodeListItem
      key={key}
      date={data.created_at}
      completed={data.completed_at}
      title={data.functionality}
      code={data.code}
      index={key}
    />
  );
};

export default CompletedCode;
