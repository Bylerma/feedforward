import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('impact_logs')
      .select('meals_rescued, carbon_saved_kg, food_weight_kg, points_awarded')

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

    return NextResponse.json({ success: true, data: summary })
  } catch {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
