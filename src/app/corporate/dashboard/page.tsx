'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { useAuthStore } from '@/store/authStore'
import { Navbar } from '@/components/layout/Navbar'
import { Sidebar } from '@/components/layout/Sidebar'
import { MobileNav } from '@/components/layout/MobileNav'
import { Card } from '@/components/ui/Card'
import { ImpactCounter } from '@/components/ui/ImpactCounter'
import { CarbonChart } from '@/components/dashboard/CarbonChart'
import { Button } from '@/components/ui/Button'

export default function CorporateDashboard() {
  const { user } = useAuthStore()
  const [metrics, setMetrics] = useState({
    meals: 0,
    carbon: 0,
    runs: 0,
    value: 0,
  })

  useEffect(() => {
    if (!user) return

    supabase
      .from('impact_logs')
      .select('meals_rescued, carbon_saved_kg')
      .then(({ data }) => {
        if (data) {
          setMetrics({
            meals: data.reduce((a, b) => a + b.meals_rescued, 0),
            carbon: data.reduce((a, b) => a + Number(b.carbon_saved_kg), 0),
            runs: data.length,
            value: data.reduce((a, b) => a + b.meals_rescued, 0) * 50,
          })
        }
      })
  }, [user])

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 lg:ml-64 pb-20 lg:pb-0">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  {user?.org_name || 'Corporate'} CSR Dashboard
                </h1>
                <p className="text-sm text-slate-500 mt-1">Real-time impact analytics</p>
              </div>
              <div className="flex gap-3">
                <Link href="/corporate/reports">
                  <Button variant="outline">Export Report</Button>
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              <Card>
                <ImpactCounter value={metrics.meals} suffix="Meals Rescued" icon="🍱" />
              </Card>
              <Card>
                <ImpactCounter value={metrics.carbon} suffix="kg CO₂ Saved" icon="🌿" />
              </Card>
              <Card>
                <ImpactCounter value={metrics.value} suffix="₹ Value Created" icon="💰" />
              </Card>
              <Card>
                <ImpactCounter value={metrics.runs} suffix="Runs Funded" icon="♻️" />
              </Card>
            </div>

            <div className="grid lg:grid-cols-2 gap-6 mb-8">
              <CarbonChart />

              <Card>
                <h3 className="font-semibold text-slate-900 mb-4">SDG Alignment</h3>
                <div className="space-y-3">
                  {[
                    { goal: 'SDG 2', label: 'Zero Hunger', pct: 85 },
                    { goal: 'SDG 12', label: 'Responsible Consumption', pct: 92 },
                    { goal: 'SDG 13', label: 'Climate Action', pct: 78 },
                  ].map((sdg) => (
                    <div key={sdg.goal}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-slate-700">{sdg.goal} - {sdg.label}</span>
                        <span className="text-slate-500">{sdg.pct}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary-500 rounded-full"
                          style={{ width: `${sdg.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            <section>
              <Link href="/corporate/sponsors">
                <Button variant="outline" className="w-full">View Sponsors & Partners</Button>
              </Link>
            </section>
          </div>
        </main>
      </div>
      <MobileNav />
    </div>
  )
}
