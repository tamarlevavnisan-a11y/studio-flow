import { Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import Card from '../ui/Card'
import { useNutrition } from '../../store/NutritionContext'
import type { MealEntry } from '../../types'

function fmtDate(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}

function DonutRing({ value, max, color, size = 100, sw = 9 }: { value: number; max: number; color: string; size?: number; sw?: number }) {
  const r = (size - sw) / 2
  const c = 2 * Math.PI * r
  const offset = c * (1 - Math.min(value / max, 1))
  const pct = Math.round((value / max) * 100)
  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#F0EDE9" strokeWidth={sw} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={sw}
          strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.6s ease' }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-700 text-gray-800" style={{ lineHeight: 1 }}>{value}</span>
        <span className="text-[9px] text-gray-400">{pct}%</span>
      </div>
    </div>
  )
}

function MacroBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = Math.min(100, (value / max) * 100)
  const over = value > max
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-gray-600 font-medium">{label}</span>
        <span className={over ? 'text-orange-500 font-500' : 'text-gray-400'}>{value}g / {max}g</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
        <div className="h-2 rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: over ? '#FB923C' : color }} />
      </div>
    </div>
  )
}

function MealRow({ meal, onDelete }: { meal: MealEntry; onDelete: () => void }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border border-gray-50 rounded-2xl overflow-hidden">
      <div className="flex items-center gap-3 px-3 py-2.5 bg-white">
        <button onClick={() => setOpen(o => !o)} className="flex-1 flex items-center gap-2 text-right min-w-0">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-500 text-gray-700 truncate">{meal.name}</p>
            <p className="text-[10px] text-gray-400">{meal.time} · {meal.items.length} פריטים</p>
          </div>
          <span className="text-sm font-600 text-gray-600 flex-shrink-0">{meal.totalCalories} קק"ל</span>
          {open ? <ChevronUp size={14} className="text-gray-400" /> : <ChevronDown size={14} className="text-gray-400" />}
        </button>
        <button onClick={onDelete} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-300 hover:text-red-400 transition-colors flex-shrink-0">
          <Trash2 size={13} />
        </button>
      </div>
      {open && meal.items.length > 0 && (
        <div className="px-3 pb-2.5 pt-1 bg-gray-50 border-t border-gray-50 space-y-1">
          {meal.items.map((item, i) => (
            <div key={i} className="flex justify-between text-[11px] text-gray-500">
              <span>{item.foodName} ×{item.quantity}</span>
              <span>{Math.round(item.calories)} קק"ל</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function DailySummaryCard() {
  const { getDailyLogs, getDailyTotals, deleteMeal, goals } = useNutrition()
  const today = fmtDate(new Date())
  const meals = getDailyLogs(today)
  const totals = getDailyTotals(today)
  const remaining = goals.calories - totals.calories

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-600 text-gray-700">סיכום יומי</h3>
          <p className="text-xs text-gray-400 mt-0.5">
            {new Date().toLocaleDateString('he-IL', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>
        <div className={`text-xs font-500 px-2.5 py-1 rounded-full ${
          remaining >= 0 ? 'bg-mint-light text-emerald-700' : 'bg-peach-light text-orange-700'
        }`}>
          {remaining >= 0 ? `נותרו ${remaining} קק"ל` : `חרגת ב-${Math.abs(remaining)} קק"ל`}
        </div>
      </div>

      <div className="flex gap-6 items-center mb-5">
        {/* Calorie donut */}
        <DonutRing value={totals.calories} max={goals.calories} color="#BBF7D0" size={110} sw={11} />

        {/* Macros */}
        <div className="flex-1 space-y-3">
          <MacroBar label="🥩 חלבון"   value={Math.round(totals.protein)} max={goals.protein} color="#C4B5FD" />
          <MacroBar label="🍞 פחמימות" value={Math.round(totals.carbs)}   max={goals.carbs}   color="#FBCFE8" />
          <MacroBar label="🫙 שומן"    value={Math.round(totals.fat)}     max={goals.fat}     color="#FED7AA" />
        </div>
      </div>

      {/* Meals list */}
      <div>
        <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wide mb-2">ארוחות היום ({meals.length})</p>
        {meals.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">טרם תועדו ארוחות היום</p>
        ) : (
          <div className="space-y-1.5">
            {meals.map(meal => (
              <MealRow key={meal.id} meal={meal} onDelete={() => deleteMeal(meal.id)} />
            ))}
          </div>
        )}
      </div>
    </Card>
  )
}
