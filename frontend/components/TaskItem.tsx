'use client'

import { useState } from 'react'
import { api } from '@/lib/api'

type Task = { id: string; title: string; description?: string; completed?: boolean; created_at?: string; due_date?: string }

export default function TaskItem({ task }: { task: Task }) {
    const [completed, setCompleted] = useState(!!task.completed)
    const [loading, setLoading] = useState(false)

    const toggle = async () => {
        setLoading(true)
        try {
            await api.updateTask(task.id, { completed: !completed })
            setCompleted(!completed)
        } catch (e) {
            // basic error handling
            alert('Failed to update task')
        } finally {
            setLoading(false)
        }
    }

    const remove = async () => {
        if (!confirm('Delete this task?')) return
        setLoading(true)
        try {
            await api.deleteTask(task.id)
            // Simple approach: reload the page to refresh tasks
            if (typeof window !== 'undefined') window.location.reload()
        } catch (e) {
            alert('Failed to delete task')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className= "p-3 sm:p-4 bg-white rounded-md shadow-sm flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4" >
        <div className="flex items-start gap-3 flex-1 min-w-0" >
            <input
                    type="checkbox"
    checked = { completed }
    onChange = { toggle }
    disabled = { loading }
    className = "h-5 w-5 mt-0.5 flex-shrink-0"
        />
        <div className="min-w-0 flex-1" >
            <div className={ completed ? 'line-through text-gray-500 break-words' : 'text-gray-900 break-words' }> { task.title } </div>
    { task.description && <div className="text-sm text-gray-500 mt-1 break-words" > { task.description } </div> }
    {
        task.due_date && (
            <div className="text-xs text-yellow-600 mt-1" > Due: { new Date(task.due_date).toLocaleString() } </div>
                    )
    }
    {
        task.created_at && (
            <div className="text-xs text-gray-400 mt-1" > Created: { new Date(task.created_at).toLocaleString() } </div>
                    )
    }
    </div>
        </div>

        < div className = "flex gap-2 flex-shrink-0" >
            <button onClick={ remove } className = "text-sm text-red-500 hover:text-red-700 font-medium whitespace-nowrap" disabled = { loading } >
                Delete
                </button>
                </div>
                </div>
    )
}
