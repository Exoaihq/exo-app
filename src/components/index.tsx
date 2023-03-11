
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import ChatHeader from './chatHeader';
import ChatHistory, { ChatUserType } from './chatHistory';
import ChatInput from './chatInput';
import ScratchPadHeader from './scratchPadHeader';
import { QueryClient, QueryClientProvider, useQuery, useMutation } from 'react-query'
import { fetchThings, startChat } from '../api/apiCalls';


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
    content: "Hi Kevin! I'm your assistant, Mia. How can I help you?"
  },
]

const _App = () => {

  const info = useQuery('todos', fetchThings)

  const [history, setHistory] = useState(startingHistory)
  const [code, setCode] = useState("\n\nimport * as React from \"react\";\nimport {\n  Button,\n  Form,\n  FormGroup,\n  Label,\n  Input,\n  FormText,\n  Row,\n  Col\n} from \"reactstrap\";\n\ninterface Props {}\n\ninterface State {\n  email: string;\n  password: string;\n}\n\nexport class Login extends React.Component<Props, State> {\n  constructor(props: Props) {\n    super(props);\n    this.state = {\n      email: \"\",\n      password: \"\"\n    };\n  }\n\n  handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {\n    e.preventDefault();\n    const { email, password } = this.state;\n    console.log(email, password);\n  };\n\n  handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {\n    const { name, value } = e.target;\n    this.setState({\n      [name]: value\n    } as any);\n  };\n\n  render() {\n    const { email, password } = this.state;\n    return (\n      <Row>\n        <Col sm=\"12\" md={{ size: 6, offset: 3 }}>\n          <h2>Login</h2>\n          <Form onSubmit={this.handleSubmit}>\n            <FormGroup>\n              <Label for=\"email\">Email</Label>\n              <Input\n                type=\"email\"\n                name=\"email\"\n                id=\"email\"\n                placeholder=\"with a placeholder\"\n                value={email}\n                onChange={this.handleChange}\n              />\n            </FormGroup>\n            <FormGroup>\n              <Label for=\"password\">Password</Label>\n              <Input\n                type=\"password\"\n                name=\"password\"\n                id=\"password\"\n                placeholder=\"password placeholder\"\n                value={password}\n                onChange={this.handleChange}\n              />\n            </FormGroup>\n            <Button>Submit</Button>\n          </Form>\n        </Col>\n      </Row>\n    );\n  }\n}")

  const mutation = useMutation(startChat, {
    onSuccess: (data) => {
      if (data.code) {
        setCode(data.code)
      }
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

  async function getProfile() {
    const profile = await window.api.testInvoke({ test: "test test test" })
  }

  useEffect(() => {
    getProfile()
  }, [])

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