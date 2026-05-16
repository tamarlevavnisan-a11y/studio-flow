import { Heart } from 'lucide-react'
import Card from '../ui/Card'
import { mockHealth } from '../../data/mockData'

function MiniDonut({ value, max, color }: { value: number; max: number; color: string }) {
  const r = 26; const sw = 5
  const nr = r - sw / 2
  const circ = 2 * Math.PI * nr
  const offset = circ * (1 - Math.min(value / max, 1))
  return (
    <svg width={r * 2} height={r * 2} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={r} cy={r} r={nr} fill="none" stroke="#F0EDEA" strokeWidth={sw} />
      <circle cx={r} cy={r} r={nr} fill="none" stroke={color} strokeWidth={sw}
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.5s ease' }} />
    </svg>
  )
}

export default function HealthCard() {
  const { calories, water } = mockHealth

  return (
    <Card accent="mint" className="p-5 flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Heart size={15} className="text-emerald-500" />
        <h3 className="text-sm font-500 text-gray-700">בריאות היום</h3>
      </div>

      {/* Calories ring + water */}
      <div className="flex items-center gap-4">
        <div className="relative flex-shrink-0">
          <MiniDonut value={calories.current} max={calories.goal} color="#BBF7D0" />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[11px] font-600 text-gray-700" style={{ lineHeight: 1 }}>{calories.current}</span>
            <span className="text-[8px] text-gray-400">קק"ל</span>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-gray-500 mb-2">
            {calories.current} / {calories.goal} קק"ל
          </p>
          {/* Water bubbles */}
          <p className="text-[10px] text-gray-400 mb-1.5">💧 מים</p>
          <div className="flex gap-1 flex-wrap">
            {Array.from({ length: water.goal }).map((_, i) => (
              <div key={i} className={`w-4 h-4 rounded-full transition-all duration-300 ${
                i < water.current ? 'bg-blue-300' : 'bg-gray-100'
              }`} />
            ))}
          </div>
          <p className="text-[10px] text-gray-400 mt-1">{water.current}/{water.goal} כוסות</p>
        </div>
      </div>

      {/* Macros quick view */}
      <div className="space-y-2 pt-1 border-t border-gray-50">
        {[
          { label: 'חלבון', value: 85, max: 120, color: '#C4B5FD' },
          { label: 'פחמימות', value: 180, max: 220, color: '#FBCFE8' },
          { label: 'שומן', value: 52, max: 70, color: '#FED7AA' },
        ].map(m => (
          <div key={m.label} className="flex items-center gap-2">
            <span className="text-[10px] text-gray-400 w-14 text-left flex-shrink-0">{m.label}</span>
            <div className="flex-1 bg-gray-100 rounded-full h-1.5 overflow-hidden">
              <div className="h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (m.value / m.max) * 100)}%`, backgroundColor: m.color }} />
            </div>
            <span className="text-[10px] text-gray-400 w-8 text-right flex-shrink-0">{m.value}g</span>
          </div>
        ))}
      </div>
    </Card>
  )
}
