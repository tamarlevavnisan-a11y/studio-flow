import { useState } from 'react'
import { Plus, Trash2, Video, ChevronRight } from 'lucide-react'
import Modal from '../../ui/Modal'
import { useClients } from '../../../store/ClientsContext'
import type { VideoContent } from '../../../types'

const statusSteps: VideoContent['status'][] = ['idea', 'filming', 'editing', 'ready', 'published']
const statusLabels: Record<VideoContent['status'], string> = {
  idea: 'רעיון',
  filming: 'צילום',
  editing: 'עריכה',
  ready: 'מוכן',
  published: 'פורסם',
}
const statusColors: Record<VideoContent['status'], string> = {
  idea: 'bg-gray-100 text-gray-500',
  filming: 'bg-yellow-100 text-yellow-700',
  editing: 'bg-orange-100 text-orange-700',
  ready: 'bg-emerald-100 text-emerald-700',
  published: 'bg-violet-100 text-violet-700',
}

const typeLabels: Record<VideoContent['type'], string> = {
  reel: 'ריל',
  tiktok: 'TikTok',
  short: 'Short',
  story: 'סטורי',
  regular: 'סרטון רגיל',
}

interface Props {
  clientId: string
  videos: VideoContent[]
}

function AddVideoModal({ clientId, onClose }: { clientId: string; onClose: () => void }) {
  const { addVideo } = useClients()
  const [form, setForm] = useState({ title: '', type: 'reel' as VideoContent['type'], notes: '', duration: '' })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title.trim()) return
    addVideo(clientId, { ...form, status: 'idea', duration: form.duration || undefined })
    onClose()
  }

  return (
    <Modal title="סרטון חדש" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">כותרת</label>
          <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="שם הסרטון" required className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">סוג</label>
            <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as VideoContent['type'] }))} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 bg-white">
              <option value="reel">ריל</option>
              <option value="tiktok">TikTok</option>
              <option value="short">Short</option>
              <option value="story">סטורי</option>
              <option value="regular">סרטון רגיל</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">משך (אופציונלי)</label>
            <input value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} placeholder="0:30" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">הערות</label>
          <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="פרטים, הנחיות, רעיונות..." rows={3} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 resize-none" />
        </div>
        <div className="flex gap-3">
          <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors">ביטול</button>
          <button type="submit" className="flex-1 py-2.5 rounded-xl bg-violet-500 text-white text-sm font-medium hover:bg-violet-600 transition-colors">שמור</button>
        </div>
      </form>
    </Modal>
  )
}

function VideoCard({ video, clientId }: { video: VideoContent; clientId: string }) {
  const { updateVideo, deleteVideo } = useClients()
  const currentIdx = statusSteps.indexOf(video.status)

  function advanceStatus() {
    if (currentIdx < statusSteps.length - 1) {
      updateVideo(clientId, video.id, { status: statusSteps[currentIdx + 1] })
    }
  }

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center flex-shrink-0">
            <Video size={18} className="text-violet-500" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-800 truncate">{video.title}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs text-gray-400">{typeLabels[video.type]}</span>
              {video.duration && <><span className="text-gray-200">·</span><span className="text-xs text-gray-400">{video.duration}</span></>}
            </div>
          </div>
        </div>
        <button onClick={() => deleteVideo(clientId, video.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-300 hover:text-red-400 transition-colors flex-shrink-0">
          <Trash2 size={14} />
        </button>
      </div>

      {video.notes && <p className="text-xs text-gray-500 mt-2.5 bg-gray-50 rounded-lg p-2">{video.notes}</p>}

      {/* Status pipeline */}
      <div className="mt-3 flex items-center gap-1">
        {statusSteps.map((step, i) => (
          <div key={step} className="flex items-center gap-1 flex-1">
            <div className={`h-1.5 rounded-full w-full transition-all ${i <= currentIdx ? 'bg-violet-400' : 'bg-gray-100'}`} />
          </div>
        ))}
      </div>
      <div className="mt-2 flex items-center justify-between">
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColors[video.status]}`}>
          {statusLabels[video.status]}
        </span>
        {currentIdx < statusSteps.length - 1 && (
          <button onClick={advanceStatus} className="flex items-center gap-1 text-xs text-violet-500 hover:text-violet-700 transition-colors">
            {statusLabels[statusSteps[currentIdx + 1]]}
            <ChevronRight size={12} />
          </button>
        )}
      </div>
    </div>
  )
}

export default function VideosTab({ clientId, videos }: Props) {
  const [showAdd, setShowAdd] = useState(false)

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500">{videos.length} סרטונים</p>
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 bg-violet-500 text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-violet-600 transition-colors">
          <Plus size={15} />
          סרטון חדש
        </button>
      </div>

      {videos.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <Video size={32} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">אין סרטונים עדיין</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {videos.map(v => <VideoCard key={v.id} video={v} clientId={clientId} />)}
        </div>
      )}

      {showAdd && <AddVideoModal clientId={clientId} onClose={() => setShowAdd(false)} />}
    </div>
  )
}
