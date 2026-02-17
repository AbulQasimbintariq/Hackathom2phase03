import '@/styles/globals.css'
import Link from 'next/link'
import { TaskIcon, ChatIcon } from '@/components/Icons'

export const metadata = {
    title: 'Tasks',
    description: 'Task CRUD UI with Chat Assistant',
    viewport: 'width=device-width, initial-scale=1.0',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang= "en" >
        <body className="min-h-screen bg-gray-50 text-gray-900" >
            <header className="bg-white shadow sticky top-0 z-50" >
                <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4" >
                    <div className="flex items-center justify-between" >
                        <h1 className="text-lg sm:text-xl font-semibold truncate" > Task App </h1>
                            < nav className = "flex gap-2 sm:gap-4" >
                                <Link href="/" className = "text-blue-600 hover:text-blue-700 font-medium flex items-center text-sm sm:text-base whitespace-nowrap" >
                                    <TaskIcon />
                                    < span className = "hidden xs:inline" > Tasks </span>
                                        </Link>
                                        < Link href = "/chat" className = "text-blue-600 hover:text-blue-700 font-medium flex items-center text-sm sm:text-base whitespace-nowrap" >
                                            <ChatIcon />
                                            < span className = "hidden xs:inline" > Chat </span>
                                                </Link>
                                                </nav>
                                                </div>
                                                </div>
                                                </header>
                                                < main className = "max-w-7xl mx-auto" > { children } </main>
                                                    </body>
                                                    </html>
    )
}
