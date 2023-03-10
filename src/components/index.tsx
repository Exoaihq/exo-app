
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import ChatHeader from './chatHeader';
import ChatHistory from './chatHistory';
import ChatInput from './chatInput';
import ScratchPadHeader from './scratchPadHeader';

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


const App = () => {

  const [history, setHistory] = useState(startingHistory)

  function handleSubmit(value: string) {
    setHistory([...history, { type: "user", message: value }, { type: "bot", message: "I'm thinking....." }])
  }

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

export default App;