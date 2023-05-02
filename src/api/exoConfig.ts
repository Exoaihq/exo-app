import { ExoConfigType } from "../components/repos/saveRepoItem";

export interface UpdateExoConfigRequest {
  exoConfig: ExoConfigType;
  snippetId: number;
  baseApiUrl: string;
  session: {
    access_token: string;
    refresh_token: string;
  };
  sessionId: string;
  directoryId?: string;
}

export interface ApiResponse<T> {
  data: T;
}

export async function updateExoConfig(
  req: UpdateExoConfigRequest
): Promise<any> {
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

  try {
    const response = await fetch(request.url, request);

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const jsonResponse: ApiResponse<any> = await response.json(); // Consider using a more specific type if possible
    return jsonResponse.data;
  } catch (error) {
    throw new Error(error.message);
  }
}
