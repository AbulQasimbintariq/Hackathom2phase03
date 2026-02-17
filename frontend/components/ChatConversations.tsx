'use client'

import { useState, useEffect } from 'react'
import { api } from '@/lib/api'

type Conversation = {
    id: number
    title: string
    created_at: string
    updated_at: string
}

type ChatConversationsProps = {
    onSelectConversation: (id: number) => void
    selectedId?: number
}

export default function ChatConversations({ onSelectConversation, selectedId }: ChatConversationsProps) {
    const [conversations, setConversations] = useState<Conversation[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                setLoading(true)
                setError(null)
                const data = await api.listConversations()
                setConversations(data || [])
            } catch (err: any) {
                const errorMessage = err?.message || 'Failed to load conversations'
                setError(errorMessage)
                console.error('Error loading conversations:', err)
            } finally {
                setLoading(false)
            }
        }
        fetchConversations()
    }, [])

    const handleNewConversation = async () => {
        try {
            setError(null)
            const newConv = await api.createConversation()
            setConversations([newConv, ...conversations])
            onSelectConversation(newConv.id)
        } catch (err: any) {
            const errorMessage = err?.message || 'Failed to create conversation'
            setError(errorMessage)
            console.error('Error creating conversation:', err)
        }
    }

    const handleDelete = async (id: number) => {
        if (!confirm('Delete this conversation?')) return
        try {
            setError(null)
            await api.deleteConversation(id)
            setConversations(conversations.filter(c => c.id !== id))
            if (selectedId === id) {
                onSelectConversation(conversations[0]?.id || 0)
            }
        } catch (err: any) {
            const errorMessage = err?.message || 'Failed to delete conversation'
            setError(errorMessage)
            console.error('Error deleting conversation:', err)
        }
    }


    return (
        <div className= "border-r border-gray-200 w-56 h-screen bg-gray-50 p-3 sm:p-4 overflow-y-auto flex flex-col" >
        <button
                onClick={ handleNewConversation }
    className = "w-full px-3 sm:px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md mb-4 hover:bg-blue-700 transition"
        >
        New Chat
            </button>

    { loading && <p className="text-gray-500 text-xs" > Loading conversations...</p> }
    { error && <p className="text-red-500 text-xs" > { error } </p> }

    <div className="space-y-2 flex-1 min-h-0" >
    {
        conversations.map(conv => (
            <div
                        key= { conv.id }
                        className = {`p-2 sm:p-3 rounded-md cursor-pointer transition ${selectedId === conv.id
                ? 'bg-blue-100 border border-blue-300'
                : 'bg-white hover:bg-gray-100'
                }`}
        >
        <div className="flex items-start justify-between gap-2" >
            <div
                                className="flex-1 min-w-0"
    onClick = {() => onSelectConversation(conv.id)
}
                            >
    <p className="font-medium text-xs sm:text-sm text-gray-900 truncate" > { conv.title } </p>
        < p className = "text-xs text-gray-500" >
            { new Date(conv.updated_at).toLocaleDateString() }
            </p>
            </div>
            < button
onClick = {(e) => {
    e.stopPropagation()
    handleDelete(conv.id)
}}
className = "text-red-500 hover:text-red-700 text-xs flex-shrink-0"
    >
                                ✕
</button>
    </div>
    </div>
                ))}
</div>
    </div>
    )
}
