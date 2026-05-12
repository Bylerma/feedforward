'use client'

import Link from 'next/link'
import { useAuthStore } from '@/store/authStore'
import { Button } from '@/components/ui/Button'
import { NotificationBell } from '@/components/notifications/NotificationBell'

interface NavbarProps {
  transparent?: boolean
}

export function Navbar({ transparent = false }: NavbarProps) {
  const { user, signOut } = useAuthStore()

  return (
    <nav className={`${transparent ? 'absolute' : 'relative bg-white border-b border-slate-200'} top-0 left-0 right-0 z-40`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🍱</span>
            <span className="font-display text-xl font-bold text-primary-600">FeedForward</span>
          </Link>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <NotificationBell />
                <Link
                  href={`/${user.role}/dashboard`}
                  className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Dashboard
                </Link>
                <Button variant="ghost" size="sm" onClick={signOut}>
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">Log In</Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm">Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
