import React, { Suspense } from 'react'
import TasksClient from '@/components/TasksClient'

export default function Page() {
    return (
        <Suspense fallback= {< div className = "p-6 text-center" > Loading...</div>
}>
    <TasksClient />
    </Suspense>
    )
}
