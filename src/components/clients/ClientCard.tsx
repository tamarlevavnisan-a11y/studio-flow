import { useNavigate } from 'react-router-dom'
import { FileText, Video, CalendarDays } from 'lucide-react'
import type { ClientDetail } from '../../types'

const platformStyles: Record<string, { bg: string; text: string }> = {
  Instagram: { bg: 'bg-dusty-pink-light', text: 'text-pink-600' },
  TikTok:    { bg: 'bg-lavender-light',   text: 'text-violet-600' },
  Facebook:  { bg: 'bg-indigo-50',        text: 'text-indigo-600' },
  YouTube:   { bg: 'bg-peach-light',      text: 'text-orange-600' },
  LinkedIn:  { bg: 'bg-blue-50',          text: 'text-blue-600' },
}

const statusConfig: Record<string, { label: string; cls: string }> = {
  pending:  { label: 'ממתין',   cls: 'bg-yellow-100 text-yellow-700' },
  active:   { label: 'פעיל',    cls: 'bg-green-100 text-green-700' },
  paused:   { label: 'בהשהיה', cls: 'bg-gray-100 text-gray-500' },
  rejected: { label: 'נדחה',    cls: 'bg-red-100 text-red-600' },
}

const avatarGradients = [
  'from-lavender to-dusty-pink',
  'from-dusty-pink to-peach',
  'from-mint to-lavender',
  'from-peach to-butter',
]

interface Props { client: ClientDetail; index: number }

export default function ClientCard({ client, index }: Props) {
  const navigate = useNavigate()
  const ps = platformStyles[client.platform] ?? { bg: 'bg-gray-100', text: 'text-gray-600' }
  const sc = statusConfig[client.status] ?? statusConfig.pending
  const monthPosts = client.posts.filter(p => p.date.startsWith('2026-05')).length

  return (
    <div
      onClick={() => navigate(`/clients/${client.id}`)}
      className="bg-white rounded-[20px] p-5 cursor-pointer group transition-all duration-200 hover:-translate-y-1"
      style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
      onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,0,0,0.10)')}
      onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)')}
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3 min-w-0">
          {/* Avatar */}
          <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${avatarGradients[index % 4]} flex items-center justify-center text-white font-600 text-lg flex-shrink-0`}>
            {client.avatar}
          </div>
          <div className="min-w-0">
            <h3 className="font-500 text-gray-800 text-sm truncate mb-1">{client.name}</h3>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${ps.bg} ${ps.text}`}>
              {client.platform}
            </span>
          </div>
        </div>
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0 ${sc.cls}`}>
          {sc.label}
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 pt-4 border-t border-gray-50">
        <div className="flex flex-col items-center gap-1 text-center">
          <div className="w-7 h-7 rounded-xl bg-dusty-pink-light flex items-center justify-center">
            <FileText size={13} className="text-pink-500" />
          </div>
          <span className="text-sm font-600 text-gray-700">{client.scripts.length}</span>
          <span className="text-[10px] text-gray-400">תסריטים</span>
        </div>
        <div className="flex flex-col items-center gap-1 text-center">
          <div className="w-7 h-7 rounded-xl bg-lavender-light flex items-center justify-center">
            <Video size={13} className="text-violet-500" />
          </div>
          <span className="text-sm font-600 text-gray-700">{client.videos.length}</span>
          <span className="text-[10px] text-gray-400">סרטונים</span>
        </div>
        <div className="flex flex-col items-center gap-1 text-center">
          <div className="w-7 h-7 rounded-xl bg-mint-light flex items-center justify-center">
            <CalendarDays size={13} className="text-emerald-500" />
          </div>
          <span className="text-sm font-600 text-gray-700">{monthPosts}</span>
          <span className="text-[10px] text-gray-400">פוסטים</span>
        </div>
      </div>
    </div>
  )
}
