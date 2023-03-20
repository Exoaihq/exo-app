
import { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider, useMutation } from 'react-query';
import { codeCompletion, CodeCompletionDetails, CodeDirectory, OpenAiResponseAndMetadata, startChat } from '../api/apiCalls';
import ChatHeader from './chatHeader';
import ChatHistory, { ChatUserType } from './chatHistory';
import ChatInput from './chatInput';
import { deserializeJson } from './deserialize';
import ScratchPadContainer from './scratchPadContainer';
import ScratchPadHeader from './scratchPadHeader';


declare global {
  interface Window {
    api: {
      testInvoke: (arg: any) => Promise<any>,
      createOrUpdateFile: (response: OpenAiResponseAndMetadata) => Promise<any>,
    },
  }
}

const queryClient = new QueryClient()

const startingHistory = [
  {
    role: ChatUserType.assistant,
    content: "Hi Kevin! I'm your assistant, Mia. How can I help you today?"
  },
]

const directory = "/Users/kg/Repos/code-gen-server/example"

const _App = () => {

  const initialState = {
    projectFile: "",
    requiredFunctionality: ""
  }

  const [history, setHistory] = useState(startingHistory)
  const [code, setCode] = useState("")
  const [isCodeCompletion, setIsCodeCompletion] = useState(true)
  const [loading, setLoading] = useState(false)
  const [codeDetails, setCodeDetails] = useState<CodeCompletionDetails>({
    projectFile: "icon.ts",
    requiredFunctionality: "Write a react component that adds a small x icon to a paragraph tag to clear the content."
  })

  const [codeDirectory, setCodeDirectory] = useState<CodeDirectory>({
    projectDirectory: "/Users/kg/Repos/code-gen-server/example",
    refactorExistingCode: false,
  })

  const chat = useMutation(startChat, {
    onSuccess: (data) => {
      if (data.code) {
        setCode(data.code)
      }
      setHistory([...history, data])
    },
  })

  function directoryComplete(): boolean {
    return codeDirectory.projectDirectory && codeDirectory.refactorExistingCode !== null
  }


  const useCodeCompletion = useMutation(codeCompletion, {
    onSuccess: async (res) => {


      const { openAiResponse, metadata } = res
      const { choices } = openAiResponse
      let message = choices[0]?.message

      if (metadata && metadata.type) {
        await window.api.createOrUpdateFile(res)

        const content = openAiResponse.choices[0].message?.content ? openAiResponse.choices[0].message?.content : ""
        const splitOnQuotes = content.split("```")
        message.content = splitOnQuotes[0]
      } else {
        const found = deserializeJson(message.content)
        if (found) {
  
          if (directoryComplete()) {
            setCodeDetails(found)
          } else {
            setCodeDirectory(found)
          }
        }
      }

     
      setHistory([...history, message])
    },
    onSettled: () => {
      setLoading(false)
    }
  })

  const handleChatMutation = async (value: string) => {
    const helpfulAssistent = {
      role: ChatUserType.system,
      content: "You are a helpful assistant"
    }
    const newHistory = [helpfulAssistent, ...history, { role: ChatUserType.user, content: value }]
    setLoading(true)
    chat.mutate(newHistory)
  }


  const handleCodeChatMutation = async (value: string) => {
    setLoading(true)
    const newHistory = [...history, { role: ChatUserType.user, content: value }]

    useCodeCompletion.mutate({ messages: newHistory, codeDirectory, codeDetails })

  }


  function clearItem(item: string) {
    if (item === "projectDirectory") {
      setCodeDirectory({ ...codeDirectory, projectDirectory: "" })
    } else if (item === "refactorExistingCode") {
      setCodeDirectory({ ...codeDirectory, refactorExistingCode: null })
    } else if (item === "projectFile") {
      setCodeDetails({ ...codeDetails, projectFile: "" })
    } else if (item === "requiredFunctionality") {
      setCodeDetails({ ...codeDetails, requiredFunctionality: "" })
    }
  }



  async function handleSubmit(value: string) {
    await setHistory([...history, { role: ChatUserType.user, content: value }])
    if (isCodeCompletion) {
      handleCodeChatMutation(value)
    } else {
      handleChatMutation(value)
    }
  }

  async function getProfile() {
    const profile = await window.api.testInvoke({ test: "test test test" })
  }

  useEffect(() => {
    getProfile()
  }, [codeDirectory])

  useEffect(() => {

    if (codeDirectory.projectDirectory && codeDirectory.refactorExistingCode === false) {
      setTimeout(() => {
        setHistory([...history, { role: ChatUserType.assistant, content: "So you want to create a new file in your directory..." }])
      }, 2000)

    }
  }, [codeDirectory])

  useEffect(() => {

    if (codeDirectory.refactorExistingCode === false && codeDetails.projectFile && codeDetails.requiredFunctionality) {
      console.log("We have this file and functionality!")
      // Start the code completion
      setTimeout(() => {
        setHistory([...history, { role: ChatUserType.assistant, content: "Do you want me to create this file with this functionality?" }])
      }, 2000)
    }
  }, [codeDetails])

  return (
    <div >

      <div className="min-w-full border rounded grid grid-cols-2 gap-4  divide-x">

        <div >
          <ChatHeader />
          <ChatHistory history={history} loading={loading} />
          <ChatInput handleSubmit={handleSubmit} />
        </div>
        <div  >
          <ScratchPadHeader />
          <ScratchPadContainer codeDirectory={codeDirectory} codeDetails={codeDetails} clearItem={clearItem} />
          <div className='max-w-md'>
            {code && <pre>{JSON.stringify(code, null, 2)}</pre>}
          </div>
        </div>
      </div>

    </div >
  );
};

const App = () => {
  return <QueryClientProvider client={queryClient}>
    <_App />
  </QueryClientProvider>
}

export default App;


