import { Choices } from ".";

export interface CodeCompletionDetails {
  projectFile: string;
  requiredFunctionality: string;
}

export interface CodeDirectory {
  projectDirectory: string;
  newFile: boolean;
}

export interface OpenAiResponseObject {
  id: string;
  choices: Choices[];
}

export enum ApiRoutes {
  CODE_DIRECTORY = "/code-directory",
  MESSAGES = "/messages",
  CODE_COMPLETION = "/code",
  AI_COMPLETED_CODE = "/ai-completed-code",
  AGENT = "/agent",
  CODE_FILE = "/code-file",
  TASK = "/task",
}
