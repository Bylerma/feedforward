'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { useAuthStore } from '@/store/authStore'
import { Navbar } from '@/components/layout/Navbar'
import { Sidebar } from '@/components/layout/Sidebar'
import { MobileNav } from '@/components/layout/MobileNav'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { ImpactWidget } from '@/components/dashboard/ImpactWidget'
import { ActiveListings } from '@/components/dashboard/ActiveListings'
import { CarbonChart } from '@/components/dashboard/CarbonChart'
import { QRDisplay } from '@/components/qr/QRDisplay'
import { Modal } from '@/components/ui/Modal'
import { AdDisplay } from '@/components/ads/AdDisplay'
import type { Listing, ImpactSummary } from '@/types'

export default function SupplierDashboard() {
  const { user } = useAuthStore()
  const [listings, setListings] = useState<Listing[]>([])
  const [impact, setImpact] = useState<ImpactSummary | null>(null)
  const [qrListing, setQrListing] = useState<Listing | null>(null)

  useEffect(() => {
    if (!user) return

    supabase
      .from('listings')
      .select('*')
      .eq('supplier_id', user.id)
      .in('status', ['available', 'matched', 'claimed', 'picked_up'])
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (data) setListings(data as Listing[])
      })

    supabase
      .from('impact_logs')
      .select('meals_rescued, carbon_saved_kg, food_weight_kg, points_awarded')
      .eq('supplier_id', user.id)
      .then(({ data }) => {
        if (data) {
          const summary = data.reduce(
            (acc, log) => ({
              total_meals: acc.total_meals + log.meals_rescued,
              total_carbon_kg: acc.total_carbon_kg + Number(log.carbon_saved_kg),
              total_food_kg: acc.total_food_kg + Number(log.food_weight_kg || 0),
              total_runs: acc.total_runs + 1,
              total_points: acc.total_points + (log.points_awarded || 0),
            }),
            { total_meals: 0, total_carbon_kg: 0, total_food_kg: 0, total_runs: 0, total_points: 0 }
          )
          setImpact(summary)
        }
      })
  }, [user])

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
                  {user?.org_name || user?.name || 'Supplier'} Dashboard
                </h1>
                <p className="text-sm text-slate-500 mt-1">Manage your surplus food listings</p>
              </div>
              <Link href="/supplier/post">
                <Button>+ Post New Surplus</Button>
              </Link>
            </div>

            {listings.length > 0 && (
              <section className="mb-8">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">Active Listings</h2>
                <ActiveListings
                  listings={listings}
                  onViewQR={(listing) => setQrListing(listing)}
                  onTrack={(listing) => window.open(`/supplier/history`, '_self')}
                />
              </section>
            )}

            {impact && (
              <section className="mb-8">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">Your Impact</h2>
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

            <section className="mt-8">
              <Link href="/supplier/history">
                <Button variant="outline" className="w-full">View All History</Button>
              </Link>
            </section>

            <section className="mt-8">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Sponsored</h2>
              <AdDisplay placement="website" targetPage="dashboard" />
            </section>
          </div>
        </main>
      </div>
      <MobileNav />

      <Modal open={!!qrListing} onClose={() => setQrListing(null)} title="Your QR Code">
        {qrListing && qrListing.qr_token && (
          <QRDisplay token={qrListing.qr_token} role="supplier" orgName={user?.org_name} />
        )}
      </Modal>
    </div>
  )
}
