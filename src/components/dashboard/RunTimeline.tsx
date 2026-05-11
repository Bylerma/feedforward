'use client'

interface TimelineStep {
  label: string
  time?: string
  completed: boolean
  active: boolean
}

interface RunTimelineProps {
  steps: TimelineStep[]
}

export function RunTimeline({ steps }: RunTimelineProps) {
  return (
    <div className="space-y-0">
      {steps.map((step, idx) => (
        <div key={idx} className="flex gap-3">
          <div className="flex flex-col items-center">
            <div
              className={`w-3 h-3 rounded-full border-2 ${
                step.completed
                  ? 'bg-primary-500 border-primary-500'
                  : step.active
                  ? 'bg-accent-500 border-accent-500'
                  : 'bg-white border-slate-300'
              }`}
            />
            {idx < steps.length - 1 && (
              <div
                className={`w-0.5 h-8 ${
                  step.completed ? 'bg-primary-200' : 'bg-slate-200'
                }`}
              />
            )}
          </div>
          <div className={`pb-6 ${step.active ? 'text-slate-900' : step.completed ? 'text-slate-500' : 'text-slate-400'}`}>
            <p className="text-sm font-medium">{step.label}</p>
            {step.time && <p className="text-xs text-slate-400 mt-0.5">{step.time}</p>}
          </div>
        </div>
      ))}
    </div>
  )
}
