import { useState } from 'react'
import { ChevronRight, ChevronLeft, Plus, Trash2, CalendarDays } from 'lucide-react'
import Modal from '../../ui/Modal'
import { useClients } from '../../../store/ClientsContext'
import type { ScheduledPost } from '../../../types'

const DAY_NAMES = ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש']

const statusConfig: Record<ScheduledPost['status'], { label: string; cls: string; dot: string }> = {
  planned:   { label: 'מתוכנן', cls: 'bg-gray-100 text-gray-500', dot: 'bg-gray-400' },
  ready:     { label: 'מוכן', cls: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-400' },
  published: { label: 'פורסם', cls: 'bg-violet-100 text-violet-700', dot: 'bg-violet-400' },
}

const typeColors: Record<ScheduledPost['type'], string> = {
  image: 'bg-pink-400',
  video: 'bg-violet-400',
  reel:  'bg-orange-400',
  story: 'bg-yellow-400',
}

const platforms = ['Instagram', 'TikTok', 'Facebook', 'YouTube', 'LinkedIn']

interface Props {
  clientId: string
  posts: ScheduledPost[]
  clientPlatform: string
}

function pad(n: number) { return String(n).padStart(2, '0') }

function AddPostModal({ clientId, selectedDate, clientPlatform, onClose }: { clientId: string; selectedDate: string; clientPlatform: string; onClose: () => void }) {
  const { addPost } = useClients()
  const [form, setForm] = useState({
    title: '',
    platform: clientPlatform,
    date: selectedDate,
    time: '09:00',
    type: 'image' as ScheduledPost['type'],
    status: 'planned' as ScheduledPost['status'],
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title.trim()) return
    addPost(clientId, form)
    onClose()
  }

  return (
    <Modal title="פוסט חדש" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">כותרת</label>
          <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="שם הפוסט" required className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">פלטפורמה</label>
            <select value={form.platform} onChange={e => setForm(f => ({ ...f, platform: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 bg-white">
              {platforms.map(p => <option key={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">סוג תוכן</label>
            <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as ScheduledPost['type'] }))} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 bg-white">
              <option value="image">תמונה</option>
              <option value="video">סרטון</option>
              <option value="reel">ריל</option>
              <option value="story">סטורי</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">תאריך</label>
            <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">שעה</label>
            <input type="time" value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">סטטוס</label>
          <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as ScheduledPost['status'] }))} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 bg-white">
            <option value="planned">מתוכנן</option>
            <option value="ready">מוכן</option>
            <option value="published">פורסם</option>
          </select>
        </div>
        <div className="flex gap-3">
          <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors">ביטול</button>
          <button type="submit" className="flex-1 py-2.5 rounded-xl bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600 transition-colors">שמור פוסט</button>
        </div>
      </form>
    </Modal>
  )
}

