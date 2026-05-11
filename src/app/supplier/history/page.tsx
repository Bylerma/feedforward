'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useAuthStore } from '@/store/authStore'
import { Navbar } from '@/components/layout/Navbar'
import { Sidebar } from '@/components/layout/Sidebar'
import { MobileNav } from '@/components/layout/MobileNav'
import { Card } from '@/components/ui/Card'
import { StatusPill } from '@/components/ui/StatusPill'
import type { Listing } from '@/types'

export default function HistoryPage() {
  const { user } = useAuthStore()
  const [listings, setListings] = useState<Listing[]>([])

  useEffect(() => {
    if (!user) return
    supabase
      .from('listings')
      .select('*')
      .eq('supplier_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (data) setListings(data as Listing[])
      })
  }, [user])

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 lg:ml-64 pb-20 lg:pb-0">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
            <h1 className="text-2xl font-bold text-slate-900 mb-1">Listing History</h1>
            <p className="text-sm text-slate-500 mb-8">All your past and present surplus food listings</p>

            {listings.length === 0 && (
              <Card className="text-center py-12">
                <p className="text-slate-400">No listings yet</p>
              </Card>
            )}

            <div className="space-y-3">
              {listings.map((listing) => (
                <Card key={listing.id}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-slate-900">{listing.food_type}</h3>
                        <StatusPill status={listing.status} />
                      </div>
                      <p className="text-sm text-slate-500 mt-1">
                        {listing.quantity} {listing.quantity_unit} &middot; {listing.pickup_address}
                      </p>
                    </div>
                    <p className="text-xs text-slate-400">
                      {new Date(listing.created_at).toLocaleDateString()}
                    </p>
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
