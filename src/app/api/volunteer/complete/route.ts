import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { calculateImpact, calculatePoints } from '@/lib/impact/calculator'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { match_id } = await request.json()

    const { data: match } = await supabase
      .from('matches')
      .select('*, listing:listing_id(*)')
      .eq('id', match_id)
      .single()

    if (!match) {
      return NextResponse.json({ success: false, error: 'Match not found' }, { status: 404 })
    }

    const listing = match.listing
    const impact = calculateImpact(listing.quantity, listing.food_category)

    const completedAt = new Date(match.completed_at || new Date())
    const claimedAt = new Date(match.claimed_at || completedAt)
    const deliveryTimeMinutes = (completedAt.getTime() - claimedAt.getTime()) / 60000

    const points = calculatePoints(impact.meals_rescued, deliveryTimeMinutes, false)

    const { data: impactLog } = await supabase
      .from('impact_logs')
      .insert({
        match_id: match.id,
        supplier_id: listing.supplier_id,
        ngo_id: match.ngo_id,
        volunteer_id: match.volunteer_id,
        meals_rescued: impact.meals_rescued,
        food_weight_kg: impact.food_weight_kg,
        carbon_saved_kg: impact.carbon_saved_kg,
        points_awarded: points,
      })
      .select()
      .single()

    if (match.volunteer_id) {
      await supabase.rpc('add_volunteer_points', {
        volunteer_id: match.volunteer_id,
        points_to_add: points,
      })
    }

    return NextResponse.json({ success: true, data: { impact: impactLog, points_awarded: points } })
  } catch {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
