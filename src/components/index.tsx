
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import ChatHeader from './chatHeader';
import ChatHistory from './chatHistory';
import ChatInput from './chatInput';

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
  },
  {
    type: "bot",
    message: "Good how is yours?"
  }
]


const App = () => {

  const [history, setHistory] = useState(startingHistory)

  function handleSubmit(value: string) {
    setHistory([...history, { type: "user", message: value }, { type: "bot", message: "I'm thinking....." }])
  }

  return (
    <div>
      <h1>Code Generation</h1>

      <div className="container mx-auto">

        <div className="min-w-full border rounded lg:grid lg:grid-cols-2">

          <div className="hidden lg:col-span-2 lg:block">
            <div className="w-full">
              <ChatHeader />
              <ChatHistory history={history} />
              <ChatInput handleSubmit={handleSubmit} />
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default App;