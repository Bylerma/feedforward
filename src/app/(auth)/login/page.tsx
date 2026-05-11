'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { useAuthStore } from '@/store/authStore'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

export default function LoginPage() {
  const router = useRouter()
  const { setUser, setSession, setLoading: setAuthLoading } = useAuthStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (!navigator.onLine) {
      setError('You are offline. Check your internet connection.')
      setLoading(false)
      return
    }

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    const session = authData.session
    const authUser = authData.user
    if (session) setSession(session)

    if (authUser) {
      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('auth_id', authUser.id)
        .single()

      if (profile) {
        setUser(profile as any)
      } else {
        const meta = authUser.user_metadata || {}
        setUser({
          id: authUser.id,
          auth_id: authUser.id,
          email: authUser.email || email,
          name: meta.name || '',
          role: meta.role || 'volunteer',
          points: 0,
          badges: [],
          is_verified: false,
          created_at: authUser.created_at || new Date().toISOString(),
          updated_at: authUser.created_at || new Date().toISOString(),
        } as any)
      }
      setAuthLoading(false)
    }

    const role = authUser?.user_metadata?.role as string | undefined

    router.refresh()

    setTimeout(() => {
      if (role) {
        router.push(`/${role}/dashboard`)
      } else {
        router.push('/')
      }
    }, 100)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-primary-50 p-4">
      <div className="w-full max-w-sm">
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <span className="text-3xl">🍱</span>
          <span className="font-display text-2xl font-bold text-primary-600">FeedForward</span>
        </Link>

        <Card>
          <h1 className="text-xl font-semibold text-slate-900 mb-1">Welcome back</h1>
          <p className="text-sm text-slate-500 mb-6">Sign in to your account</p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="••••••••"
              />
            </div>

            <Button type="submit" loading={loading} className="w-full">
              Sign In
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-primary-600 hover:text-primary-700 font-medium">
              Sign up
            </Link>
          </p>
        </Card>
      </div>
    </div>
  )
}
