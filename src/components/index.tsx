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
    };
  }
}

const App = () => {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <SessionContextWrapper>
        <DirectoryContextWrapper>
          <ScratchPadContextWrapper>
            <FileUploadContextWrapper>
              <CodeCompletionContextWrapper>
                <AiCompletedCodeContextWrapper>
                  <MessageContextWrapper>
                    <MainPage />
                  </MessageContextWrapper>
                </AiCompletedCodeContextWrapper>
              </CodeCompletionContextWrapper>
            </FileUploadContextWrapper>
          </ScratchPadContextWrapper>
        </DirectoryContextWrapper>
      </SessionContextWrapper>
    </QueryClientProvider>
  );
};

export default App;
