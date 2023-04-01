import { QueryClient, QueryClientProvider } from "react-query";
import { OpenAiResponseAndMetadata } from "../api";

import {
  AiCompletedCodeContextWrapper,
  CodeCompletionContextWrapper,
  DirectoryContextWrapper,
  MessageContextWrapper,
  ScratchPadContextWrapper,
  SessionContextWrapper,
} from "../context";

import MainPage from "./MainPage";

declare global {
  interface Window {
    api: {
      createOrUpdateFile: (response: OpenAiResponseAndMetadata) => Promise<any>;
      getBaseApiUrl: () => Promise<string>;
      getFile: (path: string) => string;
      getAndParseDirectories: (path: string) => string[];
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
            <CodeCompletionContextWrapper>
              <AiCompletedCodeContextWrapper>
                <MessageContextWrapper>
                  <MainPage />
                </MessageContextWrapper>
              </AiCompletedCodeContextWrapper>
            </CodeCompletionContextWrapper>
          </ScratchPadContextWrapper>
        </DirectoryContextWrapper>
      </SessionContextWrapper>
    </QueryClientProvider>
  );
};

export default App;
