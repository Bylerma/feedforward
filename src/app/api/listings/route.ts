import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateQRToken } from '@/lib/qr/tokens'
import { geocodeAddress } from '@/lib/mapbox/geocode'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || 'available'
    const lat = searchParams.get('lat')
    const lng = searchParams.get('lng')

    const supabase = await createClient()

    let query = supabase
      .from('listings')
      .select('*, supplier:supplier_id(name, org_name)')
      .eq('status', status)
      .order('created_at', { ascending: false })

    if (lat && lng) {
      query = query.order('pickup_location', { ascending: true })
    }

    const { data, error } = await query

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (e) {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const {
      data: { user },
    } = await supabase.auth.getUser()

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

    const coords = await geocodeAddress(body.pickup_address)
    const expiresAt = new Date(body.pickup_window_end).toISOString()
    const qrToken = generateQRToken({
      listing_id: 'new',
      supplier_id: profile.id,
      type: 'supplier',
      expires_at: expiresAt,
    })

    const { data: listing, error } = await supabase
      .from('listings')
      .insert({
        supplier_id: profile.id,
        food_type: body.food_type,
        food_category: body.food_category,
        quantity: body.quantity,
        quantity_unit: body.quantity_unit || 'servings',
        description: body.description,
        pickup_window: `[${body.pickup_window_start}, ${body.pickup_window_end}]`,
        pickup_location: coords ? `POINT(${coords.lng} ${coords.lat})` : null,
        pickup_address: body.pickup_address,
        image_url: body.image_url,
        qr_token: qrToken,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: listing,
      qr_url: `${process.env.NEXT_PUBLIC_APP_URL}/verify?token=${qrToken}&role=supplier`,
    })
  } catch (e) {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
