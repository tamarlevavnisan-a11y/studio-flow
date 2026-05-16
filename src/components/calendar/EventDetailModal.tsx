import { useState } from 'react'
import { Trash2, Edit3, ExternalLink, MapPin, FileText, Clock, Calendar } from 'lucide-react'
import Modal from '../ui/Modal'
import { useCalendar } from '../../store/CalendarContext'
import { categoryConfig } from './categoryConfig'
import AddEventModal from './AddEventModal'
import type { CalendarEvent } from '../../types'

interface Props {
  event: CalendarEvent
  onClose: () => void
}

function formatDate(dateStr: string) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('he-IL', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })
}

export default function EventDetailModal({ event, onClose }: Props) {
  const { deleteEvent } = useCalendar()
  const [editing, setEditing] = useState(false)
  const cfg = categoryConfig[event.category]

  if (editing) {
    return <AddEventModal initialEvent={event} onClose={() => { setEditing(false); onClose() }} />
  }

  function handleDelete() {
    deleteEvent(event.id)
    onClose()
  }

  return (
    <Modal title=" " onClose={onClose}>
      {/* Colored header strip */}
      <div className="-mx-6 -mt-6 mb-5 px-6 py-4 rounded-t-[20px]" style={{ backgroundColor: cfg.bg }}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <span className="text-2xl mt-0.5">{cfg.emoji}</span>
            <div>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${cfg.chipCls} mb-1.5 inline-block`}>
                {cfg.label}
              </span>
              <h3 className="text-lg font-600 text-gray-800 leading-snug">{event.title}</h3>
            </div>
          </div>
          <div className="flex gap-1.5 flex-shrink-0">
            <button onClick={() => setEditing(true)}
              className="w-8 h-8 rounded-xl bg-white/70 hover:bg-white flex items-center justify-center text-gray-500 transition-all">
              <Edit3 size={14} />
            </button>
            <button onClick={handleDelete}
              className="w-8 h-8 rounded-xl bg-white/70 hover:bg-red-50 flex items-center justify-center text-gray-400 hover:text-red-500 transition-all">
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-3.5">
        {/* Date + time */}
        <div className="flex items-center gap-2.5 text-sm text-gray-600">
          <Calendar size={15} className="text-gray-400 flex-shrink-0" />
          <span>{formatDate(event.date)}</span>
        </div>

        {!event.allDay && (
          <div className="flex items-center gap-2.5 text-sm text-gray-600">
            <Clock size={15} className="text-gray-400 flex-shrink-0" />
            <span>{event.startTime} – {event.endTime}</span>
          </div>
        )}
        {event.allDay && (
          <div className="flex items-center gap-2.5 text-sm text-gray-500">
            <Clock size={15} className="text-gray-400 flex-shrink-0" />
            <span>כל היום</span>
          </div>
        )}

        {/* Location */}
        {event.location && (
          <div className="flex items-start gap-2.5 text-sm text-gray-600">
            <MapPin size={15} className="text-gray-400 flex-shrink-0 mt-0.5" />
            <span>{event.location}</span>
          </div>
        )}

        {/* Zoom link */}
        {event.zoomLink && (
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
              <span className="text-sm">📹</span>
            </div>
            <a href={event.zoomLink} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-blue-500 hover:text-blue-700 hover:underline transition-colors">
              הצטרפי לפגישת Zoom
              <ExternalLink size={12} />
            </a>
          </div>
        )}

        {/* Description */}
        {event.description && (
          <div className="flex items-start gap-2.5">
            <FileText size={15} className="text-gray-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-gray-600 leading-relaxed">{event.description}</p>
          </div>
        )}
      </div>
    </Modal>
  )
}
