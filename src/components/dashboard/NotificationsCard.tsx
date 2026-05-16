import { Bell } from 'lucide-react'
import Card from '../ui/Card'
import { mockNotifications } from '../../data/mockData'
import { useState } from 'react'

const typeStyles = {
  info:    { bg: 'bg-lavender-light', dot: 'bg-lavender', icon: '💬' },
  warning: { bg: 'bg-butter-light',   dot: 'bg-butter',   icon: '⏰' },
  success: { bg: 'bg-mint-light',     dot: 'bg-mint',     icon: '✅' },
}

export default function NotificationsCard() {
  const [notifs, setNotifs] = useState(mockNotifications)
  const unread = notifs.filter(n => !n.read)
  const markRead = (id: string) => setNotifs(ns => ns.map(n => n.id === id ? { ...n, read: true } : n))
  const markAll = () => setNotifs(ns => ns.map(n => ({ ...n, read: true })))

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bell size={15} className="text-yellow-500" />
          <h3 className="text-sm font-500 text-gray-700">התראות</h3>
          {unread.length > 0 && (
            <span className="w-4 h-4 bg-butter text-yellow-700 text-[9px] font-700 rounded-full flex items-center justify-center">
              {unread.length}
            </span>
          )}
        </div>
        {unread.length > 0 && (
          <button onClick={markAll} className="text-[11px] text-violet-400 hover:text-violet-600 transition-colors font-medium">
            סמן הכל כנקרא
          </button>
        )}
      </div>

      <div className="space-y-2">
        {notifs.map(n => {
          const s = typeStyles[n.type]
          return (
            <div
              key={n.id}
              onClick={() => markRead(n.id)}
              className={`flex items-start gap-3 p-3 rounded-2xl cursor-pointer transition-all duration-200 ${
                n.read ? 'opacity-40 hover:opacity-60' : s.bg
              }`}
            >
              <span className="text-base flex-shrink-0 mt-0.5">{s.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-700 leading-snug">{n.text}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">{n.time}</p>
              </div>
              {!n.read && <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5 ${s.dot}`} />}
            </div>
          )
        })}
      </div>
    </Card>
  )
}
