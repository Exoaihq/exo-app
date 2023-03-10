import { ChatHistoryProps } from "src/components/chatHistory"

export function fetchThings() {

    const request = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        url: 'http://localhost:8081/'
    }

    return fetch(request.url, request)
        .then(res => res.json())
}


export function startChat(history: ChatHistoryProps[]) {

    const request = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        url: 'http://localhost:8081/chat',
        body: JSON.stringify(history)
    }

    return fetch(request.url, request)
        .then(res => res.json())
        .then(res => res.data.choices[0].message)
}

