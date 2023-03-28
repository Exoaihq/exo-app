import { ChatMessage } from "../components/chatHistory";

export function fetchThings(baseUrl: string) {
  const request = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    url: baseUrl,
  };

  return fetch(request.url, request).then((res) => res.json());
}

export function runCodeParsing(baseUrl: string) {
  const request = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    url: baseUrl + "/code-snippet/parse-nodes",
  };

  return fetch(request.url, request).then((res) => res.json());
}

export interface StartChatRequest {
  history: ChatMessage[];
  baseApiUrl: string;
  session: any;
}

export function startChat(req: StartChatRequest) {
  const request = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      access_token: req.session?.access_token,
      refresh_token: req.session?.refresh_token,
    },
    url: req.baseApiUrl + "/chat",
    body: JSON.stringify({
      history: req.history,
    }),
  };

  return fetch(request.url, request)
    .then((res) => res.json())
    .then((res) => {
      const { type, data } = res;

      return data;
    });
}

export interface CodeCompletionDetails {
  projectFile: string;
  requiredFunctionality: string;
}

export interface CodeDirectory {
  projectDirectory: string;
  newFile: boolean;
}

export interface GetMessagesRequest {
  baseApiUrl: string;
  session: any;
}

export interface CreateMessagesRequest {
  baseApiUrl: string;
  session: any;
  message: ChatMessage;
  sessionId: string;
}

export interface CodeCompletionRequest {
  messages: ChatMessage[];
  baseApiUrl: string;
  session: any;
  codeContent: string;
  fullFilePathWithName: string;
  sessionId: string;
}

export interface Choices {
  finish_reason: string;
  index: number;
  message: ChatMessage;
}

export interface OpenAiResponseObject {
  id: string;
  choices: Choices[];
}

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
}

export interface CodeCompletionResponse {
  data: OpenAiResponseAndMetadata;
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
      messages: req.messages,
      codeContent: req.codeContent,
      fullFilePathWithName: req.fullFilePathWithName,
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
    .then((res: CodeCompletionResponse) => {
      const { data } = res;
      return data;
    })
    .catch((err) => {
      throw new Error(err);
    });
}

export function getMessages(req: GetMessagesRequest): Promise<any> {
  const request = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      access_token: req.session?.access_token,
      refresh_token: req.session?.refresh_token,
    },
    url: req.baseApiUrl + "/messages",
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

export function createMessage(req: CreateMessagesRequest): Promise<any> {
  const request = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      access_token: req.session?.access_token,
      refresh_token: req.session?.refresh_token,
    },
    url: req.baseApiUrl + "/messages",
    body: JSON.stringify({ message: req.message, sessionId: req.sessionId }),
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
