import type { EventCategory } from '../../types'

export interface CategoryStyle {
  label: string
  emoji: string
  color: string        // hex for event block accent / chip bg
  textColor: string    // hex for text on light bg
  bg: string           // light background
  chipCls: string      // tailwind classes for month-view chip
  blockCls: string     // tailwind classes for week/day event block
  dotCls: string       // tailwind class for dot indicator
}

export const categoryConfig: Record<EventCategory, CategoryStyle> = {
  personal: {
    label:    'אישי',
    emoji:    '🌸',
    color:    '#C4B5FD',
    textColor:'#6D28D9',
    bg:       '#F5F3FF',
    chipCls:  'bg-lavender text-violet-800',
    blockCls: 'bg-lavender-light border-lavender text-violet-800',
    dotCls:   'bg-lavender',
  },
  client: {
    label:    'לקוחות',
    emoji:    '💼',
    color:    '#F9A8D4',
    textColor:'#9D174D',
    bg:       '#FDF2F8',
    chipCls:  'bg-dusty-pink text-pink-800',
    blockCls: 'bg-dusty-pink-light border-dusty-pink text-pink-800',
    dotCls:   'bg-dusty-pink',
  },
  health: {
    label:    'בריאות',
    emoji:    '💪',
    color:    '#BBF7D0',
    textColor:'#065F46',
    bg:       '#F0FDF4',
    chipCls:  'bg-mint text-emerald-800',
    blockCls: 'bg-mint-light border-mint text-emerald-800',
    dotCls:   'bg-mint',
  },
  project: {
    label:    'פרויקט',
    emoji:    '📁',
    color:    '#FED7AA',
    textColor:'#92400E',
    bg:       '#FFF7ED',
    chipCls:  'bg-peach text-orange-800',
    blockCls: 'bg-peach-light border-peach text-orange-800',
    dotCls:   'bg-peach',
  },
}
