import { Fragment } from "react"

export interface ChatHistoryProps {
    type: string;
    message: string;
}


function ChatHistory({ history }: { history: ChatHistoryProps[] }) {

    return (
        <div className="relative w-full p-6 overflow-y-auto h-[40rem]">
            <ul className="space-y-2">
                {history.map((item, index) => {

                    const line = item.type === "bot" ? <li className="flex justify-start">
                        <div className="relative max-w-xl px-4 py-2 text-gray-700 rounded shadow">
                            <span className="block">{item.message}
                            </span>
                        </div>
                    </li> : <li className="flex justify-end">
                        <div className="relative max-w-xl px-4 py-2 text-gray-700 bg-gray-100 rounded shadow">
                            <span className="block">{item.message}</span>
                        </div>
                    </li>
                    return line
                })}

            </ul>
        </div>
    )
}

export default ChatHistory