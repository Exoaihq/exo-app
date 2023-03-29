import { ApiRoutes } from ".";

export interface GetDirectoriesRequest {
  baseApiUrl: string;
  session: any;
  sessionId: string;
}

export interface GetDirectoriesResponseObject {
  id: string;
  file_path: string;
  directory_name: string;
}

export interface GetDirectoriesResponse {
  data: GetDirectoriesResponseObject[];
}

export function getDirectories(
  req: GetDirectoriesRequest
): Promise<GetDirectoriesResponseObject[]> {
  const request = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      access_token: req.session?.access_token,
      refresh_token: req.session?.refresh_token,
      session_id: req.sessionId,
    },
    url: req.baseApiUrl + ApiRoutes.CODE_DIRECTORY,
  };

  return fetch(request.url, request)
    .then((res) => {
      if (!res.ok) {
        throw new Error(res.statusText);
      }
      return res.json();
    })
    .then((res: GetDirectoriesResponse) => {
      const { data } = res;
      return data;
    })
    .catch((err) => {
      throw new Error(err);
    });
}
