import type { ListingStatus, MatchStatus } from '@/types'

const STATUS_MAP: Record<string, { color: string; label: string }> = {
  available: { color: 'bg-[var(--status-available)]', label: 'Available' },
  matched: { color: 'bg-[var(--status-matched)]', label: 'Matched' },
  claimed: { color: 'bg-[var(--status-claimed)]', label: 'Claimed' },
  picked_up: { color: 'bg-[var(--status-picked_up)]', label: 'Picked Up' },
  delivered: { color: 'bg-[var(--status-delivered)]', label: 'Delivered' },
  cancelled: { color: 'bg-[var(--status-cancelled)]', label: 'Cancelled' },
  expired: { color: 'bg-slate-400', label: 'Expired' },
  pending: { color: 'bg-[var(--status-matched)]', label: 'Pending' },
  volunteer_assigned: { color: 'bg-[var(--status-claimed)]', label: 'Volunteer Assigned' },
  supplier_verified: { color: 'bg-[var(--status-picked_up)]', label: 'Pickup Verified' },
  ngo_verified: { color: 'bg-[var(--status-delivered)]', label: 'Delivery Verified' },
  completed: { color: 'bg-[var(--status-delivered)]', label: 'Completed' },
  failed: { color: 'bg-[var(--status-cancelled)]', label: 'Failed' },
}

interface StatusPillProps {
  status: ListingStatus | MatchStatus
}

export function StatusPill({ status }: StatusPillProps) {
  const config = STATUS_MAP[status] || { color: 'bg-slate-400', label: status }

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
      <span className={`w-1.5 h-1.5 rounded-full ${config.color}`} />
      {config.label}
    </span>
  )
}
