'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useAuthStore } from '@/store/authStore'
import { Navbar } from '@/components/layout/Navbar'
import { Sidebar } from '@/components/layout/Sidebar'
import { MobileNav } from '@/components/layout/MobileNav'
import { Card } from '@/components/ui/Card'
import { QRDisplay } from '@/components/qr/QRDisplay'
import type { Match } from '@/types'

export default function NGOVerifyPage() {
  const { user } = useAuthStore()
  const [activeMatch, setActiveMatch] = useState<Match | null>(null)
  const [qrToken, setQrToken] = useState<string>('')

  useEffect(() => {
    if (!user) return

    supabase
      .from('matches')
      .select('*')
      .eq('ngo_id', user.id)
      .in('status', ['volunteer_assigned', 'supplier_verified'])
      .order('created_at', { ascending: false })
      .limit(1)
      .single()
      .then(({ data }) => {
        if (data) setActiveMatch(data as Match)
      })

    const token = btoa(JSON.stringify({
      ngo_id: user.id,
      org: user.org_name,
      ts: Date.now(),
    }))
    setQrToken(token)
  }, [user])

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 lg:ml-64 pb-20 lg:pb-0">
          <div className="max-w-md mx-auto px-4 sm:px-6 py-8">
            <h1 className="text-2xl font-bold text-slate-900 mb-1">Verify Delivery</h1>
            <p className="text-sm text-slate-500 mb-8">
              Show this QR to the volunteer for scanning
            </p>

            <QRDisplay token={qrToken} role="ngo" orgName={user?.org_name} />

            {activeMatch && (
              <Card className="mt-6">
                <p className="text-sm text-slate-500 text-center">
                  A volunteer is on their way!
                </p>
              </Card>
            )}
          </div>
        </main>
      </div>
      <MobileNav />
    </div>
  )
}
