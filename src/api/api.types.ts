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
}
