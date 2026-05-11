'use client'

import { Card } from '@/components/ui/Card'
import { StatusPill } from '@/components/ui/StatusPill'
import type { Listing } from '@/types'

interface ActiveListingsProps {
  listings: Listing[]
  onViewQR?: (listing: Listing) => void
  onTrack?: (listing: Listing) => void
}

export function ActiveListings({ listings, onViewQR, onTrack }: ActiveListingsProps) {
  if (listings.length === 0) {
    return (
      <Card className="text-center py-8">
        <p className="text-slate-400 text-sm">No active listings</p>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      {listings.map((listing) => (
        <Card key={listing.id} hover>
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-medium text-slate-900 truncate">
                  {listing.food_type}
                </h4>
                <StatusPill status={listing.status} />
              </div>
              <p className="text-sm text-slate-500">
                {listing.quantity} {listing.quantity_unit}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                {listing.pickup_address}
              </p>
            </div>

            <div className="flex items-center gap-2 ml-4">
              {onViewQR && (
                <button
                  onClick={() => onViewQR(listing)}
                  className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                >
                  QR Code
                </button>
              )}
              {onTrack && (
                <button
                  onClick={() => onTrack(listing)}
                  className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                >
                  Track
                </button>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
