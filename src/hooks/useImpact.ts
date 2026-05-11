'use client'

import { useMemo } from 'react'
import { calculateImpact, calculatePoints } from '@/lib/impact/calculator'

export function useImpact(quantity: number, category: string, deliveryMinutes: number, isFirstRun: boolean) {
  return useMemo(() => {
    const impact = calculateImpact(quantity, category)
    const points = calculatePoints(impact.meals_rescued, deliveryMinutes, isFirstRun)
    return { ...impact, points }
  }, [quantity, category, deliveryMinutes, isFirstRun])
}
