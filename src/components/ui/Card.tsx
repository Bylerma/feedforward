interface CardProps {
  children: React.ReactNode
  className?: string
  padding?: 'sm' | 'md' | 'lg'
  hover?: boolean
}

export function Card({ children, className = '', padding = 'md', hover = false }: CardProps) {
  const paddings = {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  }

  return (
    <div
      className={`bg-white rounded-xl border border-slate-200 shadow-sm ${
        hover ? 'hover:shadow-md hover:border-slate-300 transition-all duration-200' : ''
      } ${paddings[padding]} ${className}`}
    >
      {children}
    </div>
  )
}
