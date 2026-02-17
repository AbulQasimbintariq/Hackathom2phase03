'use client'

type Message = {
    id: number
    content: string
    sender: 'user' | 'bot'
    created_at: string
}

export default function ChatMessage({ message }: { message: Message }) {
    const isBot = message.sender === 'bot'

    return (
        <div className= {`flex ${isBot ? 'justify-start' : 'justify-end'} mb-3 sm:mb-4`
}>
    <div
                className={
    `max-w-xs sm:max-w-sm lg:max-w-md px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base ${isBot
        ? 'bg-gray-200 text-gray-900'
        : 'bg-blue-600 text-white'
        }`
}
            >
    <p className="break-words" > { message.content } </p>
        < p className = {`text-xs mt-1 ${isBot ? 'text-gray-600' : 'text-blue-100'}`}>
            { new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
            </p>
            </div>
            </div>
    )
}
