import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { listing_id } = await request.json()

    const { data: listing } = await supabase
      .from('listings')
      .select('*, supplier:supplier_id(*)')
      .eq('id', listing_id)
      .single()

    if (!listing) {
      return NextResponse.json({ success: false, error: 'Listing not found' }, { status: 404 })
    }

    const { data: ngos } = await supabase
      .from('users')
      .select('*')
      .eq('role', 'ngo')
      .eq('is_verified', true)
      .order('created_at', { ascending: true })

    if (!ngos || ngos.length === 0) {
      return NextResponse.json({
        success: true,
        data: { matched: false, message: 'No NGOs available in the area' },
      })
    }

    const matchedNGO = ngos[0]

    const { data: match, error } = await supabase
      .from('matches')
      .insert({
        listing_id: listing_id,
        ngo_id: matchedNGO.id,
        status: 'pending',
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    await supabase
      .from('listings')
      .update({ status: 'matched' })
      .eq('id', listing_id)

    return NextResponse.json({
      success: true,
      data: {
        match,
        ngo: { id: matchedNGO.id, org_name: matchedNGO.org_name, name: matchedNGO.name },
        matched: true,
      },
    })
  } catch {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
