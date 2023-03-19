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


function ScratchPadContainer(props: { codeDirectory: CodeDirectory, codeDetails: CodeCompletionDetails }) {
    const messagesEndRef = useRef(null)

    const { projectDirectory, refactorExistingCode } = props.codeDirectory
    const { requiredFunctionality, projectFile } = props.codeDetails

    function scrollToBottom() {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [history])

    return (
        <div className="relative w-full p-6 overflow-y-auto h-[40rem]" >

            <ul className="space-y-2 h-full" >
                <p>Project directory: {projectDirectory} </p>

                <p>Refactor: {refactorExistingCode !== null && (refactorExistingCode ? "Yes" : "No")} </p>

                {projectFile && <p>Code file: {projectFile} </p>}
                {requiredFunctionality && <p>Functionality: {requiredFunctionality} </p>}


            </ul>

        </div>
    )
}
export default ScratchPadContainer

