import { ChatMessage, ChatUserType } from "../components/chatHistory"



export function fetchThings() {

    const request = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        url: 'http://localhost:8081/'
    }

    return fetch(request.url, request)
        .then(res => res.json())
}

export function runCodeParsing() {

    const request = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        url: 'http://localhost:8081/code-snippet/parse-nodes'
    }

    return fetch(request.url, request)
        .then(res => res.json())
}


export function startChat(history: ChatMessage[]) {

    const request = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        url: 'http://localhost:8081/chat',
        body: JSON.stringify(history)
    }

    return fetch(request.url, request)
        .then(res => res.json())
        .then(res => {
            const { type, data } = res

            return data
        })
}


export interface CodeCompletionDetails {
    projectFile: string,
    requiredFunctionality: string
}

export interface CodeDirectory {
    projectDirectory: string,
    refactorExistingCode: boolean
}

export interface CodeCompletionRequest {
    messages: ChatMessage[],
    codeDirectory: CodeDirectory,
    codeDetails: CodeCompletionDetails
}

export interface Choices {
    finish_reason: string,
    index: number,
    message: ChatMessage,
}

export interface CodeCompletionResponseObject {
    id: string,
    choices: Choices[],
}

export interface CodeCompletionResponse {
    data: CodeCompletionResponseObject
}

export function codeCompletion(req: CodeCompletionRequest): Promise<ChatMessage> {

    const request = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        url: 'http://localhost:8081/code',
        body: JSON.stringify(req)
    }

    return fetch(request.url, request)
        .then(res => res.json())
        .then((res: CodeCompletionResponse) => {
            const { data } = res
            console.log(data)

            return data.choices[0].message
        })
}


