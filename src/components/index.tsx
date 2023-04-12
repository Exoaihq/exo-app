import { QueryClient, QueryClientProvider } from "react-query";
import { FilePathAndContent } from "../utils/fileSystem";
import {
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

declare global {
  interface Window {
    api: {
      createOrUpdateFile: (response: OpenAiResponseAndMetadata) => Promise<any>;
      getBaseApiUrl: () => Promise<string>;
      getFile: (path: string) => string;
      getAndParseDirectories: (
        directory: GetDirectoriesResponseObject
      ) => Promise<FilePathAndContent[]>;
      selectFolder: () => Promise<string>;
      reload: () => Promise<void>;
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
