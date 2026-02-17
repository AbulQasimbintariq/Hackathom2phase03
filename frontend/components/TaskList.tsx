import TaskItem from './TaskItem'

type Task = { id: string; title: string; description?: string; completed?: boolean; created_at?: string; due_date?: string }

export default function TaskList({ tasks }: { tasks: Task[] }) {
    if (!tasks || tasks.length === 0) return <p className="text-gray-600" > No tasks yet </p>

    return (
        <ul className= "space-y-3" >
        {
            tasks.map((t) => (
                <li key= { t.id } >
                <TaskItem task={ t } />
            </li>
            ))
        }
        </ul>
    )
}
