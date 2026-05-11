import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { match_id, listing_id } = await request.json()

    const { data: match } = await supabase
      .from('matches')
      .select('*')
      .eq('id', match_id)
      .single()

    if (!match) {
      return NextResponse.json({ success: false, error: 'Match not found' }, { status: 404 })
    }

    const { data: volunteers } = await supabase
      .from('users')
      .select('id')
      .eq('role', 'volunteer')
      .limit(10)

    const notifications = (volunteers || []).map((v) => ({
      user_id: v.id,
      type: 'new_listing',
      title: 'New food rescue available!',
      body: 'A new surplus food listing needs a volunteer nearby.',
      data: { match_id, listing_id },
    }))

    if (notifications.length > 0) {
      await supabase.from('notifications').insert(notifications)
    }

    return NextResponse.json({ success: true, data: { notified: notifications.length } })
  } catch {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