export default function PostCalendarTab({ clientId, posts, clientPlatform }: Props) {
  const { deletePost, updatePost } = useClients()
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [showAdd, setShowAdd] = useState(false)

  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells: (number | null)[] = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)]

  const monthName = new Date(year, month).toLocaleDateString('he-IL', { month: 'long', year: 'numeric' })

  function prevMonth() { if (month === 0) { setYear(y => y - 1); setMonth(11) } else { setMonth(m => m - 1) } }
  function nextMonth() { if (month === 11) { setYear(y => y + 1); setMonth(0) } else { setMonth(m => m + 1) } }

  function dayPosts(day: number) {
    const dateStr = `${year}-${pad(month + 1)}-${pad(day)}`
    return posts.filter(p => p.date === dateStr)
  }

  const selectedPosts = selectedDate ? posts.filter(p => p.date === selectedDate) : []

  function handleDayClick(day: number) {
    const dateStr = `${year}-${pad(month + 1)}-${pad(day)}`
    setSelectedDate(prev => prev === dateStr ? null : dateStr)
  }

  const todayStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500">{posts.length} פוסטים מתוכננים</p>
        <button
          onClick={() => { setSelectedDate(todayStr); setShowAdd(true) }}
          className="flex items-center gap-2 bg-emerald-500 text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-emerald-600 transition-colors"
        >
          <Plus size={15} />
          פוסט חדש
        </button>
      </div>

      {/* Calendar */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden" dir="ltr">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <button onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
            <ChevronLeft size={16} className="text-gray-500" />
          </button>
          <span className="text-sm font-semibold text-gray-700" dir="rtl">{monthName}</span>
          <button onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
            <ChevronRight size={16} className="text-gray-500" />
          </button>
        </div>

        {/* Day names */}
        <div className="grid grid-cols-7 border-b border-gray-50">
          {DAY_NAMES.map(d => (
            <div key={d} className="text-center text-xs font-medium text-gray-400 py-2">{d}</div>
          ))}
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7">
          {cells.map((day, i) => {
            if (!day) return <div key={`empty-${i}`} className="aspect-square" />
            const dateStr = `${year}-${pad(month + 1)}-${pad(day)}`
            const dp = dayPosts(day)
            const isToday = dateStr === todayStr
            const isSelected = selectedDate === dateStr

            return (
              <button
                key={day}
                onClick={() => handleDayClick(day)}
                className={`aspect-square p-1 flex flex-col items-center gap-0.5 transition-all hover:bg-gray-50 ${
                  isSelected ? 'bg-emerald-50' : ''
                }`}
              >
                <span className={`text-xs w-6 h-6 flex items-center justify-center rounded-full font-medium transition-colors ${
                  isToday ? 'bg-violet-500 text-white' : isSelected ? 'bg-emerald-400 text-white' : 'text-gray-600'
                }`}>
                  {day}
                </span>
                {dp.length > 0 && (
                  <div className="flex gap-0.5 flex-wrap justify-center">
                    {dp.slice(0, 3).map(p => (
                      <span key={p.id} className={`w-1.5 h-1.5 rounded-full ${typeColors[p.type]}`} />
                    ))}
                    {dp.length > 3 && <span className="text-[8px] text-gray-400">+{dp.length - 3}</span>}
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mt-3 text-xs text-gray-400">
        {Object.entries(typeColors).map(([type, cls]) => (
          <span key={type} className="flex items-center gap-1">
            <span className={`w-2 h-2 rounded-full ${cls}`} />
            {type === 'image' ? 'תמונה' : type === 'video' ? 'סרטון' : type === 'reel' ? 'ריל' : 'סטורי'}
          </span>
        ))}
      </div>

      {/* Selected day panel */}
      {selectedDate && (
        <div className="mt-4 bg-white border border-gray-100 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-gray-700">
              {new Date(selectedDate + 'T00:00:00').toLocaleDateString('he-IL', { weekday: 'long', day: 'numeric', month: 'long' })}
            </h4>
            <button
              onClick={() => setShowAdd(true)}
              className="flex items-center gap-1.5 text-xs text-emerald-600 hover:text-emerald-700 font-medium"
            >
              <Plus size={13} /> הוסף פוסט
            </button>
          </div>
          {selectedPosts.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-3">אין פוסטים ביום זה</p>
          ) : (
            <div className="space-y-2">
              {selectedPosts.map(post => {
                const sc = statusConfig[post.status]
                return (
                  <div key={post.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-gray-50">
                    <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${typeColors[post.type]}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800">{post.title}</p>
                      <p className="text-xs text-gray-400">{post.platform} · {post.time}</p>
                    </div>
                    <button
                      onClick={() => updatePost(clientId, post.id, { status: post.status === 'planned' ? 'ready' : post.status === 'ready' ? 'published' : 'planned' })}
                      className={`text-xs font-medium px-2 py-0.5 rounded-full cursor-pointer transition-colors ${sc.cls}`}
                    >
                      {sc.label}
                    </button>
                    <button onClick={() => deletePost(clientId, post.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-300 hover:text-red-400 transition-colors">
                      <Trash2 size={13} />
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {showAdd && (
        <AddPostModal
          clientId={clientId}
          selectedDate={selectedDate ?? todayStr}
          clientPlatform={clientPlatform}
          onClose={() => setShowAdd(false)}
        />
      )}
    </div>
  )
}
