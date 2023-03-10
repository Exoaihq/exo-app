
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import ChatHeader from './chatHeader';
import ChatHistory from './chatHistory';
import ChatInput from './chatInput';
import ScratchPadHeader from './scratchPadHeader';
import { QueryClient, QueryClientProvider, useQuery } from 'react-query'


const queryClient = new QueryClient()

const startingHistory = [
  {
    type: "bot",
    message: "Hi"
  },
  {
    type: "user",
    message: "Hiiii"
  },
  {
    type: "bot",
    message: "How is your day?"
  }
]

function fetchThings() {

  const request = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    url: 'http://localhost:8081/'
  }

  return fetch(request.url, request)
    .then(res => res.json())
}


const _App = () => {

  const info = useQuery('todos', fetchThings)

  const [history, setHistory] = useState(startingHistory)

  function handleSubmit(value: string) {
    setHistory([...history, { type: "user", message: value }, { type: "bot", message: "I'm thinking....." }])
  }

  useEffect(() => {

    if (info.data) {
      console.log(info.data.hello)
    }

  }, [info])

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