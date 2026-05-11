'use client'

import { useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import type { Listing, Match } from '@/types'

export function useListingRealtime(onNewListing: (listing: Listing) => void) {
  useEffect(() => {
    const channel = supabase
      .channel('volunteer-map')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'listings',
          filter: 'status=eq.available',
        },
        (payload) => onNewListing(payload.new as Listing)
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])
}

export function useMatchStatus(match_id: string | undefined, onUpdate: (match: Match) => void) {
  useEffect(() => {
    if (!match_id) return

    const channel = supabase
      .channel(`match:${match_id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'matches',
          filter: `id=eq.${match_id}`,
        },
        (payload) => onUpdate(payload.new as Match)
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [match_id])
}

export function useNGOAlerts(ngo_id: string | undefined, onAlert: (payload: Record<string, unknown>) => void) {
  useEffect(() => {
    if (!ngo_id) return

    const channel = supabase
      .channel(`ngo-alerts:${ngo_id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'matches',
          filter: `ngo_id=eq.${ngo_id}`,
        },
        (payload) => onAlert(payload.new as unknown as Record<string, unknown>)
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [ngo_id])
}
