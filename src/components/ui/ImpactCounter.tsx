'use client'

import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

interface ImpactCounterProps {
  value: number
  suffix?: string
  icon?: string
  duration?: number
}

export function ImpactCounter({ value, suffix, icon, duration = 1.5 }: ImpactCounterProps) {
  const [count, setCount] = useState(0)
  const [hasAnimated, setHasAnimated] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true)
          let start = 0
          const increment = value / (duration * 60)
          const timer = setInterval(() => {
            start += increment
            if (start >= value) {
              setCount(value)
              clearInterval(timer)
            } else {
              setCount(Math.floor(start))
            }
          }, 1000 / 60)
        }
      },
      { threshold: 0.3 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [value, duration, hasAnimated])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={hasAnimated ? { opacity: 1, y: 0 } : {}}
      transition={{ type: 'spring', stiffness: 120, damping: 15 }}
      className="text-center p-4 bg-white/80 backdrop-blur rounded-xl border border-slate-200"
    >
      <p className="text-2xl">{icon}</p>
      <p className="mt-1 font-mono text-2xl font-bold text-slate-900">
        {count.toLocaleString()}+
      </p>
      <p className="text-sm text-slate-500">{suffix}</p>
    </motion.div>
  )
}
