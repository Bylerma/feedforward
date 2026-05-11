import { create } from 'zustand'
import type { Match } from '@/types'

interface RunState {
  activeRun: Match | null
  step: 'idle' | 'to_supplier' | 'pickup_scan' | 'to_ngo' | 'delivery_scan' | 'complete'
  setActiveRun: (run: Match | null) => void
  setStep: (step: RunState['step']) => void
  advanceStep: () => void
  resetRun: () => void
}

const STEP_ORDER: RunState['step'][] = [
  'idle',
  'to_supplier',
  'pickup_scan',
  'to_ngo',
  'delivery_scan',
  'complete',
]

export const useRunStore = create<RunState>((set, get) => ({
  activeRun: null,
  step: 'idle',
  setActiveRun: (run) => set({ activeRun: run, step: run ? 'to_supplier' : 'idle' }),
  setStep: (step) => set({ step }),
  advanceStep: () => {
    const current = get().step
    const idx = STEP_ORDER.indexOf(current)
    if (idx < STEP_ORDER.length - 1) {
      set({ step: STEP_ORDER[idx + 1] })
    }
  },
  resetRun: () => set({ activeRun: null, step: 'idle' }),
}))
