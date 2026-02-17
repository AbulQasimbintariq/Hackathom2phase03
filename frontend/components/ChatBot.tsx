'use client'

import { useState, useEffect, useRef } from 'react'
import { api } from '@/lib/api'
import ChatMessage from './ChatMessage'
import ChatInput from './ChatInput'
import ChatConversations from './ChatConversations'

type Message = {
    id: number
    content: string
    sender: 'user' | 'bot'
    created_at: string
}

export default function ChatBot() {
    const [selectedConversation, setSelectedConversation] = useState<number | null>(null)
    const [messages, setMessages] = useState<Message[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    // Load messages when conversation changes
    useEffect(() => {
        if (!selectedConversation) return

        const loadMessages = async () => {
            try {
                setLoading(true)
                setError(null)
                const data = await api.getConversationMessages(selectedConversation)
                setMessages(data || [])
            } catch (err: any) {
                const errorMessage = err?.message || 'Failed to load messages'
                setError(errorMessage)
                console.error('Error loading messages:', err)
            } finally {
                setLoading(false)
            }
        }
        loadMessages()
    }, [selectedConversation])

    // Scroll to bottom on new messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const handleSendMessage = async (content: string) => {
        // Ensure a conversation exists; auto-create if none selected
        try {
            setError(null)

            let convId = selectedConversation
            if (!convId) {
                // create a new conversation with default title
                const newConv = await api.createConversation('Task Chat')
                convId = newConv?.id
                if (!convId) throw new Error('Failed to create conversation')
                setSelectedConversation(convId)
            }

            // Add user message optimistically
            const userMessage: Message = {
                id: Date.now(),
                content,
                sender: 'user',
                created_at: new Date().toISOString()
            }
            setMessages(prev => [...prev, userMessage])

            // Send message and get bot response
            const botMsg = await api.sendMessage(convId, content)

            // If API returned a bot message, append/refresh messages
            if (botMsg && botMsg.id) {
                // fetch conversation messages to ensure consistency
                const updatedMessages = await api.getConversationMessages(convId)
                setMessages(updatedMessages || [])
            } else {
                // If no bot message returned, still try to refresh
                const updatedMessages = await api.getConversationMessages(convId)
                setMessages(updatedMessages || [])
            }
        } catch (err: any) {
            const errorMessage = err?.message || 'Failed to send message'
            setError(errorMessage)
            console.error('Error sending message:', err)
            // Remove the last optimistic user message to avoid stale UI
            setMessages(prev => prev.slice(0, -1))
        }
    }

    return (
        <div className= "flex h-screen flex-col lg:flex-row bg-white" >
        {/* Mobile sidebar toggle */ }
    {
        sidebarOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-40" onClick = {() => setSidebarOpen(false)
    } />
        )
}

{/* Sidebar with conversations */ }
<div className = { `absolute lg:relative w-56 h-screen lg:h-auto bg-gray-50 border-r border-gray-200 z-50 lg:z-auto transition-transform transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}` } >
    <ChatConversations
    onSelectConversation = {
    (id) => {
        setSelectedConversation(id)
        setSidebarOpen(false)
    }
}
selectedId = { selectedConversation || undefined
}
            />
    </div>

{/* Main chat area */ }
<div className="flex-1 flex flex-col min-w-0" >
    {/* Header with sidebar toggle */ }
    < div className = "border-b border-gray-200 p-3 sm:p-4 bg-gray-50 flex items-center justify-between" >
        <div>
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900" > Chat Assistant </h2>
            < p className = "text-xs sm:text-sm text-gray-600" > Ask me about tasks and task management! </p>
                </div>
                < button
onClick = {() => setSidebarOpen(!sidebarOpen)}
className = "lg:hidden px-3 py-2 text-gray-600 hover:text-gray-900 bg-white rounded-md"
    >
                ☰
</button>
    </div>

{
    selectedConversation ? (
        <>
        <div className = "flex-1 overflow-y-auto p-3 sm:p-4 bg-white space-y-3 sm:space-y-4" >
        { loading && <p className="text-gray-500 text-sm" > Loading messages...</p>
}
{ error && <p className="text-red-500 text-sm" > { error } </p> }

{
    messages.length === 0 && !loading && (
        <p className="text-gray-500 text-center" > Start a conversation! </p>
                            )
}

{
    messages.map(msg => (
        <ChatMessage key= { msg.id } message = { msg } />
                            ))
}
<div ref={ messagesEndRef } />
    </div>

    < div className = "border-t border-gray-200 p-3 sm:p-4 bg-white" >
        <ChatInput
                                onSend={ handleSendMessage }
isLoading = { loading }
    />
    </div>
    </>
                ) : (
    <div className= "flex-1 flex items-center justify-center px-4" >
    <p className="text-gray-500 text-center" > Select or create a conversation to start chatting </p>
        </div>
                )}
</div>
    </div>
    )
}
