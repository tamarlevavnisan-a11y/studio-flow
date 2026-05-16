import { useState } from 'react'
import Card from '../components/ui/Card'
import { mockHealth } from '../data/mockData'
import { Droplets, Footprints, Dumbbell, Plus } from 'lucide-react'

/* ─── Donut Chart ─── */
function DonutChart({ value, max, color, size = 160, sw = 16 }: {
  value: number; max: number; color: string; size?: number; sw?: number
}) {
  const r = (size - sw) / 2
  const circ = 2 * Math.PI * r
  const offset = circ * (1 - Math.min(value / max, 1))
  const pct = Math.round((value / max) * 100)
  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#F0EDE9" strokeWidth={sw} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={sw}
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.6s ease' }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-600 text-gray-800" style={{ lineHeight: 1 }}>{value}</span>
        <span className="text-xs text-gray-400 mt-0.5">מתוך {max}</span>
        <span className="text-xs font-medium text-gray-500">קק"ל</span>
        <span className="text-[10px] text-emerald-500 font-medium mt-1">{pct}%</span>
      </div>
    </div>
  )
}

/* ─── Macro Bar ─── */
function MacroBar({ label, value, max, color, emoji }: {
  label: string; value: number; max: number; color: string; emoji: string
}) {
  const pct = Math.min(100, (value / max) * 100)
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-1.5">
          <span>{emoji}</span>
          <span className="text-sm font-medium text-gray-700">{label}</span>
        </div>
        <span className="text-xs text-gray-400">{value}g / {max}g</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
        <div className="h-2.5 rounded-full transition-all duration-600" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
    </div>
  )
}

/* ─── Water Tracker ─── */
function WaterTracker({ current, total, onChange }: { current: number; total: number; onChange: (n: number) => void }) {
  return (
    <div className="flex gap-2 flex-wrap">
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          onClick={() => onChange(i < current ? i : i + 1)}
          className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all duration-300 ${
            i < current
              ? 'bg-blue-400 scale-105 shadow-md shadow-blue-200'
              : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          {i < current ? '💧' : <span className="w-3 h-3 rounded-full bg-gray-200" />}
        </button>
      ))}
    </div>
  )
}

/* ─── Workout Grid ─── */
const workoutPlan = [
  { day: 'א׳', name: 'יוגה',    color: 'bg-lavender-light text-violet-600',    emoji: '🧘' },
  { day: 'ב׳', name: 'ריצה',    color: 'bg-dusty-pink-light text-pink-600',    emoji: '🏃' },
  { day: 'ג׳', name: null,      color: '',                                       emoji: '—' },
  { day: 'ד׳', name: 'כוח',     color: 'bg-peach-light text-orange-600',       emoji: '💪' },
  { day: 'ה׳', name: 'פילטס',   color: 'bg-mint-light text-emerald-600',       emoji: '🤸' },
  { day: 'ו׳', name: null,      color: '',                                       emoji: '—' },
  { day: 'ש׳', name: 'מנוחה',   color: 'bg-butter-light text-yellow-600',      emoji: '😴' },
]

export default function HealthPage() {
  const { calories, water, steps } = mockHealth
  const [waterCurrent, setWaterCurrent] = useState(water.current)

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-600 text-gray-800">בריאות ותזונה</h2>
          <p className="text-sm text-gray-400 mt-0.5">מעקב יומי – {new Date().toLocaleDateString('he-IL', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-white text-sm font-medium px-4 py-2.5 rounded-2xl hover:bg-primary-dark transition-colors shadow-sm"
          style={{ backgroundColor: '#F472B6' }}>
          <Plus size={15} />
          תעד ארוחה
        </button>
      </div>

      {/* Calories + Macros row */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row items-center gap-8">
          {/* Macros */}
          <div className="flex-1 w-full space-y-4">
            <h3 className="text-sm font-500 text-gray-600 mb-4">מאקרו יומי</h3>
            <MacroBar label="חלבון"     value={85}  max={120} color="#C4B5FD" emoji="🥩" />
            <MacroBar label="פחמימות"   value={180} max={220} color="#FBCFE8" emoji="🍞" />
            <MacroBar label="שומן"      value={52}  max={70}  color="#FED7AA" emoji="🫙" />
          </div>

          {/* Donut */}
          <div className="flex flex-col items-center gap-3">
            <DonutChart value={calories.current} max={calories.goal} color="#BBF7D0" />
            <p className="text-xs text-gray-400">קלוריות היום</p>
          </div>
        </div>
      </Card>

      {/* Water tracker */}
      <Card className="p-6" accent="mint">
        <div className="flex items-center gap-2 mb-4">
          <Droplets size={16} className="text-blue-400" />
          <h3 className="text-sm font-500 text-gray-700">מעקב שתייה</h3>
          <span className="text-xs text-gray-400 mr-auto">{waterCurrent}/{water.goal} כוסות</span>
        </div>
        <WaterTracker current={waterCurrent} total={water.goal} onChange={setWaterCurrent} />
        <p className="text-xs text-gray-400 mt-3">
          {waterCurrent >= water.goal
            ? '🎉 הגעת ליעד המים שלך!'
            : `עוד ${water.goal - waterCurrent} כוסות ליעד 💧`}
        </p>
      </Card>

      {/* Steps */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Footprints size={16} className="text-orange-400" />
            <h3 className="text-sm font-500 text-gray-700">צעדים היום</h3>
          </div>
          <span className="text-xs text-gray-400">{steps.current.toLocaleString('he-IL')} / {steps.goal.toLocaleString('he-IL')}</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
          <div className="h-3 rounded-full transition-all duration-600"
            style={{ width: `${Math.min(100, (steps.current / steps.goal) * 100)}%`, backgroundColor: '#FED7AA' }} />
        </div>
        <p className="text-xs text-gray-400 mt-2">
          {Math.round((steps.current / steps.goal) * 100)}% מהיעד היומי
          {steps.current >= steps.goal ? ' 🎉' : ` · עוד ${(steps.goal - steps.current).toLocaleString('he-IL')} צעדים`}
        </p>
      </Card>

      {/* Weekly workout */}
      <Card className="p-6" accent="lavender">
        <div className="flex items-center gap-2 mb-5">
          <Dumbbell size={16} className="text-violet-400" />
          <h3 className="text-sm font-500 text-gray-700">לוח אימונים שבועי</h3>
        </div>
        <div className="grid grid-cols-7 gap-1.5">
          {workoutPlan.map(w => (
            <div key={w.day} className="flex flex-col items-center gap-2">
              <span className="text-[10px] font-medium text-gray-400">{w.day}</span>
              {w.name ? (
                <div className={`w-full rounded-2xl p-2 flex flex-col items-center gap-1 ${w.color}`}>
                  <span className="text-base">{w.emoji}</span>
                  <span className="text-[9px] font-medium leading-tight text-center">{w.name}</span>
                </div>
              ) : (
                <div className="w-full rounded-2xl p-2 flex flex-col items-center gap-1 bg-gray-50">
  				  <span className="text-base text-gray-300">·</span>
                  <span className="text-[9px] text-gray-300 leading-tight">מנוחה</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
