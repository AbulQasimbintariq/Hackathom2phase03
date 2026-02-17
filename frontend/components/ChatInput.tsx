'use client'

import { useState } from 'react'

type ChatInputProps = {
    onSend: (message: string) => Promise<void>
    isLoading?: boolean
}

export default function ChatInput({ onSend, isLoading = false }: ChatInputProps) {
    const [message, setMessage] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const trimmed = message.trim()
        if (trimmed) {
            await onSend(trimmed)
            setMessage('')
        }
    }

    return (
        <form onSubmit= { handleSubmit } className = "flex gap-2 mt-3 sm:mt-4" >
            <input
                type="text"
    value = { message }
    onChange = {(e) => setMessage(e.target.value)
}
placeholder = "Type a message..."
disabled = { isLoading }
className = "flex-1 px-3 sm:px-4 py-2 rounded-md border border-gray-300 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-600"
    />
    <button
                type="submit"
disabled = { isLoading || !message.trim()}
className = "px-3 sm:px-4 py-2 bg-blue-600 text-white text-sm sm:text-base font-medium rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition flex-shrink-0"
    >
    { isLoading? '..': 'Send' }
    </button>
    </form>
    )
}
