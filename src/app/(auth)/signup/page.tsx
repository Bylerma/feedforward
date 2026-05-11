'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import type { UserRole } from '@/types'

export default function SignupPage() {
  const router = useRouter()
  const [step, setStep] = useState<'role' | 'form' | 'check-email'>('role')
  const [role, setRole] = useState<UserRole | null>(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleRoleSelect = (selectedRole: UserRole) => {
    setRole(selectedRole)
    setStep('form')
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!role) return
    setLoading(true)
    setError(null)

    const { data: authData, error: signupError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role,
          name,
        },
      },
    })

    if (signupError) {
      setError(signupError.message)
      setLoading(false)
      return
    }

    const authId = authData.user?.id
    if (authId) {
      await supabase.from('users').insert({
        auth_id: authId,
        email,
        name,
        role,
      })
    }

    if (authData.session) {
      router.push('/onboard')
    } else {
      setStep('check-email')
      setLoading(false)
      return
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-primary-50 p-4">
      <div className="w-full max-w-sm">
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <span className="text-3xl">🍱</span>
          <span className="font-display text-2xl font-bold text-primary-600">FeedForward</span>
        </Link>

        <Card>
          {step === 'role' ? (
            <>
              <h1 className="text-xl font-semibold text-slate-900 mb-1">Join FeedForward</h1>
              <p className="text-sm text-slate-500 mb-6">Select your role to get started</p>

              <div className="space-y-3">
                {([{ role: 'supplier', icon: '🏨', label: 'Food Business', desc: 'Restaurant, hotel, or supermarket' },
                  { role: 'volunteer', icon: '🚴', label: 'Volunteer', desc: 'Pick up and deliver food' },
                  { role: 'ngo', icon: '🏠', label: 'NGO / Community Center', desc: 'Receive food for those in need' },
                  { role: 'corporate', icon: '🏢', label: 'Corporate Partner', desc: 'Sponsor rescues & track CSR' },
                ] as const).map((option) => (
                  <button
                    key={option.role}
                    onClick={() => handleRoleSelect(option.role)}
                    className="w-full flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-primary-500 hover:bg-primary-50 transition-all text-left"
                  >
                    <span className="text-2xl">{option.icon}</span>
                    <div>
                      <p className="font-medium text-sm text-slate-900">{option.label}</p>
                      <p className="text-xs text-slate-500">{option.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </>
          ) : step === 'check-email' ? (
            <div className="text-center py-4">
              <p className="text-4xl mb-4">📧</p>
              <h1 className="text-xl font-semibold text-slate-900 mb-2">Check your email</h1>
              <p className="text-sm text-slate-500">
                We sent a confirmation link to <strong className="text-slate-700">{email}</strong>. Click it to activate your account, then sign in.
              </p>
            </div>
          ) : (
            <>
              <h1 className="text-xl font-semibold text-slate-900 mb-1">Create Account</h1>
              <p className="text-sm text-slate-500 mb-6 capitalize">as {role}</p>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                  {error}
                </div>
              )}

              <form onSubmit={handleSignup} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <Button type="submit" loading={loading} className="w-full">
                  Create Account
                </Button>
              </form>
            </>
          )}

          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link href="/login" className="text-primary-600 hover:text-primary-700 font-medium">
              Sign in
            </Link>
          </p>
        </Card>
      </div>
    </div>
  )
}
