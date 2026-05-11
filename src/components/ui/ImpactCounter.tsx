'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface ImpactCounterProps {
  value: number
  suffix?: string
  icon?: string
  duration?: number
}

export function ImpactCounter({ value, suffix, icon, duration = 1.5 }: ImpactCounterProps) {
  const [count, setCount] = useState(0)

  useEffect(() => {
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
    return () => clearInterval(timer)
  }, [value, duration])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
      className="flex items-center gap-2"
    >
      {icon && <span className="text-xl">{icon}</span>}
      <span className="font-mono text-2xl font-bold text-slate-900">
        {count.toLocaleString()}
      </span>
      {suffix && <span className="text-sm text-slate-500">{suffix}</span>}
    </motion.div>
  )
}
