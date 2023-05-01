import { GetAiCompletedCodeResponseObject } from "../../api";
import {
  useAiCompletedCodeContext,
  useCodeCompletionContext,
} from "../../context";
import CompletedCode from "./completedCode.tsx/completedCode";

function ScatchPadTab() {
  const { data } = useAiCompletedCodeContext();
  const { scratchPadValue, setScratchPadValue } = useCodeCompletionContext();

  return (
    <div>
      <textarea
        className="text-md leading-5.6 ease-soft block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:border-primary-500 focus:outline-none"
        rows={4}
        value={scratchPadValue}
        onChange={(event) => setScratchPadValue(event.target.value)}
        placeholder="Paste your code here"
      />
      <div className="flex flex-wrap max-w-fit">
        <div>
          {data &&
            data.length > 0 &&
            data.map((item: GetAiCompletedCodeResponseObject, index: any) => {
              return (
                <CompletedCode
                  key={index}
                  data={item}
                  defaultOpen={index === 0}
                />
              );
            })}
        </div>
      </div>
    </div>
  );
}

export default ScatchPadTab;
