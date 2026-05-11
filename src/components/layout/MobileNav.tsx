'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'

const NAV_ITEMS: Record<string, { href: string; label: string; icon: string }[]> = {
  supplier: [
    { href: '/supplier/dashboard', label: 'Home', icon: '📊' },
    { href: '/supplier/post', label: 'Post', icon: '➕' },
    { href: '/supplier/history', label: 'History', icon: '📋' },
    { href: '/supplier/ads', label: 'Ads', icon: '📢' },
  ],
  volunteer: [
    { href: '/volunteer/dashboard', label: 'Map', icon: '🗺️' },
    { href: '/volunteer/profile', label: 'Profile', icon: '👤' },
  ],
  ngo: [
    { href: '/ngo/dashboard', label: 'Home', icon: '📊' },
    { href: '/ngo/incoming', label: 'Inbox', icon: '📥' },
    { href: '/ngo/verify', label: 'QR', icon: '✅' },
  ],
  corporate: [
    { href: '/corporate/dashboard', label: 'Home', icon: '📊' },
    { href: '/corporate/reports', label: 'Reports', icon: '📄' },
  ],
}

export function MobileNav() {
  const pathname = usePathname()
  const { user } = useAuthStore()
  const role = user?.role || 'volunteer'
  const items = NAV_ITEMS[role] || NAV_ITEMS.volunteer

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50 pb-safe">
      <div className="flex items-center justify-around h-16">
        {items.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors ${
                isActive ? 'text-primary-600' : 'text-slate-400'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
