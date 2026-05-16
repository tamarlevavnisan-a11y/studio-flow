import { useState } from 'react'
import { useCalendar } from '../../store/CalendarContext'
import { categoryConfig } from './categoryConfig'
import EventDetailModal from './EventDetailModal'
import AddEventModal from './AddEventModal'
import type { CalendarEvent } from '../../types'

const START_HOUR = 7
const END_HOUR   = 21
const TOTAL_HRS  = END_HOUR - START_HOUR   // 14
const HOUR_H     = 64                       // px per hour

const DAY_NAMES_SHORT = ['א׳', 'ב׳', 'ג׳', 'ד׳', 'ה׳', 'ו׳', 'ש׳']

function pad(n: number) { return String(n).padStart(2, '0') }
function toMins(t: string) { const [h, m] = t.split(':').map(Number); return h * 60 + m }
function dateStr(d: Date) { return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}` }

function getWeekDays(date: Date): Date[] {
  const d = new Date(date)
  d.setDate(d.getDate() - d.getDay()) // go to Sunday
  return Array.from({ length: 7 }, (_, i) => {
    const day = new Date(d)
    day.setDate(d.getDate() + i)
    return day
  })
}

function eventTop(startTime: string): number {
  const mins = toMins(startTime) - START_HOUR * 60
  return Math.max(0, (mins / 60) * HOUR_H)
}

function eventHeight(startTime: string, endTime: string): number {
  const dur = toMins(endTime) - toMins(startTime)
  return Math.max(28, (Math.max(dur, 30) / 60) * HOUR_H)
}

interface Props { date: Date }

export default function WeekView({ date }: Props) {
  const { events } = useCalendar()
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [addDate, setAddDate] = useState<string | null>(null)

  const today = new Date()
  const todayStr = dateStr(today)
  const weekDays = getWeekDays(date)

  const hours = Array.from({ length: TOTAL_HRS }, (_, i) => START_HOUR + i)

  function dayEvents(day: Date) {
    const ds = dateStr(day)
    return events.filter(e => e.date === ds && !e.allDay)
  }
  function allDayEvents(day: Date) {
    return events.filter(e => e.date === dateStr(day) && e.allDay)
  }

  return (
    <div className="bg-white rounded-[20px] overflow-hidden" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)', direction: 'ltr' }}>

      {/* Column headers */}
      <div className="grid border-b border-gray-50" style={{ gridTemplateColumns: '52px repeat(7, 1fr)' }}>
        <div /> {/* time gutter */}
        {weekDays.map((day, i) => {
          const ds = dateStr(day)
          const isToday = ds === todayStr
          return (
            <div key={i} className={`text-center py-3 border-r border-gray-50 last:border-0 ${isToday ? 'bg-lavender-light/30' : ''}`}>
              <p className="text-[10px] text-gray-400 font-medium">{DAY_NAMES_SHORT[i]}</p>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-500 mx-auto mt-0.5 ${
                isToday ? 'bg-lavender text-violet-800' : 'text-gray-600'
              }`}>
                {day.getDate()}
              </div>
            </div>
          )
        })}
      </div>

      {/* All-day row */}
      {weekDays.some(d => allDayEvents(d).length > 0) && (
        <div className="grid border-b border-gray-100 min-h-[32px]" style={{ gridTemplateColumns: '52px repeat(7, 1fr)' }}>
          <div className="flex items-center justify-center text-[9px] text-gray-400 font-medium">כל היום</div>
          {weekDays.map((day, i) => {
            const ade = allDayEvents(day)
            return (
              <div key={i} className="border-r border-gray-50 last:border-0 p-1 space-y-0.5">
                {ade.map(ev => {
                  const cfg = categoryConfig[ev.category]
                  return (
                    <div key={ev.id} onClick={() => setSelectedEvent(ev)}
                      className={`text-[10px] font-medium px-1.5 py-0.5 rounded-lg cursor-pointer truncate ${cfg.chipCls}`}>
                      {ev.title}
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
      )}

      {/* Scrollable time grid */}
      <div className="overflow-y-auto" style={{ maxHeight: '600px' }}>
        <div className="grid relative" style={{ gridTemplateColumns: '52px repeat(7, 1fr)' }}>
          {/* Time labels */}
          <div>
            {hours.map(h => (
              <div key={h} className="text-[10px] text-gray-400 text-right pr-2 flex items-start justify-end"
                style={{ height: HOUR_H }}>
                <span className="-mt-2">{pad(h)}:00</span>
              </div>
            ))}
          </div>

          {/* Day columns */}
          {weekDays.map((day, di) => {
            const de = dayEvents(day)
            const ds = dateStr(day)
            const isToday = ds === todayStr
            return (
              <div key={di}
                className={`relative border-r border-gray-50 last:border-0 cursor-pointer ${isToday ? 'bg-lavender-light/10' : ''}`}
                style={{ height: TOTAL_HRS * HOUR_H }}
                onClick={() => setAddDate(ds)}
              >
                {/* Hour lines */}
                {hours.map((h, hi) => (
                  <div key={h} className="absolute inset-x-0 border-t border-gray-50"
                    style={{ top: hi * HOUR_H }} />
                ))}

                {/* Events */}
                {de.map(ev => {
                  const cfg = categoryConfig[ev.category]
                  const top = eventTop(ev.startTime)
                  const height = eventHeight(ev.startTime, ev.endTime)
                  return (
                    <div key={ev.id}
                      onClick={e => { e.stopPropagation(); setSelectedEvent(ev) }}
                      className={`absolute inset-x-0.5 rounded-xl border-r-2 px-1.5 py-1 cursor-pointer hover:brightness-95 transition-all overflow-hidden ${cfg.blockCls}`}
                      style={{ top, height, borderColor: cfg.color }}>
                      <p className="text-[10px] font-600 leading-tight truncate">{ev.title}</p>
                      {height > 36 && (
                        <p className="text-[9px] opacity-70 mt-0.5">{ev.startTime}–{ev.endTime}</p>
                      )}
                      {height > 52 && ev.zoomLink && (
                        <p className="text-[9px] opacity-60 mt-0.5">📹 Zoom</p>
                      )}
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
      </div>

      {selectedEvent && <EventDetailModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />}
      {addDate && <AddEventModal initialDate={addDate} onClose={() => setAddDate(null)} />}
    </div>
  )
}
