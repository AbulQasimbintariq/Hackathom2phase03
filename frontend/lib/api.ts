export const api = {
    baseUrl: process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000',

    async request(path: string, options: RequestInit = {}) {
        const headers: Record<string, string> = { ...(options.headers as Record<string, string>), 'Content-Type': 'application/json' }

        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token')
            if (token) {
                headers['Authorization'] = `Bearer ${token}`
            }
        }

        try {
            const url = this.baseUrl + path
            console.log('API Request:', { url, method: options.method || 'GET' })

            const res = await fetch(url, { ...options, headers })

            if (res.status === 204) return null
            const text = await res.text()

            let data = null
            if (text) {
                try {
                    data = JSON.parse(text)
                } catch (e) {
                    data = text
                }
            }

            if (!res.ok) {
                const errorMessage = typeof data === 'object' && data?.detail
                    ? data.detail
                    : typeof data === 'object' && data?.message
                        ? data.message
                        : `HTTP ${res.status}`
                throw new Error(errorMessage)
            }

            return data
        } catch (error) {
            let errorMsg = 'Failed to fetch'

            if (error instanceof TypeError) {
                // Network error (CORS, connection refused, etc)
                errorMsg = `Network error: Unable to connect to ${this.baseUrl}. Make sure the backend server is running.`
                console.error('Network/CORS Error:', error)
            } else if (error instanceof Error) {
                errorMsg = error.message
            }

            console.error('API Error:', errorMsg)
            throw new Error(errorMsg)
        }
    },

    getTasks(status?: string, sort?: string) {
        const params = new URLSearchParams()
        if (status) params.set('status', status)
        if (sort) params.set('sort', sort)
        const q = params.toString() ? `?${params.toString()}` : ''
        return this.request(`/api/tasks${q}`)
    },

    createTask(data: { title: string; description?: string; due_date?: string }) {
        return this.request('/api/tasks', { method: 'POST', body: JSON.stringify(data) })
    },

    updateTask(id: string, data: any) {
        return this.request(`/api/tasks/${id}`, { method: 'PUT', body: JSON.stringify(data) })
    },

    deleteTask(id: string) {
        return this.request(`/api/tasks/${id}`, { method: 'DELETE' })
    },

    // Chat endpoints
    listConversations() {
        return this.request('/api/chat/conversations')
    },

    createConversation(title?: string) {
        return this.request('/api/chat/conversations', {
            method: 'POST',
            body: JSON.stringify({ title })
        })
    },

    getConversationMessages(conversationId: number) {
        return this.request(`/api/chat/conversations/${conversationId}/messages`)
    },

    sendMessage(conversationId: number, content: string) {
        return this.request(`/api/chat/conversations/${conversationId}/messages`, {
            method: 'POST',
            body: JSON.stringify({ content })
        })
    },

    deleteConversation(conversationId: number) {
        return this.request(`/api/chat/conversations/${conversationId}`, { method: 'DELETE' })
    },
}
