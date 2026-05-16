import { useState } from 'react'
import { useCalendar } from '../../store/CalendarContext'
import { categoryConfig } from './categoryConfig'
import EventDetailModal from './EventDetailModal'
import AddEventModal from './AddEventModal'
import type { CalendarEvent } from '../../types'

const DAY_NAMES = ['א׳', 'ב׳', 'ג׳', 'ד׳', 'ה׳', 'ו׳', 'ש׳'] // Sun–Sat

function pad(n: number) { return String(n).padStart(2, '0') }

interface Props {
  year: number
  month: number  // 0-indexed
}

export default function MonthView({ year, month }: Props) {
  const { events } = useCalendar()
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [addDate, setAddDate] = useState<string | null>(null)

  const today = new Date()
  const todayStr = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`

  const firstDow = new Date(year, month, 1).getDay()       // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  // Build cell array: nulls for leading empty cells, then day numbers
  const cells: (number | null)[] = [
    ...Array(firstDow).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]
  // Pad to complete last row
  while (cells.length % 7 !== 0) cells.push(null)

  function dayStr(day: number) {
    return `${year}-${pad(month + 1)}-${pad(day)}`
  }

  function dayEvents(day: number) {
    return events.filter(e => e.date === dayStr(day))
  }

  return (
    <div className="bg-white rounded-[20px] overflow-hidden" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
      {/* Day headers */}
      <div className="grid grid-cols-7 border-b border-gray-50">
        {DAY_NAMES.map(d => (
          <div key={d} className="text-center text-xs font-500 text-gray-400 py-3">{d}</div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 divide-x divide-y divide-gray-50" style={{ direction: 'ltr' }}>
        {cells.map((day, i) => {
          if (!day) return <div key={`e-${i}`} className="min-h-[100px] bg-gray-50/30" />
          const ds = dayStr(day)
          const de = dayEvents(day)
          const isToday = ds === todayStr
          const allDayEvs = de.filter(e => e.allDay)
          const timedEvs  = de.filter(e => !e.allDay)

          return (
            <div
              key={day}
              onClick={() => setAddDate(ds)}
              className={`min-h-[100px] p-1.5 cursor-pointer transition-colors hover:bg-gray-50/80 ${
                isToday ? 'bg-lavender-light/30' : ''
              }`}
            >
              {/* Day number */}
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium mb-1 ${
                isToday
                  ? 'bg-lavender text-violet-800 font-600'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}>
                {day}
              </div>

              {/* All-day events */}
              {allDayEvs.map(ev => {
                const cfg = categoryConfig[ev.category]
                return (
                  <div key={ev.id}
                    onClick={e => { e.stopPropagation(); setSelectedEvent(ev) }}
                    className={`text-[10px] font-medium px-1.5 py-0.5 rounded-lg mb-0.5 truncate cursor-pointer ${cfg.chipCls}`}>
                    {ev.title}
                  </div>
                )
              })}

              {/* Timed events — max 2, then +N */}
              {timedEvs.slice(0, 2).map(ev => {
                const cfg = categoryConfig[ev.category]
                return (
                  <div key={ev.id}
                    onClick={e => { e.stopPropagation(); setSelectedEvent(ev) }}
                    className={`flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-lg mb-0.5 cursor-pointer ${cfg.chipCls} truncate`}>
                    <span className="flex-shrink-0 w-1 h-1 rounded-full" style={{ backgroundColor: cfg.textColor }} />
                    <span className="truncate">{ev.startTime} {ev.title}</span>
                  </div>
                )
              })}
              {timedEvs.length > 2 && (
                <div className="text-[10px] text-gray-400 px-1.5">+{timedEvs.length - 2} נוספים</div>
              )}
            </div>
          )
        })}
      </div>

      {selectedEvent && (
        <EventDetailModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}
      {addDate && (
        <AddEventModal initialDate={addDate} onClose={() => setAddDate(null)} />
      )}
    </div>
  )
}
