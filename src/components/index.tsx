
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import ChatHeader from './chatHeader';
import ChatHistory, { ChatUserType } from './chatHistory';
import ChatInput from './chatInput';
import ScratchPadHeader from './scratchPadHeader';
import { QueryClient, QueryClientProvider, useQuery, useMutation } from 'react-query'
import { fetchThings, startChat } from '../api/apiCalls';


const queryClient = new QueryClient()

const startingHistory = [
  {
    role: ChatUserType.assistant,
    content: "Hi"
  },
  {
    role: ChatUserType.user,
    content: "Hiiii"
  },
  {
    role: ChatUserType.assistant,
    content: "How is your day?"
  }
]


const _App = () => {

  const info = useQuery('todos', fetchThings)

  const [history, setHistory] = useState(startingHistory)

  const mutation = useMutation(startChat, {
    onSuccess: (data) => {
      // Invalidate and refetch
      // queryClient.invalidateQueries('todos')
      console.log(data)
      console.log(...history)
      setHistory([...history, data])
    },
  })

  const handleMutation = async (value: string) => {
    const helpfulAssistent = {
      role: ChatUserType.system,
      content: "You are a helpful assistant"
    }
    const newHistory = [helpfulAssistent, ...history, { role: ChatUserType.user, content: value }]

    mutation.mutate(newHistory)
  }

  async function handleSubmit(value: string) {
    await setHistory([...history, { role: ChatUserType.user, content: value }])

    handleMutation(value)
  }

  // useEffect(() => {

  //   if (chat.data) {
  //     console.log(chat.data)
  //   }

  // }, [chat])

  return (
    <div >

      <div className="min-w-full border rounded grid grid-cols-2 gap-4  divide-x">

        <div >
          <ChatHeader />
          <ChatHistory history={history} />
          <ChatInput handleSubmit={handleSubmit} />
        </div>
        <div >
          <ScratchPadHeader />
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