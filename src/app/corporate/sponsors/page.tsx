'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useAuthStore } from '@/store/authStore'
import { Navbar } from '@/components/layout/Navbar'
import { Sidebar } from '@/components/layout/Sidebar'
import { MobileNav } from '@/components/layout/MobileNav'
import { Card } from '@/components/ui/Card'

export default function CorporateSponsorsPage() {
  const { user } = useAuthStore()
  const [sponsors, setSponsors] = useState<any[]>([])

  useEffect(() => {
    if (!user) return
    supabase
      .from('corporate_sponsors')
      .select('*')
      .eq('corporate_id', user.id)
      .then(({ data }) => {
        if (data) setSponsors(data)
      })
  }, [user])

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 lg:ml-64 pb-20 lg:pb-0">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
            <h1 className="text-2xl font-bold text-slate-900 mb-1">Sponsors & Partners</h1>
            <p className="text-sm text-slate-500 mb-8">Manage your sponsored food rescue runs</p>

            {sponsors.length === 0 && (
              <Card className="text-center py-12">
                <p className="text-slate-400">No sponsorship programs yet</p>
                <p className="text-xs text-slate-400 mt-1">
                  Sponsorships will appear here once you fund rescue runs
                </p>
              </Card>
            )}

            <div className="space-y-3">
              {sponsors.map((sponsor) => (
                <Card key={sponsor.id}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-slate-900">Sponsorship Program</h3>
                      <p className="text-sm text-slate-500 mt-1">
                        Budget: ₹{Number(sponsor.budget_inr || 0).toLocaleString()} &middot;
                        Spent: ₹{Number(sponsor.spent_inr || 0).toLocaleString()}
                      </p>
                      {sponsor.csr_goal_meals && (
                        <p className="text-xs text-slate-400 mt-1">
                          Goal: {sponsor.csr_goal_meals} meals &middot;
                          Carbon target: {sponsor.csr_goal_carbon} kg CO₂
                        </p>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
      <MobileNav />
    </div>
  )
}
