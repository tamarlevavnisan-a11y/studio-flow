import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  accent?: 'lavender' | 'pink' | 'mint' | 'peach' | 'butter'
  hover?: boolean
  onClick?: () => void
}

const accentTop: Record<string, string> = {
  lavender: 'border-t-4 border-t-lavender',
  pink:     'border-t-4 border-t-dusty-pink',
  mint:     'border-t-4 border-t-mint',
  peach:    'border-t-4 border-t-peach',
  butter:   'border-t-4 border-t-butter',
}

export default function Card({ children, className = '', accent, hover = false, onClick }: CardProps) {
  const accentCls = accent ? accentTop[accent] : ''
  const hoverCls  = hover  ? 'cursor-pointer hover:-translate-y-0.5 hover:shadow-[0_6px_24px_rgba(0,0,0,0.10)] transition-all duration-200' : ''
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-[20px] shadow-[0_2px_12px_rgba(0,0,0,0.06)] ${accentCls} ${hoverCls} ${className}`}
    >
      {children}
    </div>
  )
}
