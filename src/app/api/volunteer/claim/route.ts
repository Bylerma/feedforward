import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { match_id } = await request.json()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('users')
      .select('id')
      .eq('auth_id', user.id)
      .single()

    if (!profile) {
      return NextResponse.json({ success: false, error: 'Profile not found' }, { status: 404 })
    }

    const { data: match, error: matchError } = await supabase
      .from('matches')
      .update({
        volunteer_id: profile.id,
        status: 'volunteer_assigned',
        claimed_at: new Date().toISOString(),
      })
      .eq('id', match_id)
      .eq('status', 'pending')
      .select()
      .single()

    if (matchError || !match) {
      return NextResponse.json({ success: false, error: 'Match not available or already claimed' }, { status: 400 })
    }

    return NextResponse.json({ success: true, data: match })
  } catch {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
