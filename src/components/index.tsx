import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider, useMutation } from "react-query";
import { parseReturnedCode } from "../utils/parsingReturnedCode";
import {
  codeCompletion,
  CodeCompletionDetails,
  CodeDirectory,
  OpenAiResponseAndMetadata,
  startChat,
} from "../api/apiCalls";
import { getFunnyErrorMessage } from "../utils/awayMessages";
import ChatHeader from "./chatHeader";
import ChatHistory, { ChatUserType } from "./chatHistory";
import ChatInput from "./chatInput";
import { deserializeJson } from "./deserialize";
import LoginForm from "./Login";
import ScratchPadContainer from "./scratchPadContainer";
import ScratchPadHeader from "./scratchPadHeader";

declare global {
  interface Window {
    api: {
      createOrUpdateFile: (response: OpenAiResponseAndMetadata) => Promise<any>;
      getBaseApiUrl: () => Promise<string>;
      getFile: (path: string) => Promise<string>;
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

const testCodeCompletion = {
  projectFile: "h3.ts",
  requiredFunctionality:
    "Write a typescript function that takes a string returns and new string with // in front of each of the folling words: html, tsx, jsx, ts, js, typescript, javascript. So it would like like this: //html //tsx //jsx //ts //j",
};

const testCodeDirectory = {
  projectDirectory: "/Users/kg/Repos/exo-client/src/components",
  refactorExistingCode: false,
};

const test = false;

const _App = () => {
  const [baseApiUrl, setBaseApiUrl] = useState(
    "https://code-gen-server.herokuapp.com"
  );

  const [session, setSession] = useState(null);
  const [loginErrorMessage, setLoginErrorMessage] = useState(null);
  const [history, setHistory] = useState(startingHistory);
  const [code, setCode] = useState("");
  const [isCodeCompletion, setIsCodeCompletion] = useState(true);
  const [loading, setLoading] = useState(false);
  const [codeDetails, setCodeDetails] = useState<CodeCompletionDetails>(
    test
      ? testCodeCompletion
      : {
          projectFile: "",
          requiredFunctionality: "",
        }
  );

  const [codeDirectory, setCodeDirectory] = useState<CodeDirectory>(
    test
      ? testCodeDirectory
      : {
          projectDirectory: "",
          refactorExistingCode: null,
        }
  );

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

  const chat = useMutation(startChat, {
    onSuccess: (data) => {
      if (data.code) {
        setCode(data.code);
      }
      setHistory([...history, data]);
    },
  });

  function directoryComplete(): boolean {
    return (
      codeDirectory.projectDirectory &&
      codeDirectory.refactorExistingCode !== null
    );
  }

  const useCodeCompletion = useMutation(codeCompletion, {
    onSuccess: async (res) => {
      const { openAiResponse, metadata } = res;
      const { choices } = openAiResponse;
      const message = choices[0]?.message;

      if (metadata && metadata.type) {
        await window.api.createOrUpdateFile(res);

        const content = openAiResponse.choices[0].message?.content
          ? openAiResponse.choices[0].message?.content
          : "";

        message.content = parseReturnedCode(content, "message");
        setCodeDetails({ ...codeDetails, requiredFunctionality: "" });
      } else if (message && message.content) {
        const found = deserializeJson(message.content);
        if (found) {
          if (directoryComplete()) {
            setCodeDetails(found);
          } else {
            setCodeDirectory(found);
          }
        }
      }

      setHistory([...history, message]);
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

  const handleChatMutation = async (value: string) => {
    const helpfulAssistent = {
      role: ChatUserType.system,
      content: "You are a helpful assistant",
    };
    const newHistory = [
      helpfulAssistent,
      ...history,
      { role: ChatUserType.user, content: value },
    ];
    setLoading(true);
    chat.mutate({ history: newHistory, baseApiUrl, session });
  };

  const handleCodeChatMutation = async (value: string) => {
    setLoading(true);
    const { projectFile } = codeDetails;
    const { projectDirectory, refactorExistingCode } = codeDirectory;

    let codeContent = "";
    if (refactorExistingCode) {
      try {
        codeContent = await window.api.getFile(
          projectDirectory + "/" + projectFile
        );
      } catch {
        setHistory([
          ...history,
          {
            role: ChatUserType.assistant,
            content:
              "I can't find that file. Can you confirm you have the correct directory and file name?",
          },
        ]);
        setLoading(false);
        return;
      }
    }

    const newHistory = [
      ...history,
      { role: ChatUserType.user, content: value },
    ];

    useCodeCompletion.mutate({
      messages: newHistory,
      codeDirectory,
      codeDetails,
      baseApiUrl,
      session,
      codeContent,
    });
  };

  function clearItem(item: string) {
    if (item === "projectDirectory") {
      setCodeDirectory({ ...codeDirectory, projectDirectory: "" });
    } else if (item === "refactorExistingCode") {
      setCodeDirectory({ ...codeDirectory, refactorExistingCode: null });
    } else if (item === "projectFile") {
      setCodeDetails({ ...codeDetails, projectFile: "" });
    } else if (item === "requiredFunctionality") {
      setCodeDetails({ ...codeDetails, requiredFunctionality: "" });
    }
  }

  async function handleSubmit(value: string) {
    await setHistory([...history, { role: ChatUserType.user, content: value }]);
    if (isCodeCompletion) {
      handleCodeChatMutation(value);
    } else {
      handleChatMutation(value);
    }
  }

  useEffect(() => {
    const { projectDirectory, refactorExistingCode } = codeDirectory;
    if (projectDirectory && refactorExistingCode !== null) {
      setTimeout(() => {
        setHistory([
          ...history,
          {
            role: ChatUserType.assistant,
            content: refactorExistingCode
              ? "Which file would you like to refactor?"
              : "So you want to create a new file in your directory, what is the name of the file?",
          },
        ]);
      }, 2000);
    }
  }, [codeDirectory]);

  useEffect(() => {
    if (
      codeDirectory.refactorExistingCode === false &&
      codeDetails.projectFile &&
      codeDetails.requiredFunctionality
    ) {
      // Start the code completion
      setTimeout(() => {
        setHistory([
          ...history,
          {
            role: ChatUserType.assistant,
            content:
              "Do you want me to create this file with this functionality?",
          },
        ]);
      }, 2000);
    }
  }, [codeDetails]);

  async function getSession() {
    const returnedSession = await supabase.auth.getSession();

    setSession(returnedSession.data.session);
  }

  useEffect(() => {
    if (window) {
      window.api.getBaseApiUrl().then((res) => {
        setBaseApiUrl(res);
      });
      getSession();
    }
  }, [window]);

  return (
    <div>
      {session && (
        <div className="min-w-full border rounded grid grid-cols-2 gap-4  divide-x">
          <div>
            <ChatHeader handleLogout={handleLogout} />
            <ChatHistory history={history} loading={loading} />
            <ChatInput handleSubmit={handleSubmit} />
          </div>
          <div>
            <ScratchPadHeader />
            <ScratchPadContainer
              codeDirectory={codeDirectory}
              codeDetails={codeDetails}
              clearItem={clearItem}
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
