'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'

export default function CreateTaskForm() {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [dueDate, setDueDate] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    const submit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        const trimmed = title.trim()
        if (trimmed.length < 1 || trimmed.length > 200) {
            setError('Title must be 1-200 characters')
            return
        }
        if (description.length > 1000) {
            setError('Description must be at most 1000 characters')
            return
        }
        let due_date: string | undefined = undefined
        if (dueDate) {
            const d = new Date(dueDate)
            if (isNaN(d.getTime())) {
                setError('Invalid due date')
                return
            }
            due_date = d.toISOString()
        }

        try {
            await api.createTask({ title: trimmed, description: description || undefined, due_date })
            startTransition(() => {
                setTitle('')
                setDescription('')
                setDueDate('')
                router.refresh()
            })
        } catch (e) {
            const message = e instanceof Error ? e.message : 'Failed to create task'
            setError(message)
        }
    }

    return (
        <form onSubmit= { submit } className = "mb-6 space-y-3 bg-white p-3 sm:p-4 rounded-md shadow-sm" >
            <div>
            <label className="block text-sm font-medium text-gray-700" > Title </label>
                < input
    value = { title }
    onChange = {(e) => setTitle(e.target.value)
}
className = "mt-1 block w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
placeholder = "New task title"
    />
    </div>

    < div >
    <label className="block text-sm font-medium text-gray-700" > Description(optional) </label>
        < textarea
value = { description }
onChange = {(e) => setDescription(e.target.value)}
className = "mt-1 block w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
rows = { 3}
    />
    </div>

    < div >
    <label className="block text-sm font-medium text-gray-700" > Due date(optional) </label>
        < input
type = "datetime-local"
value = { dueDate }
onChange = {(e) => setDueDate(e.target.value)}
className = "mt-1 block w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    </div>

{ error && <div className="text-sm text-red-500 bg-red-50 p-2 rounded" > { error } </div> }

<div>
    <button type="submit" className = "w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition" disabled = { isPending } >
        { isPending? 'Creating...': 'Create Task' }
        </button>
        </div>
        </form>
    )
}
