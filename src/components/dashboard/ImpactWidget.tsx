'use client'

import { ImpactCounter } from '@/components/ui/ImpactCounter'

interface ImpactWidgetProps {
  mealsRescued: number
  carbonSaved: number
  runsCompleted: number
}

export function ImpactWidget({ mealsRescued, carbonSaved, runsCompleted }: ImpactWidgetProps) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="p-4 bg-white rounded-xl border border-slate-200">
        <ImpactCounter value={mealsRescued} suffix="Meals Rescued" icon="🍱" />
      </div>
      <div className="p-4 bg-white rounded-xl border border-slate-200">
        <ImpactCounter value={carbonSaved} suffix="kg CO₂ Saved" icon="🌿" />
      </div>
      <div className="p-4 bg-white rounded-xl border border-slate-200">
        <ImpactCounter value={runsCompleted} suffix="Runs Done" icon="♻️" />
      </div>
    </div>
  )
}
