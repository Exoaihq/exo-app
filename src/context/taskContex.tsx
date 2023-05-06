/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import { createContext, useContext, useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";

import { GetTaskResponseObject, getTasks, updateTask } from "../api/task";
import { useSessionContext } from "./sessionContext";

interface TaskContextWrapperProps {
  children: React.ReactNode;
}

export const TaskContextWrapper = (props: TaskContextWrapperProps) => {
  const queryClient = useQueryClient();
  const { session, baseApiUrl, sessionId } = useSessionContext();

  const { data: tasks } = useQuery({
    queryKey: "tasks",
    queryFn: () => getTasks({ session, baseApiUrl, sessionId }),
    enabled: !!session,
    refetchInterval: 5000,
  });

  const useTaskMutation = useMutation(updateTask, {
    onSuccess: async (res) => {
      queryClient.invalidateQueries("tasks");
    },
    onError(error: Error) {
      console.log(error);
    },
    onSettled: () => {},
  });

  const [filteredTask, setFilteredTask] = useState<GetTaskResponseObject[]>([]);

  function taskFilter(tasks: GetTaskResponseObject[]) {
    return tasks.filter(
      (task) => task.marked_ready === null || task.marked_ready === true
    );
  }

  function markReady(task: GetTaskResponseObject) {
    useTaskMutation.mutate({
      taskId: task.id,
      values: { marked_ready: true },
      baseApiUrl,
      session,
      sessionId,
    });
  }

  function markCancel(task: GetTaskResponseObject) {
    useTaskMutation.mutate({
      taskId: task.id,
      values: { marked_ready: false },
      baseApiUrl,
      session,
      sessionId,
    });
  }

  useEffect(() => {
    if (tasks) {
      setFilteredTask(taskFilter(tasks));
    }
  }, [tasks]);

  const value = { tasks: filteredTask, markCancel, markReady };
  return (
    <TaskContext.Provider value={value}>{props.children}</TaskContext.Provider>
  );
};

export const TaskContext = createContext({
  tasks: [] as GetTaskResponseObject[],
  markReady: (task: GetTaskResponseObject) => {},
  markCancel: (task: GetTaskResponseObject) => {},
});

export const useTaskContext = () => useContext(TaskContext);
