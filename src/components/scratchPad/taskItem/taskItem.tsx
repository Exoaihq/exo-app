import { GetTaskResponseObject } from "../../../api/task";
import { useTaskContext } from "../../../context/taskContex";
import { raisingHands } from "../../icons";
import LoadingIndicator from "../completedCode/loadingIndicator";

function TaskItem({ task }: { task: GetTaskResponseObject }) {
  const { markReady, markCancel } = useTaskContext();
  return (
    <div className="border-b-4 border-primary-500 mt-2 py-2 w-full">
      <p>Name: {task.tool_name}</p>
      <p>Input: {task.tool_input}</p>
      {task.marked_ready === null && (
        <div className="inline-flex gap-2">
          <button
            onClick={() => markReady(task)}
            className="flex flex-end mt-2 items-center p-2 hover:text-gray-700 bg-primary-400 text-white rounded-lg"
          >
            Ready
          </button>
          <button
            onClick={() => markCancel(task)}
            className="flex flex-end mt-2 items-center p-2 hover:text-gray-700 bg-red-400 text-white rounded-lg "
          >
            Cancel
          </button>
        </div>
      )}
      {task.marked_ready === true && !task.tool_output && <LoadingIndicator />}
      {task.tool_output && <p>Code writen {raisingHands}</p>}
    </div>
  );
}

export default TaskItem;
