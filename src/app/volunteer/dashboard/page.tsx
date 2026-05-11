'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { useAuthStore } from '@/store/authStore'
import { Navbar } from '@/components/layout/Navbar'
import { Sidebar } from '@/components/layout/Sidebar'
import { MobileNav } from '@/components/layout/MobileNav'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { StatusPill } from '@/components/ui/StatusPill'
import { MapContainer } from '@/components/map/MapContainer'
import { useGeolocation } from '@/hooks/useGeolocation'
import { AdDisplay } from '@/components/ads/AdDisplay'
import type { Listing, Match } from '@/types'

export default function VolunteerDashboard() {
  const router = useRouter()
  const { user } = useAuthStore()
  const { latitude, longitude, loading: locLoading } = useGeolocation()
  const [availableListings, setAvailableListings] = useState<Listing[]>([])
  const [activeMatch, setActiveMatch] = useState<Match | null>(null)

  useEffect(() => {
    loadListings()
    loadActiveMatch()
  }, [user])

  const loadListings = async () => {
    const { data } = await supabase
      .from('listings')
      .select('*, supplier:supplier_id(name, org_name)')
      .eq('status', 'available')
      .order('created_at', { ascending: false })

    if (data) setAvailableListings(data as unknown as Listing[])
  }

  const loadActiveMatch = async () => {
    if (!user) return
    const { data } = await supabase
      .from('matches')
      .select('*, listing:listing_id(*)')
      .eq('volunteer_id', user.id)
      .in('status', ['volunteer_assigned', 'supplier_verified'])
      .single()

    if (data) setActiveMatch(data as unknown as Match)
  }

  const handleClaim = async (matchId: string) => {
    const { data: match } = await supabase
      .from('matches')
      .update({
        volunteer_id: user?.id,
        status: 'volunteer_assigned',
        claimed_at: new Date().toISOString(),
      })
      .eq('id', matchId)
      .eq('status', 'pending')
      .select()
      .single()

    if (match) {
      setActiveMatch(match as unknown as Match)
      setAvailableListings((prev) => prev.filter((l) => l.id !== match.listing_id))
      router.push(`/volunteer/run/${match.id}`)
    }
  }

  const markers = [
    ...(latitude && longitude ? [{ id: 'me', lat: latitude, lng: longitude, type: 'volunteer' as const, label: 'You' }] : []),
    ...availableListings.map((l) => ({
      id: l.id,
      lat: (l.pickup_location as any)?.lat || 0,
      lng: (l.pickup_location as any)?.lng || 0,
      type: 'pickup' as const,
      label: `${l.food_type} - ${l.quantity} ${l.quantity_unit}`,
    })),
  ].filter((m) => m.lat && m.lng)

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 lg:ml-64 pb-20 lg:pb-0">
          <div className="h-[50vh] bg-slate-200 relative">
            <MapContainer
              markers={markers}
              center={latitude && longitude ? [longitude, latitude] : undefined}
              zoom={13}
              className="w-full h-full"
            />
            {locLoading && (
              <div className="absolute top-4 left-4 bg-white px-3 py-1.5 rounded-lg shadow text-xs text-slate-500">
                Locating you...
              </div>
            )}
          </div>

          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
            {activeMatch && (
              <Card className="mb-6 border-accent-500 border-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-accent-600">Active Run</p>
                    <p className="text-lg font-semibold text-slate-900 mt-1">You have an active pickup!</p>
                  </div>
                  <Button onClick={() => router.push(`/volunteer/run/${activeMatch.id}`)}>
                    View Run
                  </Button>
                </div>
              </Card>
            )}

            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900">
                Nearby Pickups
              </h2>
              <Badge variant="success">{availableListings.length} Available</Badge>
            </div>

            {availableListings.length === 0 && (
              <Card className="text-center py-12">
                <p className="text-3xl mb-2">🎉</p>
                <p className="text-slate-500">No pickups available right now</p>
                <p className="text-xs text-slate-400 mt-1">Check back soon or expand your search area</p>
              </Card>
            )}

            <div className="space-y-3">
              {availableListings.map((listing) => (
                <Card key={listing.id} hover>
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-slate-900 truncate">
                          🍱 {listing.food_type}
                        </h3>
                        <StatusPill status={listing.status} />
                      </div>
                      <p className="text-sm text-slate-500">
                        {listing.quantity} {listing.quantity_unit}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">{listing.pickup_address}</p>
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-sm font-mono font-bold text-primary-600">
                        ~120 pts
                      </p>
                      <Button
                        size="sm"
                        className="mt-2"
                        onClick={() => handleClaim(listing.id)}
                      >
                        Accept Run
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <div className="mt-8 max-w-4xl mx-auto px-4 sm:px-6">
            <AdDisplay placement="website" targetPage="dashboard" />
          </div>
        </main>
      </div>
      <MobileNav />
    </div>
  )
}
