import { ApiRoutes } from "./api.types";

export interface GetAiCompletedCodeRequest {
  baseApiUrl: string;
  session: any;
  sessionId: string;
}

export interface GetAiCompletedCodeResponseObject {
  code: string;
  id: string;
  completed_at: string;
  functionality: string;
  location: string;
  created_at: string;
  writen_to_file_at: string;
  file_name: string;
  path: string;
  existing_code: string;
}

export interface UpdateAiCompletedCodeRequest {
  baseApiUrl: string;
  session: any;
  sessionId: string;
  id: string;
  values: Partial<GetAiCompletedCodeResponseObject>;
}

export interface GetCompletedCodeResponse {
  data: GetAiCompletedCodeResponseObject[];
}

export function getAiCompletedCode(
  req: GetAiCompletedCodeRequest
): Promise<GetAiCompletedCodeResponseObject[]> {
  const request = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      access_token: req.session?.access_token,
      refresh_token: req.session?.refresh_token,
      session_id: req.sessionId,
    },
    url: req.baseApiUrl + ApiRoutes.AI_COMPLETED_CODE,
  };

  return fetch(request.url, request)
    .then((res) => {
      if (!res.ok) {
        throw new Error(res.statusText);
      }
      return res.json();
    })
    .then((res: GetCompletedCodeResponse) => {
      const { data } = res;
      return data;
    })
    .catch((err) => {
      throw new Error(err);
    });
}

export function updateAiCompletedCode(
  req: Partial<UpdateAiCompletedCodeRequest>
): Promise<any> {
  const request = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      access_token: req.session?.access_token,
      refresh_token: req.session?.refresh_token,
    },
    url: req.baseApiUrl + "/ai-completed-code",
    body: JSON.stringify({
      values: req.values,
      id: req.id,
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
