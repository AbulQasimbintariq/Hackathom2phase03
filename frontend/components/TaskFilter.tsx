'use client'

import { useRouter, useSearchParams } from 'next/navigation'

export default function TaskFilter() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const current = searchParams?.get('status') || 'all'
    const currentSort = searchParams?.get('sort') || 'created'

    const changeStatus = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value
        const url = new URL(window.location.href)
        if (value === 'all') {
            url.searchParams.delete('status')
        } else {
            url.searchParams.set('status', value)
        }
        router.push(url.pathname + url.search)
    }

    const changeSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value
        const url = new URL(window.location.href)
        if (value === 'created') {
            url.searchParams.delete('sort')
        } else {
            url.searchParams.set('sort', value)
        }
        router.push(url.pathname + url.search)
    }

    return (
        <div className= "mb-4 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4" >
        <label className="text-sm text-gray-700" > Filter: </label>
            < select value = { current } onChange = { changeStatus } className = "w-full sm:w-auto rounded-md border-gray-300" >
                <option value="all" > All </option>
                    < option value = "pending" > Pending </option>
                        < option value = "completed" > Completed </option>
                            </select>

                            < label className = "text-sm text-gray-700" > Sort: </label>
                                < select value = { currentSort } onChange = { changeSort } className = "w-full sm:w-auto rounded-md border-gray-300" >
                                    <option value="created" > Created </option>
                                        < option value = "title" > Title </option>
                                            < option value = "due_date" > Due date </option>
                                                </select>
                                                </div>
    )
}
