import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const supplier_id = searchParams.get('supplier_id')
    const ngo_id = searchParams.get('ngo_id')
    const volunteer_id = searchParams.get('volunteer_id')

    let query = supabase.from('impact_logs').select('*')

    if (supplier_id) query = query.eq('supplier_id', supplier_id)
    if (ngo_id) query = query.eq('ngo_id', ngo_id)
    if (volunteer_id) query = query.eq('volunteer_id', volunteer_id)

    const { data, error } = await query.order('timestamp', { ascending: false })

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    const summary = (data || []).reduce(
      (acc, log) => ({
        total_meals: acc.total_meals + log.meals_rescued,
        total_carbon_kg: acc.total_carbon_kg + Number(log.carbon_saved_kg),
        total_food_kg: acc.total_food_kg + Number(log.food_weight_kg),
        total_points: acc.total_points + log.points_awarded,
        total_runs: acc.total_runs + 1,
      }),
      { total_meals: 0, total_carbon_kg: 0, total_food_kg: 0, total_points: 0, total_runs: 0 }
    )

    return NextResponse.json({ success: true, data: { logs: data, summary } })
  } catch {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
