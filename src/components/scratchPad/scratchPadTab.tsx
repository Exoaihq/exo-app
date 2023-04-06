import { GetAiCompletedCodeResponseObject } from "../../api";
import {
  useAiCompletedCodeContext,
  useCodeCompletionContext,
} from "../../context";
import CompletedCode from "./completedCode.tsx/completedCode";
import LoadingIndicator from "./completedCode.tsx/loadingIndicator";
import SearchList from "./searchList";

function ScatchPadTab() {
  const { scratchPadLoading } = useCodeCompletionContext();
  const { data } = useAiCompletedCodeContext();

  return (
    <div className="flex flex-wrap max-w-fit">
      {scratchPadLoading && (
        <div className="mt-8">
          <LoadingIndicator />
        </div>
      )}
      <div>
        {data &&
          data.length > 0 &&
          data.map((item: GetAiCompletedCodeResponseObject, index: any) => {
            return <CompletedCode key={index} data={item} />;
          })}
      </div>
      <div className="mt-4">
        <SearchList />
      </div>
    </div>
  );
}

export default ScatchPadTab;
