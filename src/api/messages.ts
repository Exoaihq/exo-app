export interface GetMessagesRequest {
  baseApiUrl: string;
  session: any;
  sessionId: string;
}

export interface CreateMessagesRequest {
  baseApiUrl: string;
  session: any;
  message: ChatMessage;
  sessionId: string;
}

export enum ChatUserType {
  system = "system",
  user = "user",
  assistant = "assistant",
}

export interface ChatMessage {
  role: ChatUserType;
  content: string;
  created_location?: string;
  created_at?: string;
  message_prompts?: MessagePrompts[];
  id?: string;
}

export interface MessagePrompts {
  body: string;
  id: string;
  created_at: string;
  name: string;
  description: string;
  prefix: string;
  suffix: string;
}

export interface ChatMessageResponse {
  data: ChatMessage[];
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

export function getMessages(req: GetMessagesRequest): Promise<ChatMessage[]> {
  const request = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      access_token: req.session?.access_token,
      refresh_token: req.session?.refresh_token,
      session_id: req.sessionId,
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
    .then((res: ChatMessageResponse) => {
      const { data } = res;
      return data;
    })
    .catch((err) => {
      throw new Error(err);
    });
}
