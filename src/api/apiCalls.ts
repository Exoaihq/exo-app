import { ChatMessage } from "../components/chatHistory"


export function fetchThings(baseUrl: string) {

    const request = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        url: baseUrl
    }

    return fetch(request.url, request)
        .then(res => res.json())
}

export function runCodeParsing(baseUrl: string) {

    const request = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        url: baseUrl + '/code-snippet/parse-nodes'
    }

    return fetch(request.url, request)
        .then(res => res.json())
}


export function startChat(history: ChatMessage[], baseUrl: string) {

    const request = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        url:  baseUrl + '/chat',
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
    codeDetails: CodeCompletionDetails,
    baseApiUrl: string
}

export interface Choices {
    finish_reason: string,
    index: number,
    message: ChatMessage,
}

export interface OpenAiResponseObject {
    id: string,
    choices: Choices[],
}

export enum CodeCompletionResponseType {
    newFile = "newFile",
    updateFile = "updateFile",
}

export interface CodeCompletionResponseMetadata {
    type: CodeCompletionResponseType | undefined
    projectDirectory: string,
    projectFile: string,
}


export interface OpenAiResponseAndMetadata {
    openAiResponse: OpenAiResponseObject,
    metadata: CodeCompletionResponseMetadata
}

export interface CodeCompletionResponse {
    data: OpenAiResponseAndMetadata
}


export function codeCompletion(req: CodeCompletionRequest): Promise<OpenAiResponseAndMetadata> {

    const request = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        url: req.baseApiUrl + '/code',
        body: JSON.stringify({
            messages: req.messages,
            codeDirectory: req.codeDirectory,
            codeDetails: req.codeDetails
        })
    }

    return fetch(request.url, request)
        .then(res => res.json())
        .then((res: CodeCompletionResponse) => {
            const { data } = res

            return data
        })
}


