import { ApiRoutes } from ".";

export interface UpdateTaskRequest {
  taskId: string;
  values: Partial<GetTaskResponseObject>;
  baseApiUrl: string;
  session: any;
  sessionId: string;
}

export interface GetTasksRequest {
  baseApiUrl: string;
  session: any;
  sessionId: string;
}

export interface GetTaskResponseObject {
  completed_at: string;
  created_at: string;
  description: string;
  id: string;
  loop_evaluated_at: string | null;
  marked_ready: boolean | null;
  objective_id: string;
  started_eval_at: string | null;
  tool_input: string | null;
  tool_name: string;
  tool_output: string | null;
}

export interface GetTaskResponse {
  data: GetTaskResponseObject[];
}

export function getTasks(
  req: GetTasksRequest
): Promise<GetTaskResponseObject[]> {
  const request = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      access_token: req.session?.access_token,
      refresh_token: req.session?.refresh_token,
      session_id: req.sessionId,
    },
    url: req.baseApiUrl + ApiRoutes.TASK,
  };

  return fetch(request.url, request)
    .then((res) => {
      if (!res.ok) {
        throw new Error(res.statusText);
      }
      return res.json();
    })
    .then((res: GetTaskResponse) => {
      return res.data;
    })
    .catch((err) => {
      throw new Error(err);
    });
}

export function updateTask(
  req: UpdateTaskRequest
): Promise<UpdateTaskRequest[]> {
  const request = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      access_token: req.session?.access_token,
      refresh_token: req.session?.refresh_token,
      session_id: req.sessionId,
    },
    url: req.baseApiUrl + ApiRoutes.TASK,
    body: JSON.stringify({
      taskId: req.taskId,
      values: req.values,
      sessionId: req.sessionId,
    }),
  };

  return fetch(request.url, request)
    .then((res) => {
      if (!res.ok) {
        throw new Error(res.statusText);
      }
      return res.json();
    })
    .then((res: any) => {
      const { data } = res;
      return data;
    })
    .catch((err) => {
      throw new Error(err);
    });
}
