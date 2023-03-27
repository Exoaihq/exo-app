import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider, useMutation } from "react-query";
import { codeCompletion, OpenAiResponseAndMetadata } from "../api/apiCalls";
import { getFunnyErrorMessage } from "../utils/awayMessages";
import ChatHeader from "./chatHeader";
import ChatHistory, { ChatUserType } from "./chatHistory";
import ChatInput from "./chatInput";
import LoginForm from "./Login";
import ScratchPadContainer from "./scratchPadContainer";
import ScratchPadHeader from "./scratchPadHeader";

declare global {
  interface Window {
    api: {
      createOrUpdateFile: (response: OpenAiResponseAndMetadata) => Promise<any>;
      getBaseApiUrl: () => Promise<string>;
      getFile: (path: string) => string;
    };
  }
}

const queryClient = new QueryClient();

const supabase = createClient(
  "https://xexjtohvdexqxpomspdb.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhleGp0b2h2ZGV4cXhwb21zcGRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzgzMDg0MjYsImV4cCI6MTk5Mzg4NDQyNn0.-3oqirs2PwoAS42jmB47QE-A1GSyUBxsdLsNz_8dDgk"
);

const startingHistory = [
  {
    role: ChatUserType.assistant,
    content: "Hi! I'm your trusty Exo assistant. How can I help you today?",
  },
];

const testFile = "newFile.ts";
const testDirectory = "/Users/kg/Repos/exo-client/src/components";
const testNewFile = true;
const testRequiredFunctionality =
  "Write a typescript function that takes a string returns and new string with // in front of each of the folling words: html, tsx, jsx, ts, js, typescript, javascript. So it would like like this: //html //tsx //jsx //ts //j";

const test = false;

const _App = () => {
  const [baseApiUrl, setBaseApiUrl] = useState(
    "https://code-gen-server.herokuapp.com"
  );

  const [session, setSession] = useState(null);
  const [loginErrorMessage, setLoginErrorMessage] = useState(null);
  const [history, setHistory] = useState(startingHistory);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [projectDirectory, setProjectDirectory] = useState(
    test ? testDirectory : ""
  );
  const [projectFile, setProjectFile] = useState(test ? testFile : "");
  const [requiredFunctionality, setRequiredFunctionality] = useState(
    test ? testRequiredFunctionality : ""
  );
  const [newFile, setNewFile] = useState(test ? testNewFile : null);
  const [showFileSection, setShowFileSection] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File>(null);
  const [functionality, setFunctionality] = useState("");
  const [content, setContent] = useState("");

  function handleFileSelect(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files[0];
    setSelectedFile(file);
  }

  async function handleLogin(email: string, password: string) {
    const res = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (res.error) {
      setLoginErrorMessage(res.error.message);
    } else {
      setSession(res.data.session);
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setSession(null);
  }

  const useCodeCompletion = useMutation(codeCompletion, {
    onSuccess: async (res) => {
      setShowFileSection(true);

      const { choices, metadata, completedCode } = res;
      const { projectDirectory, projectFile, newFile, requiredFunctionality } =
        metadata;
      const messages = choices.map((choice) => {
        return {
          role: choice.message.role,
          content: choice.message.content,
        };
      });

      projectDirectory && setProjectDirectory(projectDirectory);
      projectFile && setProjectFile(projectFile);
      newFile !== null && setNewFile(newFile);
      requiredFunctionality && setRequiredFunctionality(requiredFunctionality);

      if (completedCode && selectedFile) {
        await window.api.createOrUpdateFile({
          completedCode,
          metadata: {
            projectDirectory: selectedFile.path,
            newFile: false,
            projectFile: "",
            requiredFunctionality: "",
          },
          choices: [],
        });
      } else if (completedCode) {
        await window.api.createOrUpdateFile(res);
      }

      setHistory([...history, ...messages]);
    },
    onError(error: Error) {
      console.log(error);
      setHistory([
        ...history,
        { role: ChatUserType.assistant, content: getFunnyErrorMessage() },
      ]);
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  const handleCodeChatMutation = async (
    value: string,
    contentToUpdate?: string
  ) => {
    setLoading(true);

    // The user may update the code in the file. This get the updated code
    const updatedContent = content
      ? await handleGetFile(selectedFile.path)
      : "";

    const newCode = contentToUpdate ? contentToUpdate : updatedContent;

    const newHistory = [
      ...history,
      { role: ChatUserType.user, content: value },
    ];

    useCodeCompletion.mutate({
      messages: newHistory,
      baseApiUrl,
      session,
      codeContent: newCode,
      fullFilePathWithName: selectedFile ? selectedFile.path : "",
    });
  };

  function clearItem(item: string) {
    if (item === "projectDirectory") {
      setProjectDirectory("");
    } else if (item === "newFile") {
      setNewFile(null);
    } else if (item === "projectFile") {
      setProjectFile("");
    } else if (item === "requiredFunctionality") {
      setRequiredFunctionality("");
    }
  }

  async function handleSubmit(value: string) {
    await setHistory([...history, { role: ChatUserType.user, content: value }]);

    handleCodeChatMutation(value);
  }

  async function getSession() {
    const returnedSession = await supabase.auth.getSession();

    setSession(returnedSession.data.session);
  }

  async function handleGetFile(fullpath: string) {
    return await window.api.getFile(fullpath);
  }

  useEffect(() => {
    if (window) {
      window.api.getBaseApiUrl().then((res) => {
        setBaseApiUrl(res);
      });
      getSession();
    }
  }, [window]);

  useEffect(() => {
    if (selectedFile) {
      handleGetFile(selectedFile.path).then((content) => {
        setContent(content);

        if (content) {
          handleCodeChatMutation("Here is a file I'd like to update", content);
        }
      });
    }
  }, [selectedFile]);

  return (
    <div>
      {session && (
        <div className="min-w-full border rounded grid grid-cols-2 divide-x">
          <div>
            <ChatHeader handleLogout={handleLogout} />
            <ChatHistory history={history} loading={loading} />
            <ChatInput handleSubmit={handleSubmit} />
          </div>
          <div>
            <ScratchPadHeader />
            <ScratchPadContainer
              projectDirectory={projectDirectory}
              projectFile={projectFile}
              requiredFunctionality={requiredFunctionality}
              newFile={newFile}
              clearItem={clearItem}
              showFileSection={showFileSection}
              handleFileSelect={handleFileSelect}
              selectedFile={selectedFile}
              functionality={functionality}
              setFunctionality={setFunctionality}
            />
          </div>
        </div>
      )}
      {!session && (
        <div className="flex flex-col h-screen">
          <ChatHeader handleLogout={null} />
          <LoginForm
            handleLogin={handleLogin}
            loginErrorMessage={loginErrorMessage}
          />
        </div>
      )}
    </div>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <_App />
    </QueryClientProvider>
  );
};

export default App;
