'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useAuthStore } from '@/store/authStore'
import { Navbar } from '@/components/layout/Navbar'
import { Sidebar } from '@/components/layout/Sidebar'
import { MobileNav } from '@/components/layout/MobileNav'
import { Card } from '@/components/ui/Card'
import { StatusPill } from '@/components/ui/StatusPill'
import { Badge } from '@/components/ui/Badge'
import type { Match } from '@/types'

export default function NGOIncomingPage() {
  const { user } = useAuthStore()
  const [matches, setMatches] = useState<Match[]>([])

  useEffect(() => {
    if (!user) return
    supabase
      .from('matches')
      .select('*, listing:listing_id(*), volunteer:volunteer_id(name)')
      .eq('ngo_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (data) setMatches(data as unknown as Match[])
      })
  }, [user])

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 lg:ml-64 pb-20 lg:pb-0">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
            <h1 className="text-2xl font-bold text-slate-900 mb-1">All Incoming</h1>
            <p className="text-sm text-slate-500 mb-8">Track all food rescue deliveries</p>

            {matches.length === 0 && (
              <Card className="text-center py-12">
                <p className="text-slate-400">No incoming deliveries</p>
              </Card>
            )}

            <div className="space-y-3">
              {matches.map((match) => {
                const listing = (match as any).listing
                const volunteerName = (match as any).volunteer?.name
                return (
                  <Card key={match.id}>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-slate-900">
                            {listing?.food_type || 'Food'}
                          </h3>
                          <StatusPill status={match.status} />
                        </div>
                        <p className="text-sm text-slate-500 mt-1">
                          {listing?.quantity} {listing?.quantity_unit} &middot; {listing?.pickup_address}
                        </p>
                        {volunteerName && (
                          <p className="text-xs text-slate-400 mt-1">
                            Volunteer: {volunteerName}
                          </p>
                        )}
                      </div>
                      <div className="text-right text-xs text-slate-400">
                        {new Date(match.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          </div>
        </main>
      </div>
      <MobileNav />
    </div>
  )
}
