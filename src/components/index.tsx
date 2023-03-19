
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import ChatHeader from './chatHeader';
import ChatHistory, { ChatUserType } from './chatHistory';
import ChatInput from './chatInput';
import ScratchPadHeader from './scratchPadHeader';
import { QueryClient, QueryClientProvider, useQuery, useMutation } from 'react-query'
import { codeCompletion, CodeCompletionDetails, CodeDirectory, fetchThings, runCodeParsing, startChat } from '../api/apiCalls';
import ScratchPadContainer from './scratchPadContainer';
import { deserializeJson } from './deserialize';


declare global {
  interface Window {
    api: {
      testInvoke: (arg: any) => Promise<any>
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
  const [codeDetails, setCodeDetails] = useState<CodeCompletionDetails>({
    projectFile: "",
    requiredFunctionality: ""
  })

  const [codeDirectory, setCodeDirectory] = useState<CodeDirectory>({
    projectDirectory: "",
    refactorExistingCode: null,
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
    onSuccess: (res) => {

      const found = deserializeJson(res.content)
      if (found) {

        if (directoryComplete()) {
          setCodeDetails(found)
        } else {
          setCodeDirectory(found)
        }

      }

      setHistory([...history, res])
    },
  })

  const handleChatMutation = async (value: string) => {
    const helpfulAssistent = {
      role: ChatUserType.system,
      content: "You are a helpful assistant"
    }
    const newHistory = [helpfulAssistent, ...history, { role: ChatUserType.user, content: value }]

    chat.mutate(newHistory)
  }


  const handleCodeChatMutation = async (value: string) => {

    const newHistory = [...history, { role: ChatUserType.user, content: value }]

    useCodeCompletion.mutate({ messages: newHistory, codeDirectory, codeDetails })

  }

  // const response = useQuery('todo', runCodeParsing)


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
  }, [])

  useEffect(() => {

    if (codeDirectory.projectDirectory && codeDirectory.refactorExistingCode === false) {
      console.log("We have the answer!")
      // Start the code completion
      setTimeout(() => {
        setHistory([...history, { role: ChatUserType.assistant, content: "So you want to create a new file in your directory..." }])
      }, 2000)

    }
  }, [codeDirectory])

  useEffect(() => {

    if (codeDetails.projectFile && codeDetails.requiredFunctionality) {
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
          <ChatHistory history={history} />
          <ChatInput handleSubmit={handleSubmit} />
        </div>
        <div  >
          <ScratchPadHeader />
          <ScratchPadContainer codeDirectory={codeDirectory} codeDetails={codeDetails} />
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


