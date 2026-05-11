'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { useAuthStore } from '@/store/authStore'
import { Navbar } from '@/components/layout/Navbar'
import { Sidebar } from '@/components/layout/Sidebar'
import { MobileNav } from '@/components/layout/MobileNav'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { ImpactWidget } from '@/components/dashboard/ImpactWidget'
import { CarbonChart } from '@/components/dashboard/CarbonChart'
import type { Match, ImpactSummary } from '@/types'

export default function NGODashboard() {
  const { user } = useAuthStore()
  const [incoming, setIncoming] = useState<Match[]>([])
  const [impact, setImpact] = useState<ImpactSummary | null>(null)

  useEffect(() => {
    if (!user) return
    loadIncoming()
    loadImpact()
  }, [user])

  const loadIncoming = async () => {
    const { data } = await supabase
      .from('matches')
      .select('*, listing:listing_id(*), volunteer:volunteer_id(name)')
      .eq('ngo_id', user?.id)
      .in('status', ['pending', 'volunteer_assigned', 'supplier_verified'])
      .order('created_at', { ascending: false })

    if (data) setIncoming(data as unknown as Match[])
  }

  const loadImpact = async () => {
    const { data } = await supabase
      .from('impact_logs')
      .select('meals_rescued, carbon_saved_kg')
      .eq('ngo_id', user?.id)

    if (data) {
      setImpact({
        total_meals: data.reduce((a, b) => a + b.meals_rescued, 0),
        total_carbon_kg: data.reduce((a, b) => a + Number(b.carbon_saved_kg), 0),
        total_food_kg: 0,
        total_runs: data.length,
        total_points: 0,
      })
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 lg:ml-64 pb-20 lg:pb-0">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  {user?.org_name || 'NGO'} Dashboard
                </h1>
                <p className="text-sm text-slate-500 mt-1">Incoming food rescues</p>
              </div>
              <Link href="/ngo/verify">
                <Button variant="outline">View QR Code</Button>
              </Link>
            </div>

            {incoming.length > 0 && (
              <section className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <h2 className="text-lg font-semibold text-slate-900">Incoming Food</h2>
                  <Badge variant="error">{incoming.length} Active</Badge>
                </div>

                <div className="space-y-3">
                  {incoming.map((match) => {
                    const listing = (match as any).listing
                    const volunteer = (match as any).volunteer
                    return (
                      <Card key={match.id} hover>
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-lg">🚨</span>
                              <h3 className="font-medium text-slate-900">
                                {listing?.food_type || 'Food'} &middot; {listing?.quantity} {listing?.quantity_unit}
                              </h3>
                            </div>
                            <p className="text-sm text-slate-500 mt-1">
                              From: {listing?.pickup_address}
                            </p>
                            {volunteer && (
                              <p className="text-xs text-slate-400 mt-1">
                                Volunteer: {volunteer.name}
                              </p>
                            )}
                          </div>
                          <Link href="/ngo/verify">
                            <Button size="sm">View QR</Button>
                          </Link>
                        </div>
                      </Card>
                    )
                  })}
                </div>
              </section>
            )}

            {impact && (
              <section className="mb-8">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">Received Impact</h2>
                <ImpactWidget
                  mealsRescued={impact.total_meals}
                  carbonSaved={impact.total_carbon_kg}
                  runsCompleted={impact.total_runs}
                />
              </section>
            )}

            <section>
              <CarbonChart />
            </section>
          </div>
        </main>
      </div>
      <MobileNav />
    </div>
  )
}
