import { useState } from 'react'
import Card from '../ui/Card'
import { useNutrition } from '../../store/NutritionContext'

type Period = 'week' | 'month'

const CHART_W = 600
const CHART_H = 140
const BAR_AREA_H = 110
const LABEL_H = 30

export default function NutritionHistory() {
  const { getWeeklyData, getMonthlyData, goals } = useNutrition()
  const [period, setPeriod] = useState<Period>('week')

  const data = period === 'week' ? getWeeklyData() : getMonthlyData()
  const n = data.length
  const barW = Math.max(4, (CHART_W / n) - (period === 'week' ? 8 : 2))
  const gap  = (CHART_W / n) - barW
  const chartMax = goals.calories * 1.4

  const goalY = BAR_AREA_H - (goals.calories / chartMax) * BAR_AREA_H

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-600 text-gray-700">היסטוריית קלוריות</h3>
          <p className="text-xs text-gray-400 mt-0.5">קו מקווקו = יעד יומי ({goals.calories} קק"ל)</p>
        </div>
        <div className="flex bg-gray-50 rounded-2xl p-1">
          {(['week', 'month'] as Period[]).map(p => (
            <button key={p} onClick={() => setPeriod(p)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 ${
                period === p ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-400 hover:text-gray-600'
              }`}>
              {p === 'week' ? 'שבוע' : 'חודש'}
            </button>
          ))}
        </div>
      </div>

      <svg viewBox={`0 0 ${CHART_W} ${CHART_H}`} className="w-full" style={{ height: 160 }}>
        {/* Grid lines */}
        {[0.25, 0.5, 0.75, 1].map(f => {
          const y = BAR_AREA_H - f * BAR_AREA_H
          return (
            <line key={f} x1={0} y1={y} x2={CHART_W} y2={y}
              stroke="#F0EDE9" strokeWidth={1} />
          )
        })}

        {/* Bars */}
        {data.map((d, i) => {
          const barH = d.calories > 0
            ? Math.min(BAR_AREA_H, (d.calories / chartMax) * BAR_AREA_H)
            : 0
          const barY = BAR_AREA_H - barH
          const barX = i * (CHART_W / n) + gap / 2
          const over = d.calories > goals.calories
          const fill = d.calories === 0 ? '#F5F3F0'
            : over ? '#FED7AA' : '#BBF7D0'

          return (
            <g key={d.dateStr}>
              <rect x={barX} y={barY} width={barW} height={barH}
                fill={fill} rx={period === 'week' ? 6 : 3} />
              {/* Label */}
              {(period === 'week' || i % 5 === 0) && (
                <text x={barX + barW / 2} y={CHART_H - 4}
                  textAnchor="middle" fontSize={period === 'week' ? 11 : 9}
                  fill="#9CA3AF" fontFamily="Heebo, sans-serif">
                  {d.label}
                </text>
              )}
              {/* Calorie value on hover — always show for weekly */}
              {period === 'week' && d.calories > 0 && (
                <text x={barX + barW / 2} y={barY - 4}
                  textAnchor="middle" fontSize={9} fill="#6B7280" fontFamily="Heebo, sans-serif">
                  {d.calories}
                </text>
              )}
            </g>
          )
        })}

        {/* Goal line */}
        <line x1={0} y1={goalY} x2={CHART_W} y2={goalY}
          stroke="#C4B5FD" strokeWidth={1.5} strokeDasharray="6 4" />
        <text x={CHART_W - 2} y={goalY - 4} textAnchor="end"
          fontSize={9} fill="#C4B5FD" fontFamily="Heebo, sans-serif">
          יעד
        </text>
      </svg>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-3 text-[11px] text-gray-400">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-mint inline-block" /> מתחת ליעד
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-peach inline-block" /> מעל היעד
        </span>
      </div>
    </Card>
  )
}
