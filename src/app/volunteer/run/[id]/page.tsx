'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { useAuthStore } from '@/store/authStore'
import { Navbar } from '@/components/layout/Navbar'
import { Sidebar } from '@/components/layout/Sidebar'
import { MobileNav } from '@/components/layout/MobileNav'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { RunTimeline } from '@/components/dashboard/RunTimeline'
import { QRScanner } from '@/components/qr/QRScanner'
import { Modal } from '@/components/ui/Modal'
import { PackagingAd } from '@/components/ads/PackagingAd'
import type { Match, Listing } from '@/types'

export default function ActiveRunPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuthStore()
  const [match, setMatch] = useState<Match | null>(null)
  const [listing, setListing] = useState<Listing | null>(null)
  const [scanStage, setScanStage] = useState<'pickup' | 'delivery' | null>(null)
  const [complete, setComplete] = useState(false)

  useEffect(() => {
    loadRun()
  }, [params.id])

  const loadRun = async () => {
    const { data: matchData } = await supabase
      .from('matches')
      .select('*')
      .eq('id', params.id)
      .single()

    if (matchData) {
      setMatch(matchData as Match)

      const { data: listingData } = await supabase
        .from('listings')
        .select('*')
        .eq('id', matchData.listing_id)
        .single()

      if (listingData) setListing(listingData as Listing)
    }
  }

  const handleScan = async (token: string) => {
    if (!match || !scanStage || !user) return

    await supabase.from('matches').update({
      status: scanStage === 'pickup' ? 'supplier_verified' : 'completed',
      supplier_scanned_at: scanStage === 'pickup' ? new Date().toISOString() : undefined,
      ngo_scanned_at: scanStage === 'delivery' ? new Date().toISOString() : undefined,
      completed_at: scanStage === 'delivery' ? new Date().toISOString() : undefined,
    }).eq('id', match.id)

    setScanStage(null)
    loadRun()

    if (scanStage === 'delivery') {
      setComplete(true)
      setTimeout(() => router.push('/volunteer/dashboard'), 2000)
    }
  }

  const steps = [
    { label: 'Go to Supplier', completed: false, active: true },
    { label: 'Scan Pickup QR', completed: false, active: true },
    { label: 'Deliver to NGO', completed: false, active: false },
    { label: 'Scan Delivery QR', completed: false, active: false },
    { label: 'Complete', completed: false, active: false },
  ]

  if (match?.status === 'supplier_verified') {
    steps[0].completed = true
    steps[1].completed = true
    steps[2].active = true
    steps[3].active = true
  }

  if (match?.status === 'completed') {
    steps.forEach((s) => (s.completed = true))
    steps[4].active = true
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 lg:ml-64 pb-20 lg:pb-0">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
            {complete ? (
              <Card className="text-center py-12">
                <p className="text-4xl mb-4">🎉</p>
                <h2 className="text-xl font-bold text-slate-900">Run Complete!</h2>
                <p className="text-slate-500 mt-2">You earned 120 FF Points</p>
              </Card>
            ) : (
              <>
                <h1 className="text-2xl font-bold text-slate-900 mb-2">Active Run</h1>
                {listing && (
                  <p className="text-slate-500 mb-8">
                    {listing.food_type} &middot; {listing.quantity} {listing.quantity_unit}
                  </p>
                )}

                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <h3 className="font-semibold text-slate-900 mb-4">Progress</h3>
                    <RunTimeline steps={steps} />
                  </Card>

                  <div className="space-y-4">
                    <Card>
                      <h3 className="font-semibold text-slate-900 mb-2">Step 1: Pickup</h3>
                      {listing && (
                        <p className="text-sm text-slate-500 mb-3">{listing.pickup_address}</p>
                      )}
                      <Button
                        className="w-full"
                        onClick={() => setScanStage('pickup')}
                        disabled={match?.status === 'supplier_verified'}
                      >
                        {match?.status === 'supplier_verified' ? '✅ Pickup Verified' : 'Scan Pickup QR'}
                      </Button>
                    </Card>

                    <Card>
                      <h3 className="font-semibold text-slate-900 mb-2">Step 2: Delivery</h3>
                      {listing && (
                        <p className="text-sm text-slate-500 mb-3">NGO Location</p>
                      )}
                      <Button
                        className="w-full"
                        onClick={() => setScanStage('delivery')}
                        disabled={match?.status !== 'supplier_verified'}
                      >
                        {match?.status === 'completed' ? '✅ Delivered' : 'Scan Delivery QR'}
                      </Button>
                    </Card>
                  </div>
                </div>

                <div className="mt-6">
                  <PackagingAd />
                </div>
              </>
            )}
          </div>
        </main>
      </div>
      <MobileNav />

      <Modal open={!!scanStage} onClose={() => setScanStage(null)} title="Scan QR Code">
        <QRScanner onScan={handleScan} stage={scanStage || 'pickup'} />
      </Modal>
    </div>
  )
}
