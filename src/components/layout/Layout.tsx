import { ReactNode } from 'react'
import Sidebar from './Sidebar'
import BottomNav from './BottomNav'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-page" dir="rtl">
      <Sidebar />
      <main className="lg:mr-64 pb-28 lg:pb-10 px-4 sm:px-6 lg:px-8 pt-6 max-w-5xl">
        {children}
      </main>
      <BottomNav />
    </div>
  )
}
