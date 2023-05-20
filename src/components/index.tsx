import { QueryClient, QueryClientProvider } from "react-query";
import { FilePathAndContent } from "../utils/fileSystem";
import {
  CreateDirectoryRequest,
  GetDirectoriesResponseObject,
  OpenAiResponseAndMetadata,
} from "../api";

import {
  AiCompletedCodeContextWrapper,
  CodeCompletionContextWrapper,
  DirectoryContextWrapper,
  MessageContextWrapper,
  ScratchPadContextWrapper,
  SessionContextWrapper,
} from "../context";

import MainPage from "./MainPage";
import { FileUploadContextWrapper } from "../context/fileUpdateContext";
import { SearchContextWrapper } from "../context/searchContext";
import { PromptContextWrapper } from "../context/promptContext";
import { CreatePullRequestOptions } from "../utils/gitCommands";
import { OpenWindowOptions } from "../utils/openWindow";

export type getEnvVariables = {
  baseApiUrl: string;
  supabaseUrl: string;
  supabaseAnon: string;
};

declare global {
  interface Window {
    api: {
      createOrUpdateFile: (response: OpenAiResponseAndMetadata) => Promise<any>;
      getEnvVariables: () => Promise<getEnvVariables>;
      getFile: (path: string) => string;
      getAndParseDirectories: (directory: {
        file_path: string;
      }) => Promise<FilePathAndContent[]>;
      selectFolder: () => Promise<string>;
      reload: () => Promise<void>;
      updateChangedFile: (path: string) => Promise<{
        files: string;
        untrackedFiles: string[];
      }>;
      createPr: (options: CreatePullRequestOptions) => Promise<any>;
      openWindow: (options: OpenWindowOptions) => Promise<any>;
    };
  }
}

const App = () => {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <SessionContextWrapper>
        <PromptContextWrapper>
          <DirectoryContextWrapper>
            <ScratchPadContextWrapper>
              <FileUploadContextWrapper>
                <SearchContextWrapper>
                  <CodeCompletionContextWrapper>
                    <AiCompletedCodeContextWrapper>
                      <MessageContextWrapper>
                        <MainPage />
                      </MessageContextWrapper>
                    </AiCompletedCodeContextWrapper>
                  </CodeCompletionContextWrapper>
                </SearchContextWrapper>
              </FileUploadContextWrapper>
            </ScratchPadContextWrapper>
          </DirectoryContextWrapper>
        </PromptContextWrapper>
      </SessionContextWrapper>
    </QueryClientProvider>
  );
};

export default App;
