import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider, useMutation } from "react-query";
import {
  codeCompletion,
  CodeCompletionDetails,
  CodeDirectory,
  OpenAiResponseAndMetadata,
  startChat,
} from "../api/apiCalls";
import ChatHeader from "./chatHeader";
import ChatHistory, { ChatUserType } from "./chatHistory";
import ChatInput from "./chatInput";
import { deserializeJson } from "./deserialize";
import ScratchPadContainer from "./scratchPadContainer";
import ScratchPadHeader from "./scratchPadHeader";

declare global {
  interface Window {
    api: {
      createOrUpdateFile: (response: OpenAiResponseAndMetadata) => Promise<any>;
      getBaseApiUrl: () => Promise<string>;
    };
  }
}

const queryClient = new QueryClient();

const startingHistory = [
  {
    role: ChatUserType.assistant,
    content: "Hi Kevin! I'm your assistant, Mia. How can I help you today?",
  },
];

const _App = () => {
  const [baseApiUrl, setBaseApiUrl] = useState(
    "https://code-gen-server.herokuapp.com"
  );
  const [history, setHistory] = useState(startingHistory);
  const [code, setCode] = useState("");
  const [isCodeCompletion, setIsCodeCompletion] = useState(true);
  const [loading, setLoading] = useState(false);
  const [codeDetails, setCodeDetails] = useState<CodeCompletionDetails>({
    projectFile: "",
    requiredFunctionality: "",
  });

  const [codeDirectory, setCodeDirectory] = useState<CodeDirectory>({
    projectDirectory: "",
    refactorExistingCode: null,
  });

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
      let message = choices[0]?.message;

      if (metadata && metadata.type) {
        await window.api.createOrUpdateFile(res);

        const content = openAiResponse.choices[0].message?.content
          ? openAiResponse.choices[0].message?.content
          : "";
        const splitOnQuotes = content.split("```");
        message.content = splitOnQuotes[0];
      } else {
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
    chat.mutate(newHistory);
  };

  const handleCodeChatMutation = async (value: string) => {
    setLoading(true);
    const newHistory = [
      ...history,
      { role: ChatUserType.user, content: value },
    ];

    useCodeCompletion.mutate({
      messages: newHistory,
      codeDirectory,
      codeDetails,
      baseApiUrl,
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
    if (
      codeDirectory.projectDirectory &&
      codeDirectory.refactorExistingCode === false
    ) {
      setTimeout(() => {
        setHistory([
          ...history,
          {
            role: ChatUserType.assistant,
            content: "So you want to create a new file in your directory...",
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
      console.log("We have this file and functionality!");
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

  useEffect(() => {
    if (window) {
      window.api.getBaseApiUrl().then((res) => {
        setBaseApiUrl(res);
      });
    }
  }, [window]);

  return (
    <div>
      <div className="min-w-full border rounded grid grid-cols-2 gap-4  divide-x">
        <div>
          <ChatHeader />
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
          <div className="max-w-md">
            {code && <pre>{JSON.stringify(code, null, 2)}</pre>}
          </div>
        </div>
      </div>
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
