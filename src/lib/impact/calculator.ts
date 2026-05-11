const FOOD_DATA: Record<string, { meals_per_unit: number; kg_per_unit: number; carbon_factor: number }> = {
  cooked: { meals_per_unit: 1.0, kg_per_unit: 0.35, carbon_factor: 2.5 },
  raw: { meals_per_unit: 0.8, kg_per_unit: 0.40, carbon_factor: 1.8 },
  packaged: { meals_per_unit: 1.2, kg_per_unit: 0.30, carbon_factor: 3.0 },
  bakery: { meals_per_unit: 0.5, kg_per_unit: 0.15, carbon_factor: 1.5 },
  dairy: { meals_per_unit: 0.3, kg_per_unit: 0.25, carbon_factor: 3.2 },
  produce: { meals_per_unit: 0.6, kg_per_unit: 0.45, carbon_factor: 1.2 },
}

export function calculateImpact(quantity: number, category: string) {
  const data = FOOD_DATA[category] || FOOD_DATA.cooked
  const meals_rescued = Math.round(quantity * data.meals_per_unit)
  const food_weight_kg = quantity * data.kg_per_unit
  const carbon_saved_kg = food_weight_kg * data.carbon_factor

  return { meals_rescued, food_weight_kg, carbon_saved_kg }
}

export const POINTS_CONFIG = {
  per_meal_rescued: 2,
  speed_bonus: 50,
  first_run: 100,
  streak_3_days: 75,
  streak_7_days: 200,
  perfect_week: 500,
}

export const BADGE_THRESHOLDS: Record<string, { condition: (runs: number, meals: number, streak: number, fast: number) => boolean; label: string; icon: string }> = {
  first_rescue: { condition: (runs) => runs >= 1, label: 'First Rescue', icon: '🌟' },
  speed_runner: { condition: (_runs, _meals, _streak, fast) => fast >= 3, label: 'Speed Runner', icon: '🚀' },
  hundred_meals: { condition: (_runs, meals) => meals >= 100, label: '100 Meals', icon: '🍱' },
  seven_streak: { condition: (_runs, _meals, streak) => streak >= 7, label: '7-Day Streak', icon: '🔥' },
  bridge_captain: { condition: (_runs, meals) => meals >= 500, label: 'Bridge Captain', icon: '👑' },
  city_hero: { condition: (_runs, meals) => meals >= 1000, label: 'City Hero', icon: '🦸' },
  thousand_meals: { condition: (_runs, meals) => meals >= 1000, label: '1K Meals', icon: '🏆' },
}

export function calculatePoints(meals_rescued: number, delivery_time_minutes: number, is_first_run: boolean): number {
  let points = meals_rescued * POINTS_CONFIG.per_meal_rescued

  if (delivery_time_minutes < 90) {
    points += POINTS_CONFIG.speed_bonus
  }

  if (is_first_run) {
    points += POINTS_CONFIG.first_run
  }

  return points
}
