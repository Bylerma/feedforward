import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { verifyQRToken } from '@/lib/qr/tokens'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { qr_token, stage, match_id, volunteer_id } = await request.json()

    if (!qr_token || !stage || !match_id || !volunteer_id) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 })
    }

    let payload
    try {
      payload = verifyQRToken(qr_token)
    } catch {
      return NextResponse.json({ success: false, error: 'Invalid or expired QR token' }, { status: 401 })
    }

    const { data: match } = await supabase
      .from('matches')
      .select('*')
      .eq('id', match_id)
      .single()

    if (!match) {
      return NextResponse.json({ success: false, error: 'Match not found' }, { status: 404 })
    }

    if (match.volunteer_id !== volunteer_id) {
      return NextResponse.json({ success: false, error: 'Unauthorized: volunteer not assigned to this match' }, { status: 403 })
    }

    if (stage === 'pickup') {
      await supabase
        .from('matches')
        .update({
          status: 'supplier_verified',
          supplier_scanned_at: new Date().toISOString(),
        })
        .eq('id', match_id)
    } else if (stage === 'delivery') {
      await supabase
        .from('matches')
        .update({
          status: 'completed',
          ngo_scanned_at: new Date().toISOString(),
          completed_at: new Date().toISOString(),
        })
        .eq('id', match_id)
    } else {
      return NextResponse.json({ success: false, error: 'Invalid stage' }, { status: 400 })
    }

    return NextResponse.json({ success: true, data: { stage, completed: stage === 'delivery' } })
  } catch {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
