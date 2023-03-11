import { ChatHistoryProps, ChatUserType } from "../components/chatHistory"


function formatResponse(response: any, type: string) {
    console.log(response)
    switch (type) {
        case 'code':
            return {
                role: ChatUserType.assistant,
                content: "Here is your code:",
                code: response.choices[0].text
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


export function startChat(history: ChatHistoryProps[]) {

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


