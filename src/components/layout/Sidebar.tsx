'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'

const NAV_ITEMS: Record<string, { href: string; label: string; icon: string }[]> = {
  supplier: [
    { href: '/supplier/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/supplier/post', label: 'Post Surplus', icon: '➕' },
    { href: '/supplier/history', label: 'History', icon: '📋' },
    { href: '/supplier/ads', label: 'Ad Campaigns', icon: '📢' },
    { href: '/notifications', label: 'Notifications', icon: '🔔' },
  ],
  volunteer: [
    { href: '/volunteer/dashboard', label: 'Map', icon: '🗺️' },
    { href: '/volunteer/profile', label: 'Profile', icon: '👤' },
    { href: '/notifications', label: 'Notifications', icon: '🔔' },
  ],
  ngo: [
    { href: '/ngo/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/ngo/incoming', label: 'Incoming', icon: '📥' },
    { href: '/ngo/verify', label: 'Verify', icon: '✅' },
    { href: '/notifications', label: 'Notifications', icon: '🔔' },
  ],
  corporate: [
    { href: '/corporate/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/corporate/reports', label: 'Reports', icon: '📄' },
    { href: '/corporate/sponsors', label: 'Sponsors', icon: '🤝' },
    { href: '/notifications', label: 'Notifications', icon: '🔔' },
  ],
}

export function Sidebar() {
  const pathname = usePathname()
  const { user } = useAuthStore()
  const role = user?.role || 'volunteer'
  const items = NAV_ITEMS[role] || NAV_ITEMS.volunteer

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-200 min-h-screen">
      <div className="p-4 border-b border-slate-100">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">🍱</span>
          <span className="font-display text-lg font-bold text-primary-600">FeedForward</span>
        </Link>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {items.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-sm font-semibold text-primary-700">
            {user?.name?.[0] || '?'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900 truncate">{user?.name}</p>
            <p className="text-xs text-slate-500 capitalize">{role}</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
