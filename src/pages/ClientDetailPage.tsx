import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowRight, Mail, Phone, FileText, Video, Folder, CalendarDays, ChevronDown } from 'lucide-react'
import { useClients } from '../store/ClientsContext'
import ScriptsTab from '../components/clients/detail/ScriptsTab'
import VideosTab from '../components/clients/detail/VideosTab'
import FilesTab from '../components/clients/detail/FilesTab'
import PostCalendarTab from '../components/clients/detail/PostCalendarTab'
import type { ClientDetail } from '../types'

type Tab = 'scripts' | 'videos' | 'files' | 'calendar'

const tabs: { id: Tab; label: string; icon: React.ReactNode; activeColor: string }[] = [
  { id: 'scripts',  label: 'תסריטים',    icon: <FileText size={14} />,    activeColor: '#F472B6' },
  { id: 'videos',   label: 'סרטונים',    icon: <Video size={14} />,       activeColor: '#C4B5FD' },
  { id: 'files',    label: 'קבצים',      icon: <Folder size={14} />,      activeColor: '#BBF7D0' },
  { id: 'calendar', label: 'לוח פרסום',  icon: <CalendarDays size={14} />,activeColor: '#FED7AA' },
]

const statusConfig: Record<ClientDetail['status'], { label: string; cls: string }> = {
  pending:  { label: 'ממתין',   cls: 'bg-yellow-100 text-yellow-700' },
  active:   { label: 'פעיל',    cls: 'bg-green-100 text-green-700' },
  paused:   { label: 'בהשהיה', cls: 'bg-gray-100 text-gray-500' },
  rejected: { label: 'נדחה',    cls: 'bg-red-100 text-red-600' },
}

const platformStyles: Record<string, { bg: string; text: string }> = {
  Instagram: { bg: 'bg-dusty-pink-light', text: 'text-pink-600' },
  TikTok:    { bg: 'bg-lavender-light',   text: 'text-violet-600' },
  Facebook:  { bg: 'bg-indigo-50',        text: 'text-indigo-600' },
  YouTube:   { bg: 'bg-peach-light',      text: 'text-orange-600' },
  LinkedIn:  { bg: 'bg-blue-50',          text: 'text-blue-600' },
}

const avatarGradients = [
  'from-lavender to-dusty-pink',
  'from-dusty-pink to-peach',
  'from-mint to-lavender',
  'from-peach to-butter',
]

const statusOrder: ClientDetail['status'][] = ['pending', 'active', 'paused', 'rejected']

export default function ClientDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { clients, updateClientStatus } = useClients()
  const [activeTab, setActiveTab] = useState<Tab>('scripts')
  const [showStatusMenu, setShowStatusMenu] = useState(false)

  const clientIndex = clients.findIndex(c => c.id === id)
  const client = clients[clientIndex]

  if (!client) {
    return (
      <div className="text-center py-20 text-gray-400">
        <p className="text-sm">לקוח לא נמצא</p>
        <button onClick={() => navigate('/clients')} className="mt-3 text-violet-500 text-sm hover:underline">
          חזור לרשימת הלקוחות
        </button>
      </div>
    )
  }

  const sc = statusConfig[client.status]
  const ps = platformStyles[client.platform] ?? { bg: 'bg-gray-100', text: 'text-gray-600' }
  const grad = avatarGradients[clientIndex % 4]
  const activeTabObj = tabs.find(t => t.id === activeTab)!

  return (
    <div className="space-y-4">
      {/* Back */}
      <button
        onClick={() => navigate('/clients')}
        className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 transition-colors group"
      >
        <ArrowRight size={14} className="group-hover:-translate-x-0.5 transition-transform" />
        לקוחות
      </button>

      {/* Client header */}
      <div className="bg-white rounded-[20px] p-6" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
        <div className="flex items-start gap-4">
          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${grad} flex items-center justify-center text-white font-600 text-2xl flex-shrink-0`}>
            {client.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 flex-wrap">
              <div>
                <h2 className="text-lg font-600 text-gray-800">{client.name}</h2>
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${ps.bg} ${ps.text}`}>
                    {client.platform}
                  </span>
                  {/* Status dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setShowStatusMenu(s => !s)}
                      className={`flex items-center gap-1 text-xs font-medium px-2.5 py-0.5 rounded-full cursor-pointer transition-colors ${sc.cls}`}
                    >
                      {sc.label}
                      <ChevronDown size={10} />
                    </button>
                    {showStatusMenu && (
                      <div className="absolute top-full mt-1.5 right-0 bg-white rounded-2xl z-10 min-w-[130px] overflow-hidden"
                        style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}>
                        {statusOrder.map(s => (
                          <button
                            key={s}
                            onClick={() => { updateClientStatus(client.id, s); setShowStatusMenu(false) }}
                            className={`w-full text-right px-4 py-2.5 text-xs hover:bg-gray-50 transition-colors ${
                              client.status === s ? 'font-600 text-violet-600' : 'text-gray-600'
                            }`}
                          >
                            {statusConfig[s].label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-400">מאז {client.createdAt}</p>
            </div>

            <div className="flex flex-wrap gap-4 mt-3">
              {client.email && (
                <a href={`mailto:${client.email}`} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-violet-500 transition-colors">
                  <Mail size={12} /> {client.email}
                </a>
              )}
              {client.phone && (
                <a href={`tel:${client.phone}`} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-violet-500 transition-colors">
                  <Phone size={12} /> {client.phone}
                </a>
              )}
            </div>
            {client.notes && (
              <p className="text-xs text-gray-500 mt-3 bg-gray-50 rounded-2xl p-3 leading-relaxed">{client.notes}</p>
            )}
          </div>
        </div>
      </div>

      {/* Tab bar */}
      <div className="bg-white rounded-[20px] p-1.5 flex gap-1" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-2xl text-sm font-medium transition-all duration-200 ${
              activeTab === tab.id ? 'text-white shadow-sm' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
            }`}
            style={activeTab === tab.id ? { backgroundColor: tab.activeColor } : {}}
          >
            {tab.icon}
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="bg-white rounded-[20px] p-5" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
        {activeTab === 'scripts'  && <ScriptsTab     clientId={client.id} scripts={client.scripts} />}
        {activeTab === 'videos'   && <VideosTab      clientId={client.id} videos={client.videos} />}
        {activeTab === 'files'    && <FilesTab       clientId={client.id} files={client.files} />}
        {activeTab === 'calendar' && <PostCalendarTab clientId={client.id} clientName={client.name} clientPlatform={client.platform} />}
      </div>
    </div>
  )
}
