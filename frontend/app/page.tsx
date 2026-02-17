'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { api } from '@/lib/api'
import TaskList from '@/components/TaskList'
import CreateTaskForm from '@/components/CreateTaskForm'
import TaskFilter from '@/components/TaskFilter'

export default function Page() {
    const searchParams = useSearchParams()
    const [tasks, setTasks] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        // Ensure we have a token for development
        if (typeof window !== 'undefined' && !localStorage.getItem('token')) {
            localStorage.setItem('token', 'dev-user')
        }
    }, [])

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                setLoading(true)
                setError(null)
                const status = searchParams.get('status') || 'all'
                const sort = searchParams.get('sort') || 'created'
                const data = await api.getTasks(status, sort)
                setTasks(data || [])
            } catch (err: any) {
                const errorMsg = err?.message || 'Failed to load tasks'
                setError(errorMsg)
                console.error('Error fetching tasks:', errorMsg)
            } finally {
                setLoading(false)
            }
        }
        fetchTasks()
    }, [searchParams])

    return (
        <section className= "max-w-4xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6" >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2" >
            <h2 className="text-2xl sm:text-3xl font-bold" > Your Tasks </h2>
                </div>

                < CreateTaskForm />
                <TaskFilter />

    { loading && <p className="text-gray-500" > Loading tasks...</p> }
    { error && <p className="text-red-500" > Error: { error } </p> }
    { !loading && !error && <TaskList tasks={ tasks } /> }
    </section>
    )
}
