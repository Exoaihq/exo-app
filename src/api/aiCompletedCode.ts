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
