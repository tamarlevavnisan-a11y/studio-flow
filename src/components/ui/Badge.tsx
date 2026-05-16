interface BadgeProps {
  label: string
  variant?: 'lavender' | 'pink' | 'mint' | 'peach' | 'butter' | 'gray' | 'urgent' | 'on-track' | 'waiting' | 'indigo' | 'red'
}

const variants: Record<string, string> = {
  lavender:   'bg-lavender-light text-violet-700',
  pink:       'bg-dusty-pink-light text-pink-700',
  mint:       'bg-mint-light text-emerald-700',
  peach:      'bg-peach-light text-orange-700',
  butter:     'bg-butter-light text-yellow-700',
  gray:       'bg-gray-100 text-gray-600',
  urgent:     'bg-red-100 text-red-600',
  'on-track': 'bg-green-100 text-green-700',
  waiting:    'bg-yellow-100 text-yellow-700',
  indigo:     'bg-indigo-100 text-indigo-700',
  red:        'bg-red-100 text-red-600',
}

export default function Badge({ label, variant = 'gray' }: BadgeProps) {
  return (
    <span className={`inline-block text-xs font-medium px-2.5 py-0.5 rounded-full ${variants[variant] ?? variants.gray}`}>
      {label}
    </span>
  )
}
