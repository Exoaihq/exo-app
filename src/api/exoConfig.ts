import { ExoConfigType } from "../components/repos/saveRepoItem";

export interface UpdateExoConfigRequest {
  exoConfig: ExoConfigType;
  snippetId: number;
  baseApiUrl: string;
  session: any;
  sessionId: string;
  directoryId?: string;
}

export function updateExoConfig(req: UpdateExoConfigRequest): Promise<any> {
  const request = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      access_token: req.session?.access_token,
      refresh_token: req.session?.refresh_token,
      session_id: req.sessionId,
    },
    url: req.baseApiUrl + "/exo-config",
    body: JSON.stringify({
      exoConfig: req.exoConfig,
      snippetId: req.snippetId,
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