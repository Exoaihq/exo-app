import { FilePathAndContent } from "../utils/fileSystem";
import { ApiRoutes } from "./api.types";

export interface CreateFilesRequest {
  files: FilePathAndContent[];
  baseApiUrl: string;
  session: any;
  sessionId: string;
  directoryId?: string;
  directoryPath?: string;
}

export function createFiles(req: CreateFilesRequest): Promise<any> {
  const request = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      access_token: req.session?.access_token,
      refresh_token: req.session?.refresh_token,
      session_id: req.sessionId,
    },
    url: req.baseApiUrl + ApiRoutes.CODE_FILE,
    body: JSON.stringify({
      files: req.files,
      sessionId: req.sessionId,
      directoryId: req.directoryId,
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

export async function writeTestsForFiles(
  req: CreateFilesRequest
): Promise<any> {
  const request = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      access_token: req.session?.access_token,
      refresh_token: req.session?.refresh_token,
      session_id: req.sessionId,
    },
    url: req.baseApiUrl + ApiRoutes.CODE_FILE + "/write-tests",
    body: JSON.stringify({
      files: req.files,
      sessionId: req.sessionId,
      directoryPath: req.directoryPath,
    }),
  };

  try {
    const res = await fetch(request.url, request);
    if (!res.ok) {
      throw new Error(res.statusText);
    }
    const res_2 = await res.json();
    const { data } = res_2;
    return data;
  } catch (err) {
    throw new Error(err);
  }
}
