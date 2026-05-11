'use client'

import { Card } from '@/components/ui/Card'

interface DataPoint {
  month: string
  meals: number
  carbon: number
}

interface CarbonChartProps {
  data?: DataPoint[]
}

const DEFAULT_DATA: DataPoint[] = [
  { month: 'Jan', meals: 400, carbon: 200 },
  { month: 'Feb', meals: 600, carbon: 300 },
  { month: 'Mar', meals: 800, carbon: 400 },
  { month: 'Apr', meals: 500, carbon: 250 },
  { month: 'May', meals: 900, carbon: 450 },
  { month: 'Jun', meals: 1100, carbon: 550 },
]

export function CarbonChart({ data = DEFAULT_DATA }: CarbonChartProps) {
  const maxMeals = Math.max(...data.map((d) => d.meals), 1)

  return (
    <Card>
      <h3 className="text-sm font-semibold text-slate-900 mb-4">Monthly Impact</h3>
      <div className="flex items-end gap-2 h-32">
        {data.map((point) => (
          <div key={point.month} className="flex-1 flex flex-col items-center gap-1">
            <div className="w-full flex flex-col-reverse gap-0.5 relative" style={{ height: `${(point.meals / maxMeals) * 100}%` }}>
              <div
                className="w-full bg-primary-400 rounded-t"
                style={{ height: '60%' }}
              />
              <div
                className="w-full bg-primary-600 rounded-t"
                style={{ height: '40%' }}
              />
            </div>
            <span className="text-[10px] text-slate-500">{point.month}</span>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded bg-primary-400" /> Meals
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded bg-primary-600" /> CO₂
        </div>
      </div>
    </Card>
  )
}
