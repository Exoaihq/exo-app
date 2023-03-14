import { ChatMessage, ChatUserType } from "../components/chatHistory"


function formatResponse(response: any, type: string) {
    switch (type) {
        case 'code':
            return {
                role: ChatUserType.assistant,
                content: response.choices[0].text,
                code: response.choices[0].code
            }
        case 'chat':
            return response.choices[0].message
        case 'answer':
            return {
                role: ChatUserType.assistant,
                content: response.choices[0].text
            }
    }
}

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
            const r = formatResponse(data, type)
            console.log(r)
            return r
        })
}


export interface CodeCompletionDetails {
    projectDirectory: string,
    projectFile: string,
    newFile: boolean,
    newFunction: boolean,
    requiredFunctionality: string
}


export function codeCompletion(details: CodeCompletionDetails) {

    const request = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        url: 'http://localhost:8081/code',
        body: JSON.stringify(details)
    }

    return fetch(request.url, request)
        .then(res => res.json())
        .then(res => {
            const { type, data } = res
            const response = {
                role: ChatUserType.assistant,
                content: data,
            }
            return response
        })
}


