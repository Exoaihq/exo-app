import { useEffect, useRef } from "react";
import { CodeCompletionDetails, CodeDirectory } from "../api/apiCalls";

export enum ChatUserType {
    system = "system",
    user = "user",
    assistant = "assistant"
}

export interface ChatMessage {
    role: ChatUserType;
    content: string;
}

function ClearButton({ clearText }: { clearText: React.MouseEventHandler<HTMLButtonElement> }) {

    return (
        <button
            onClick={clearText}
            style={{
                position: 'relative',
                top: -5,
                right: -5,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1rem',
                color: 'red',
                lineHeight: 1,
            }}
        >
            &times;
        </button>
    )
}


function ScratchPadContainer(props: { codeDirectory: CodeDirectory, codeDetails: CodeCompletionDetails, clearItem: (item: string) => void }) {
    const messagesEndRef = useRef(null)

    const { projectDirectory, refactorExistingCode } = props.codeDirectory
    const { requiredFunctionality, projectFile } = props.codeDetails

    function scrollToBottom() {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    const clearText = (item: string) => {
        props.clearItem(item)
    };

    useEffect(() => {
        scrollToBottom()
    }, [history])

    return (
        <div className="relative w-full p-6 overflow-y-auto h-[40rem]" >

            <ul className="space-y-2 h-full" >
                {projectDirectory && <p>Project directory: {projectDirectory} <ClearButton clearText={() => clearText("projectDirectory")} /> </p>}

                {refactorExistingCode !== null && <p>Refactor: {refactorExistingCode !== null && (refactorExistingCode ? "Yes" : "No")} <ClearButton clearText={() => clearText("refactorExistingCode")} />  </p>}

                {projectFile && <p>Code file: {projectFile} <ClearButton clearText={() => clearText("projectFile")} />  </p>}
                {requiredFunctionality && <p>Functionality: {requiredFunctionality} <ClearButton clearText={() => clearText("requiredFunctionality")} />  </p>}


            </ul>

        </div>
    )
}
export default ScratchPadContainer

