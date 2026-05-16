import { useState } from 'react'
import { ChevronRight, ChevronLeft, Plus, Calendar } from 'lucide-react'
import MonthView from '../components/calendar/MonthView'
import WeekView from '../components/calendar/WeekView'
import DayView from '../components/calendar/DayView'
import AddEventModal from '../components/calendar/AddEventModal'
import { categoryConfig } from '../components/calendar/categoryConfig'
import type { EventCategory } from '../types'

type View = 'month' | 'week' | 'day'

const MONTHS_HE = ['ינואר','פברואר','מרץ','אפריל','מאי','יוני','יולי','אוגוסט','ספטמבר','אוקטובר','נובמבר','דצמבר']
const DAY_NAMES_FULL = ['ראשון','שני','שלישי','רביעי','חמישי','שישי','שבת']

function addMonths(d: Date, n: number) {
  const r = new Date(d)
  r.setMonth(r.getMonth() + n)
  return r
}
function addWeeks(d: Date, n: number) {
  const r = new Date(d)
  r.setDate(r.getDate() + n * 7)
  return r
}
function addDays(d: Date, n: number) {
  const r = new Date(d)
  r.setDate(r.getDate() + n)
  return r
}

function getViewTitle(view: View, date: Date): string {
  if (view === 'month') return `${MONTHS_HE[date.getMonth()]} ${date.getFullYear()}`
  if (view === 'day') {
    return date.toLocaleDateString('he-IL', { weekday: 'long', day: 'numeric', month: 'long' })
  }
  // week
  const sun = new Date(date)
  sun.setDate(date.getDate() - date.getDay())
  const sat = new Date(sun); sat.setDate(sun.getDate() + 6)
  if (sun.getMonth() === sat.getMonth()) {
    return `${sun.getDate()}–${sat.getDate()} ${MONTHS_HE[sun.getMonth()]} ${sun.getFullYear()}`
  }
  return `${sun.getDate()} ${MONTHS_HE[sun.getMonth()]} – ${sat.getDate()} ${MONTHS_HE[sat.getMonth()]}`
}

const categories = Object.entries(categoryConfig) as [EventCategory, typeof categoryConfig[EventCategory]][]

export default function CalendarPage() {
  const [view, setView]       = useState<View>('month')
  const [date, setDate]       = useState(new Date())
  const [showAdd, setShowAdd] = useState(false)

  function goNext()  { setDate(d => view === 'month' ? addMonths(d, 1) : view === 'week' ? addWeeks(d, 1) : addDays(d, 1)) }
  function goPrev()  { setDate(d => view === 'month' ? addMonths(d, -1) : view === 'week' ? addWeeks(d, -1) : addDays(d, -1)) }
  function goToday() { setDate(new Date()) }

  const views: { id: View; label: string }[] = [
    { id: 'month', label: 'חודש' },
    { id: 'week',  label: 'שבוע' },
    { id: 'day',   label: 'יום'  },
  ]

  return (
    <div className="space-y-4">
      {/* ── Header ── */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-600 text-gray-800">לוח שנה</h2>
          <p className="text-sm text-gray-400 mt-0.5">ניהול אירועים ופגישות</p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* View toggle */}
          <div className="flex bg-white rounded-2xl p-1 shadow-sm border border-gray-100">
            {views.map(v => (
              <button key={v.id} onClick={() => setView(v.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 ${
                  view === v.id ? 'bg-lavender text-violet-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}>
                {v.label}
              </button>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-1 bg-white rounded-2xl p-1 shadow-sm border border-gray-100">
            <button onClick={goPrev} className="w-7 h-7 rounded-xl hover:bg-gray-100 flex items-center justify-center transition-colors">
              <ChevronRight size={15} className="text-gray-500" />
            </button>
            <button onClick={goToday}
              className="px-3 py-1 rounded-xl text-xs font-medium text-gray-600 hover:bg-gray-100 transition-colors">
              היום
            </button>
            <button onClick={goNext} className="w-7 h-7 rounded-xl hover:bg-gray-100 flex items-center justify-center transition-colors">
              <ChevronLeft size={15} className="text-gray-500" />
            </button>
          </div>

          {/* Add event */}
          <button onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 text-white text-xs font-500 px-4 py-2 rounded-2xl transition-all hover:opacity-90 shadow-sm"
            style={{ backgroundColor: '#F472B6' }}>
            <Plus size={14} />
            הוסף אירוע
          </button>
        </div>
      </div>

      {/* ── Current period label ── */}
      <div className="flex items-center justify-between">
        <h3 className="text-base font-600 text-gray-700">{getViewTitle(view, date)}</h3>

        {/* Category legend */}
        <div className="flex items-center gap-3 flex-wrap">
          {categories.map(([cat, cfg]) => (
            <span key={cat} className="flex items-center gap-1.5 text-xs text-gray-500">
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: cfg.color }} />
              {cfg.label}
            </span>
          ))}
        </div>
      </div>

      {/* ── Calendar views ── */}
      {view === 'month' && <MonthView year={date.getFullYear()} month={date.getMonth()} />}
      {view === 'week'  && <WeekView date={date} />}
      {view === 'day'   && <DayView  date={date} />}

      {/* Day-name strip for month navigation hint */}
      {view === 'month' && (
        <p className="text-xs text-gray-400 text-center">
          לחצי על תאריך כדי להוסיף אירוע · לחצי על אירוע כדי לפתוח פרטים
        </p>
      )}

      {showAdd && <AddEventModal onClose={() => setShowAdd(false)} />}
    </div>
  )
}
