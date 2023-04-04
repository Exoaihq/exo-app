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
      date={data.completed_at}
      title={data.functionality}
      code={data.code}
      index={key}
    />
  );
};

export default CompletedCode;
