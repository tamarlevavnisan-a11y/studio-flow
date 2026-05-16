import { useState } from 'react'
import { Droplets, Footprints, Dumbbell, Plus, Target } from 'lucide-react'
import Card from '../components/ui/Card'
import LogMealModal from '../components/health/LogMealModal'
import GoalsModal from '../components/health/GoalsModal'
import DailySummaryCard from '../components/health/DailySummaryCard'
import NutritionHistory from '../components/health/NutritionHistory'
import { mockHealth } from '../data/mockData'

const workoutPlan = [
  { day: 'א׳', name: 'יוגה',    color: 'bg-lavender-light text-violet-700',  emoji: '🧘' },
  { day: 'ב׳', name: 'ריצה',    color: 'bg-dusty-pink-light text-pink-700',  emoji: '🏃' },
  { day: 'ג׳', name: null,      color: '',                                    emoji: '' },
  { day: 'ד׳', name: 'כוח',     color: 'bg-peach-light text-orange-700',     emoji: '💪' },
  { day: 'ה׳', name: 'פילטס',   color: 'bg-mint-light text-emerald-700',     emoji: '🤸' },
  { day: 'ו׳', name: null,      color: '',                                    emoji: '' },
  { day: 'ש׳', name: 'מנוחה',   color: 'bg-butter-light text-yellow-700',    emoji: '😴' },
]

export default function HealthPage() {
  const { water, steps } = mockHealth
  const [waterCurrent, setWaterCurrent] = useState(water.current)
  const [showLogMeal, setShowLogMeal] = useState(false)
  const [showGoals, setShowGoals]    = useState(false)

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-600 text-gray-800">בריאות ותזונה</h2>
          <p className="text-sm text-gray-400 mt-0.5">
            {new Date().toLocaleDateString('he-IL', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowGoals(true)}
            className="flex items-center gap-2 text-sm font-500 px-4 py-2.5 rounded-2xl bg-white border border-gray-100 text-gray-600 hover:border-lavender transition-all shadow-sm">
            <Target size={14} className="text-violet-400" />
            יעדים
          </button>
          <button onClick={() => setShowLogMeal(true)}
            className="flex items-center gap-2 text-sm font-500 px-4 py-2.5 rounded-2xl text-white transition-all hover:opacity-90 shadow-sm"
            style={{ backgroundColor: '#F472B6' }}>
            <Plus size={15} />
            תעד ארוחה
          </button>
        </div>
      </div>

      {/* Daily summary — main card with donut + macros + meals */}
      <DailySummaryCard />

      {/* History chart */}
      <NutritionHistory />

      {/* Water tracker */}
      <Card className="p-5" accent="mint">
        <div className="flex items-center gap-2 mb-4">
          <Droplets size={16} className="text-blue-400" />
          <h3 className="text-sm font-500 text-gray-700">מעקב שתייה</h3>
          <span className="text-xs text-gray-400 mr-auto">{waterCurrent}/{water.goal} כוסות</span>
        </div>
        <div className="flex gap-2 flex-wrap">
          {Array.from({ length: water.goal }).map((_, i) => (
            <button key={i}
              onClick={() => setWaterCurrent(i < waterCurrent ? i : i + 1)}
              className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all duration-300 ${
                i < waterCurrent ? 'bg-blue-400 scale-105 shadow-md shadow-blue-200' : 'bg-gray-100 hover:bg-gray-200'
              }`}>
              {i < waterCurrent ? '💧' : <span className="w-3 h-3 rounded-full bg-gray-200" />}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-3">
          {waterCurrent >= water.goal
            ? '🎉 הגעת ליעד המים שלך!'
            : `עוד ${water.goal - waterCurrent} כוסות ליעד 💧`}
        </p>
      </Card>

      {/* Steps */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Footprints size={16} className="text-orange-400" />
            <h3 className="text-sm font-500 text-gray-700">צעדים היום</h3>
          </div>
          <span className="text-xs text-gray-400">
            {steps.current.toLocaleString('he-IL')} / {steps.goal.toLocaleString('he-IL')}
          </span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
          <div className="h-3 rounded-full transition-all duration-600"
            style={{ width: `${Math.min(100, (steps.current / steps.goal) * 100)}%`, backgroundColor: '#FED7AA' }} />
        </div>
        <p className="text-xs text-gray-400 mt-2">
          {Math.round((steps.current / steps.goal) * 100)}% מהיעד
          {steps.current < steps.goal && ` · עוד ${(steps.goal - steps.current).toLocaleString('he-IL')} צעדים`}
        </p>
      </Card>

      {/* Weekly workout */}
      <Card className="p-5" accent="lavender">
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
                  <span className="text-[9px] text-gray-300">מנוחה</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      {showLogMeal && <LogMealModal onClose={() => setShowLogMeal(false)} />}
      {showGoals    && <GoalsModal  onClose={() => setShowGoals(false)}   />}
    </div>
  )
}
