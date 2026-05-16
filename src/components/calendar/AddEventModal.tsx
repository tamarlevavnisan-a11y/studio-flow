import { useState } from 'react'
import { Link, MapPin, FileText, Video } from 'lucide-react'
import Modal from '../ui/Modal'
import { useCalendar } from '../../store/CalendarContext'
import { categoryConfig } from './categoryConfig'
import type { CalendarEvent, EventCategory } from '../../types'

interface Props {
  initialDate?: string
  initialEvent?: CalendarEvent
  onClose: () => void
}

const inputCls = 'w-full border border-gray-100 rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-lavender bg-gray-50 placeholder-gray-300'

const categories: EventCategory[] = ['personal', 'client', 'health', 'project']

function todayStr() {
  return new Date().toISOString().slice(0, 10)
}

export default function AddEventModal({ initialDate, initialEvent, onClose }: Props) {
  const { addEvent, updateEvent } = useCalendar()
  const isEdit = Boolean(initialEvent)

  const [form, setForm] = useState({
    title:       initialEvent?.title       ?? '',
    category:    initialEvent?.category    ?? 'personal' as EventCategory,
    date:        initialEvent?.date        ?? initialDate ?? todayStr(),
    allDay:      initialEvent?.allDay      ?? false,
    startTime:   initialEvent?.startTime   ?? '09:00',
    endTime:     initialEvent?.endTime     ?? '10:00',
    description: initialEvent?.description ?? '',
    zoomLink:    initialEvent?.zoomLink    ?? '',
    location:    initialEvent?.location    ?? '',
  })

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm(f => ({ ...f, [k]: v }))

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title.trim()) return
    const payload: Omit<CalendarEvent, 'id'> = {
      title:       form.title.trim(),
      category:    form.category,
      date:        form.date,
      startTime:   form.allDay ? '00:00' : form.startTime,
      endTime:     form.allDay ? '00:00' : form.endTime,
      allDay:      form.allDay,
      description: form.description || undefined,
      zoomLink:    form.zoomLink    || undefined,
      location:    form.location    || undefined,
    }
    if (isEdit && initialEvent) {
      updateEvent(initialEvent.id, payload)
    } else {
      addEvent(payload)
    }
    onClose()
  }

  return (
    <Modal title={isEdit ? 'עריכת אירוע' : 'אירוע חדש'} onClose={onClose} width="max-w-lg">
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Title */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">כותרת *</label>
          <input value={form.title} onChange={e => set('title', e.target.value)}
            placeholder="מה קורה?" required className={inputCls} />
        </div>

        {/* Category */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-2">קטגוריה</label>
          <div className="flex gap-2 flex-wrap">
            {categories.map(cat => {
              const cfg = categoryConfig[cat]
              const active = form.category === cat
              return (
                <button key={cat} type="button" onClick={() => set('category', cat)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-medium transition-all duration-150 ${
                    active ? cfg.chipCls + ' ring-2 ring-offset-1' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                  style={active ? { ringColor: cfg.color } : {}}>
                  <span>{cfg.emoji}</span>
                  {cfg.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Date + All day */}
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-500 mb-1.5">תאריך</label>
            <input type="date" value={form.date} onChange={e => set('date', e.target.value)}
              className={inputCls} />
          </div>
          <label className="flex items-center gap-2 cursor-pointer mt-5">
            <input type="checkbox" checked={form.allDay}
              onChange={e => set('allDay', e.target.checked)}
              className="w-4 h-4 rounded accent-violet-500" />
            <span className="text-sm text-gray-600">כל היום</span>
          </label>
        </div>

        {/* Time */}
        {!form.allDay && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">שעת התחלה</label>
              <input type="time" value={form.startTime} onChange={e => set('startTime', e.target.value)}
                className={inputCls} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">שעת סיום</label>
              <input type="time" value={form.endTime} onChange={e => set('endTime', e.target.value)}
                className={inputCls} />
            </div>
          </div>
        )}

        {/* Zoom link */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5 flex items-center gap-1.5">
            <Video size={12} className="text-blue-400" /> קישור Zoom
          </label>
          <div className="relative">
            <Link size={13} className="absolute top-1/2 -translate-y-1/2 right-3.5 text-gray-400" />
            <input value={form.zoomLink} onChange={e => set('zoomLink', e.target.value)}
              placeholder="https://zoom.us/j/..." type="url"
              className={`${inputCls} pr-9`} />
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5 flex items-center gap-1.5">
            <MapPin size={12} className="text-gray-400" /> מיקום
          </label>
          <input value={form.location} onChange={e => set('location', e.target.value)}
            placeholder="כתובת או שם המקום"
            className={inputCls} />
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5 flex items-center gap-1.5">
            <FileText size={12} className="text-gray-400" /> תיאור
          </label>
          <textarea value={form.description} onChange={e => set('description', e.target.value)}
            placeholder="פרטים נוספים..." rows={3}
            className={`${inputCls} resize-none`} />
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-1">
          <button type="button" onClick={onClose}
            className="flex-1 py-2.5 rounded-2xl border border-gray-100 text-sm text-gray-500 hover:bg-gray-50 transition-colors">
            ביטול
          </button>
          <button type="submit"
            className="flex-1 py-2.5 rounded-2xl text-white text-sm font-500 transition-all hover:opacity-90"
            style={{ backgroundColor: categoryConfig[form.category].color, color: categoryConfig[form.category].textColor }}>
            {isEdit ? 'שמור שינויים' : 'הוסף אירוע'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
