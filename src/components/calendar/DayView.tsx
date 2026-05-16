import { useState } from 'react'
import { ExternalLink, MapPin } from 'lucide-react'
import { useCalendar } from '../../store/CalendarContext'
import { categoryConfig } from './categoryConfig'
import EventDetailModal from './EventDetailModal'
import AddEventModal from './AddEventModal'
import type { CalendarEvent } from '../../types'

const START_HOUR = 7
const END_HOUR   = 21
const TOTAL_HRS  = END_HOUR - START_HOUR
const HOUR_H     = 72

function pad(n: number) { return String(n).padStart(2, '0') }
function toMins(t: string) { const [h, m] = t.split(':').map(Number); return h * 60 + m }
function dateStr(d: Date)  { return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}` }

interface Props { date: Date }

export default function DayView({ date }: Props) {
  const { events } = useCalendar()
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [addModalOpen, setAddModalOpen] = useState(false)

  const ds = dateStr(date)
  const timedEvs  = events.filter(e => e.date === ds && !e.allDay)
  const allDayEvs = events.filter(e => e.date === ds && e.allDay)
  const hours = Array.from({ length: TOTAL_HRS }, (_, i) => START_HOUR + i)

  const dayName = date.toLocaleDateString('he-IL', { weekday: 'long', day: 'numeric', month: 'long' })
  const today = new Date()
  const isToday = ds === dateStr(today)

  function eventTop(t: string) {
    return Math.max(0, (toMins(t) - START_HOUR * 60) / 60 * HOUR_H)
  }
  function eventHeight(s: string, e: string) {
    return Math.max(40, Math.max(toMins(e) - toMins(s), 30) / 60 * HOUR_H)
  }

  return (
    <div className="bg-white rounded-[20px] overflow-hidden" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)', direction: 'ltr' }}>

      {/* Day header */}
      <div className={`px-6 py-4 border-b border-gray-50 ${isToday ? 'bg-lavender-light/20' : ''}`}>
        <div className="flex items-center justify-between">
          <p className={`text-base font-600 ${isToday ? 'text-violet-700' : 'text-gray-800'}`} dir="rtl">
            {dayName}
          </p>
          <button onClick={() => setAddModalOpen(true)}
            className="text-xs font-medium text-violet-500 hover:text-violet-700 transition-colors">
            + הוסף
          </button>
        </div>

        {/* All-day events */}
        {allDayEvs.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3" dir="rtl">
            {allDayEvs.map(ev => {
              const cfg = categoryConfig[ev.category]
              return (
                <div key={ev.id} onClick={() => setSelectedEvent(ev)}
                  className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full cursor-pointer hover:opacity-80 transition-opacity ${cfg.chipCls}`}>
                  {cfg.emoji} {ev.title}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Time grid */}
      <div className="overflow-y-auto" style={{ maxHeight: '600px' }}>
        <div className="flex relative" style={{ minHeight: TOTAL_HRS * HOUR_H }}>

          {/* Time labels */}
          <div className="flex-shrink-0 w-14">
            {hours.map(h => (
              <div key={h} className="text-[10px] text-gray-400 text-right pr-3 flex items-start justify-end"
                style={{ height: HOUR_H }}>
                <span className="-mt-2">{pad(h)}:00</span>
              </div>
            ))}
          </div>

          {/* Event column */}
          <div className="flex-1 relative border-r border-gray-50">
            {hours.map((_, i) => (
              <div key={i} className="absolute inset-x-0 border-t border-gray-50" style={{ top: i * HOUR_H }} />
            ))}

            {timedEvs.map(ev => {
              const cfg = categoryConfig[ev.category]
              const top    = eventTop(ev.startTime)
              const height = eventHeight(ev.startTime, ev.endTime)
              return (
                <div key={ev.id}
                  onClick={() => setSelectedEvent(ev)}
                  className={`absolute inset-x-2 rounded-2xl border-r-4 p-3 cursor-pointer hover:brightness-95 transition-all ${cfg.blockCls}`}
                  style={{ top, height, borderColor: cfg.color, direction: 'rtl' }}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-600 leading-snug truncate">{ev.title}</p>
                      <p className="text-xs opacity-70 mt-0.5">{ev.startTime} – {ev.endTime}</p>
                    </div>
                    <span className="text-base flex-shrink-0">{cfg.emoji}</span>
                  </div>
                  {height > 80 && ev.location && (
                    <p className="flex items-center gap-1 text-xs opacity-60 mt-2">
                      <MapPin size={10} /> {ev.location}
                    </p>
                  )}
                  {height > 80 && ev.zoomLink && (
                    <a href={ev.zoomLink} target="_blank" rel="noopener noreferrer"
                      onClick={e => e.stopPropagation()}
                      className="flex items-center gap-1 text-xs mt-1.5 underline opacity-70 hover:opacity-100">
                      📹 הצטרפי ל-Zoom <ExternalLink size={10} />
                    </a>
                  )}
                  {height > 100 && ev.description && (
                    <p className="text-xs opacity-60 mt-1.5 line-clamp-2">{ev.description}</p>
                  )}
                </div>
              )
            })}

            {timedEvs.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center" style={{ direction: 'rtl' }}>
                <p className="text-sm text-gray-300">אין אירועים ביום זה</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedEvent && <EventDetailModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />}
      {addModalOpen && <AddEventModal initialDate={ds} onClose={() => setAddModalOpen(false)} />}
    </div>
  )
}
