import { Fragment, useEffect, useState } from "react";
import { GetAiCompletedCodeResponseObject } from "../../api";
import {
  useAiCompletedCodeContext,
  useCodeCompletionContext,
} from "../../context";
import { useTaskContext } from "../../context/taskContex";
import CompletedCode from "./completedCode/completedCode";
import TaskItem from "./taskItem/taskItem";

function ScatchPadTab() {
  const { data } = useAiCompletedCodeContext();
  const { scratchPadValue, setScratchPadValue } = useCodeCompletionContext();
  const { tasks } = useTaskContext();

  const [showCompletedCode, setShowCompletedCode] = useState(true);

  useEffect(() => {
    if (tasks && tasks.length > 0) {
      setShowCompletedCode(false);
    }
  }, [tasks]);

  return (
    <div>
      <textarea
        className="text-md leading-5.6 ease-soft block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:border-primary-500 focus:outline-none"
        rows={4}
        value={scratchPadValue}
        onChange={(event) => setScratchPadValue(event.target.value)}
        placeholder="Paste your code here"
      />
      {tasks && tasks.length > 0 && (
        <div className="flex flex-wrap max-w-fit gap-2">
          <h5 className="mt-2">Outstanding tasks</h5>
          <div className="mt-2 border-b-4 border-primary-500 w-full"></div>
          {tasks.map((task, index) => {
            return (
              <Fragment key={index}>
                <TaskItem task={task} />
              </Fragment>
            );
          })}
        </div>
      )}
      {data && data.length > 0 && (
        <button
          className="flex flex-end mt-2 items-center p-2 hover:text-gray-700 bg-primary-400 text-primary-700 rounded-lg"
          onClick={() => setShowCompletedCode(!showCompletedCode)}
        >
          {showCompletedCode ? "Hide" : "Show"} completed code
        </button>
      )}
      {showCompletedCode && (
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
      )}
    </div>
  );
}

export default ScatchPadTab;
