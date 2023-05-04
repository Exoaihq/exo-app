import {
  ApiRoutes,
  CodeCompletionRequest,
  CodeCompletionResponse,
  OpenAiResponseAndMetadata,
} from ".";

export function sendCodeToAgent(
  req: CodeCompletionRequest
): Promise<OpenAiResponseAndMetadata> {
  const request = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      access_token: req.session?.access_token,
      refresh_token: req.session?.refresh_token,
    },
    url: req.baseApiUrl + ApiRoutes.AGENT,
    body: JSON.stringify({
      codeContent: req.codeContent,
      fullFilePathWithName: req.fullFilePathWithName,
      sessionId: req.sessionId,
      scratchPadContent: req.scratchPadContent,
    }),
  };

  return fetch(request.url, request)
    .then((res) => {
      if (!res.ok) {
        throw new Error(res.statusText);
      }
      return res.json();
    })
    .then((res: CodeCompletionResponse) => {
      const { data } = res;
      return data;
    })
    .catch((err) => {
      throw new Error(err);
    });
}
