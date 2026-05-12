'use client'

import { Navbar } from '@/components/layout/Navbar'
import { Sidebar } from '@/components/layout/Sidebar'
import { MobileNav } from '@/components/layout/MobileNav'
import { NotificationList } from '@/components/notifications/NotificationList'

export default function NotificationsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 lg:ml-64 pb-20 lg:pb-0">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>
              <p className="text-sm text-slate-500 mt-1">
                Stay updated on matches, status changes, and messages
              </p>
            </div>
            <NotificationList />
          </div>
        </main>
      </div>
      <MobileNav />
    </div>
  )
}
