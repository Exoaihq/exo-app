import { ChatMessage } from ".";

export interface CodeCompletionResponseMetadata {
  projectDirectory: string;
  projectFile: string;
  newFile: boolean | null;
  requiredFunctionality: string;
}

export interface OpenAiResponseAndMetadata {
  choices: Choices[];
  metadata: CodeCompletionResponseMetadata;
  completedCode: string;
  search?: [any];
}

export interface CodeCompletionResponse {
  data: OpenAiResponseAndMetadata;
}

export interface CodeCompletionRequest {
  baseApiUrl: string;
  session: any;
  codeContent: string;
  fullFilePathWithName: string;
  sessionId: string;
  scratchPadContent?: string;
}

export interface Choices {
  finish_reason: string;
  index: number;
  message: ChatMessage;
}

export function codeCompletion(
  req: CodeCompletionRequest
): Promise<OpenAiResponseAndMetadata> {
  const request = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      access_token: req.session?.access_token,
      refresh_token: req.session?.refresh_token,
    },
    url: req.baseApiUrl + "/code",
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
