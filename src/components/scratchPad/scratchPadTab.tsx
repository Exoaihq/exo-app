import { GetAiCompletedCodeResponseObject } from "../../api";
import {
  useAiCompletedCodeContext,
  useCodeCompletionContext,
} from "../../context";
import Divider from "../divider";
import CompletedCode from "./completedCode.tsx/completedCode";
import LoadingIndicator from "./completedCode.tsx/loadingIndicator";
import SearchList from "./searchList";

function ScatchPadTab() {
  const { scratchPadLoading } = useCodeCompletionContext();
  const { data } = useAiCompletedCodeContext();

  return (
    <div>
      {scratchPadLoading && (
        <div className="mt-8">
          <LoadingIndicator />
        </div>
      )}
      {data && data.length > 0 && <Divider />}
      {data &&
        data.length > 0 &&
        data.map((item: GetAiCompletedCodeResponseObject, index: any) => {
          return <CompletedCode key={index} data={item} />;
        })}
      <div className="mt-4">
        <SearchList />
      </div>
    </div>
  );
}

export default ScatchPadTab;
