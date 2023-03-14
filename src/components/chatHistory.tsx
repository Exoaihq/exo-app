import { Fragment, useEffect, useRef } from "react"

export enum ChatUserType {
    system = "system",
    user = "user",
    assistant = "assistant"
}

export interface ChatMessage {
    role: ChatUserType;
    content: string;
}


function ChatHistory({ history }: { history: ChatMessage[] }) {
    const messagesEndRef = useRef(null)

    function scrollToBottom() {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [history])

    return (
        <div className="relative w-full p-6 overflow-y-auto h-[40rem]">

            <ul className="space-y-2 h-full">
                {history.map((item, index) => {

                    const line = item.role === ChatUserType.assistant ? <li className="flex justify-start">
                        <div className="relative max-w-xl px-4 py-2 text-gray-700 rounded shadow">
                            <span className="block">{item.content}
                            </span>
                        </div>
                    </li> : <li className="flex justify-end">
                        <div className="relative max-w-xl px-4 py-2 text-gray-700 bg-gray-100 rounded shadow">
                            <span className="block">{item.content}</span>
                        </div>
                    </li>
                    return line
                })}

            </ul>
            <div style={{ float: "left", clear: "both" }}
                ref={messagesEndRef}>
            </div>
        </div>
    )
}

export default ChatHistory

