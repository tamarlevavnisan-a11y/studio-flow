import { useState, useRef } from 'react'
import { ChevronRight, ChevronLeft, Plus, Trash2, Upload, X, Image, Film, RefreshCw } from 'lucide-react'
import Modal from '../../ui/Modal'
import { usePosts } from '../../../store/PostsContext'
import type { ScheduledPost, PostContentType, PostPlatform, PostStatus } from '../../../types'

// ── Constants ─────────────────────────────────────────────────────────────────

const DAY_NAMES = ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש']

const STATUS_CONFIG: Record<PostStatus, { label: string; cls: string; next: PostStatus }> = {
  pending:   { label: 'ממתין',  cls: 'bg-amber-100  text-amber-700',   next: 'published' },
  published: { label: 'פורסם',  cls: 'bg-teal-100   text-teal-700',    next: 'failed'    },
  failed:    { label: 'נכשל',   cls: 'bg-red-100    text-red-600',     next: 'pending'   },
}

const CONTENT_TYPE_LABELS: Record<PostContentType, string> = {
  post:     'פוסט',
  reel:     'ריל',
  story:    'סטורי',
  carousel: 'קרוסלה',
}

const TYPE_DOT: Record<PostContentType, string> = {
  post:     'bg-pink-400',
  reel:     'bg-violet-400',
  story:    'bg-amber-400',
  carousel: 'bg-teal-400',
}

const PLATFORMS: PostPlatform[] = ['Instagram', 'TikTok', 'Facebook']

const PLATFORM_EMOJI: Record<PostPlatform, string> = {
  Instagram: '📸',
  TikTok:    '🎵',
  Facebook:  '📘',
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function pad(n: number) { return String(n).padStart(2, '0') }

function todayStr() {
  const d = new Date()
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

const inputCls = `w-full border border-gray-200 rounded-2xl px-3.5 py-2.5 text-sm
  focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-300 transition-all bg-white`

// ── Add Post Modal ────────────────────────────────────────────────────────────

interface AddPostModalProps {
  clientId: string
  clientName: string
  selectedDate: string
  clientPlatform: string
  onClose: () => void
}

function AddPostModal({ clientId, clientName, selectedDate, clientPlatform, onClose }: AddPostModalProps) {
  const { addPost, uploadMedia } = usePosts()
  const fileRef = useRef<HTMLInputElement>(null)

  const defaultPlatform = (PLATFORMS.includes(clientPlatform as PostPlatform)
    ? clientPlatform : 'Instagram') as PostPlatform

  const [form, setForm] = useState({
    title:       '',
    content:     '',
    contentType: 'post' as PostContentType,
    platform:    defaultPlatform,
    date:        selectedDate,
    time:        '09:00',
    status:      'pending' as PostStatus,
  })
  const [mediaFile,    setMediaFile]    = useState<File | null>(null)
  const [mediaPreview, setMediaPreview] = useState<string>('')
  const [saving,       setSaving]       = useState(false)

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setMediaFile(file)
    if (file.type.startsWith('image/')) setMediaPreview(URL.createObjectURL(file))
    else setMediaPreview('')
  }

  function removeMedia() {
    setMediaFile(null)
    setMediaPreview('')
    if (fileRef.current) fileRef.current.value = ''
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title.trim()) return
    setSaving(true)
    let mediaUrl: string | undefined
    if (mediaFile) {
      const url = await uploadMedia(mediaFile)
      if (url) mediaUrl = url
    }
    await addPost({ clientId, clientName, ...form, mediaUrl })
    onClose()
  }

  const isVideo = mediaFile?.type.startsWith('video/')

  return (
    <Modal title="תזמון פוסט חדש 📱" onClose={onClose} width="max-w-lg">
      <form onSubmit={handleSubmit} className="space-y-4" dir="rtl">

        {/* Title */}
        <div>
          <label className="block text-xs font-600 text-gray-600 mb-1.5">כותרת הפוסט</label>
          <input
            value={form.title}
            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            placeholder="למשל: פוסט קולקציית קיץ"
            required
            className={inputCls}
          />
        </div>

        {/* Content */}
        <div>
          <label className="block text-xs font-600 text-gray-600 mb-1.5">טקסט הפוסט / קפשן</label>
          <textarea
            value={form.content}
            onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
            placeholder="כתבי את הטקסט המלא של הפוסט כאן..."
            rows={4}
            className={`${inputCls} resize-none leading-relaxed`}
          />
        </div>

        {/* Content type + Platform */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-600 text-gray-600 mb-1.5">סוג תוכן</label>
            <select
              value={form.contentType}
              onChange={e => setForm(f => ({ ...f, contentType: e.target.value as PostContentType }))}
              className={inputCls}
            >
              <option value="post">פוסט רגיל</option>
              <option value="reel">ריל</option>
              <option value="story">סטורי</option>
              <option value="carousel">קרוסלה</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-600 text-gray-600 mb-1.5">פלטפורמה</label>
            <select
              value={form.platform}
              onChange={e => setForm(f => ({ ...f, platform: e.target.value as PostPlatform }))}
              className={inputCls}
            >
              {PLATFORMS.map(p => (
                <option key={p} value={p}>{PLATFORM_EMOJI[p]} {p}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Date + Time */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-600 text-gray-600 mb-1.5">תאריך</label>
            <input
              type="date"
              value={form.date}
              onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
              className={inputCls}
              required
            />
          </div>
          <div>
            <label className="block text-xs font-600 text-gray-600 mb-1.5">שעה</label>
            <input
              type="time"
              value={form.time}
              onChange={e => setForm(f => ({ ...f, time: e.target.value }))}
              className={inputCls}
              required
            />
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="block text-xs font-600 text-gray-600 mb-1.5">סטטוס</label>
          <div className="flex gap-2">
            {(['pending', 'published', 'failed'] as PostStatus[]).map(s => (
              <button
                key={s}
                type="button"
                onClick={() => setForm(f => ({ ...f, status: s }))}
                className={`flex-1 py-2 rounded-2xl text-xs font-600 border transition-all ${
                  form.status === s
                    ? STATUS_CONFIG[s].cls + ' border-transparent shadow-sm'
                    : 'bg-white border-gray-200 text-gray-400 hover:border-gray-300'
                }`}
              >
                {STATUS_CONFIG[s].label}
              </button>
            ))}
          </div>
        </div>

        {/* Media upload */}
        <div>
          <label className="block text-xs font-600 text-gray-600 mb-1.5">תמונה / וידאו (אופציונלי)</label>
          {mediaFile ? (
            <div className="relative rounded-2xl overflow-hidden border border-gray-200">
              {mediaPreview ? (
                <img src={mediaPreview} alt="preview" className="w-full h-40 object-cover" />
              ) : (
                <div className="h-24 bg-gray-50 flex items-center justify-center gap-2">
                  <Film size={20} className="text-gray-400" />
                  <span className="text-sm text-gray-500 truncate max-w-[200px]">{mediaFile.name}</span>
                </div>
              )}
              {isVideo && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                  <div className="bg-white/90 rounded-full px-3 py-1 flex items-center gap-1.5">
                    <Film size={13} className="text-gray-600" />
                    <span className="text-xs font-500 text-gray-700">{mediaFile.name}</span>
                  </div>
                </div>
              )}
              <button
                type="button"
                onClick={removeMedia}
                className="absolute top-2 left-2 w-7 h-7 bg-white/90 rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-colors"
              >
                <X size={13} className="text-gray-600" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="w-full h-24 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-pink-300 hover:text-pink-400 hover:bg-pink-50/30 transition-all"
            >
              <Upload size={18} />
              <span className="text-xs font-500">לחצי להעלאת תמונה או וידאו</span>
            </button>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/*,video/*"
            onChange={handleFile}
            className="hidden"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 rounded-2xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
          >
            ביטול
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex-1 py-3 rounded-2xl text-white text-sm font-600 transition-all hover:opacity-90 disabled:opacity-60"
            style={{ background: 'linear-gradient(135deg, #F472B6, #C084FC)' }}
          >
            {saving ? 'שומר...' : 'תזמן פוסט ✨'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

// ── Post Detail Modal (edit status / view) ────────────────────────────────────

function PostDetailModal({ post, clientId, onClose }: { post: ScheduledPost; clientId: string; onClose: () => void }) {
  const { updatePost, deletePost } = usePosts()

  async function cycleStatus() {
    const next = STATUS_CONFIG[post.status].next
    await updatePost(post.id, { status: next })
    onClose()
  }

  async function handleDelete() {
    await deletePost(post.id)
    onClose()
  }

  const sc = STATUS_CONFIG[post.status]
  const date = new Date(post.date + 'T00:00').toLocaleDateString('he-IL', {
    weekday: 'long', day: 'numeric', month: 'long'
  })

  return (
    <Modal title="פרטי פוסט" onClose={onClose}>
      <div className="space-y-4" dir="rtl">
        {/* Header */}
        <div className="flex items-start gap-3">
          <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 mt-1.5 ${TYPE_DOT[post.contentType]}`} />
          <div>
            <h3 className="font-600 text-gray-900">{post.title}</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              {PLATFORM_EMOJI[post.platform]} {post.platform} · {CONTENT_TYPE_LABELS[post.contentType]}
            </p>
          </div>
        </div>

        {/* Content */}
        {post.content && (
          <div className="bg-gray-50 rounded-2xl p-4">
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{post.content}</p>
          </div>
        )}

        {/* Media preview */}
        {post.mediaUrl && post.mediaUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i) && (
          <img src={post.mediaUrl} alt="media" className="w-full rounded-2xl object-cover max-h-48" />
        )}

        {/* Meta */}
        <div className="grid grid-cols-2 gap-3 text-xs text-gray-500">
          <div className="bg-gray-50 rounded-2xl p-3">
            <p className="text-[10px] font-600 text-gray-400 mb-0.5">תאריך</p>
            <p className="font-500 text-gray-700">{date}</p>
          </div>
          <div className="bg-gray-50 rounded-2xl p-3">
            <p className="text-[10px] font-600 text-gray-400 mb-0.5">שעה</p>
            <p className="font-500 text-gray-700">{post.time}</p>
          </div>
        </div>

        {/* Status + actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={cycleStatus}
            className={`flex-1 py-2.5 rounded-2xl text-sm font-600 transition-all hover:opacity-80 ${sc.cls}`}
          >
            {sc.label} → {STATUS_CONFIG[sc.next].label}
          </button>
          <button
            onClick={handleDelete}
            className="w-10 h-10 rounded-2xl hover:bg-red-50 flex items-center justify-center text-gray-300 hover:text-red-400 transition-colors flex-shrink-0"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </Modal>
  )
}

// ── Main Tab ──────────────────────────────────────────────────────────────────

interface Props {
  clientId: string
  clientName: string
  clientPlatform: string
}

export default function PostCalendarTab({ clientId, clientName, clientPlatform }: Props) {
  const { posts: allPosts } = usePosts()
  const posts = allPosts.filter(p => p.clientId === clientId)

  const now = new Date()
  const [year, setYear]               = useState(now.getFullYear())
  const [month, setMonth]             = useState(now.getMonth())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [showAdd, setShowAdd]         = useState(false)
  const [detailPost, setDetailPost]   = useState<ScheduledPost | null>(null)

  const today = todayStr()
  const firstDay    = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells: (number | null)[] = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)]
  const monthName = new Date(year, month).toLocaleDateString('he-IL', { month: 'long', year: 'numeric' })

  function prevMonth() { if (month === 0) { setYear(y => y - 1); setMonth(11) } else { setMonth(m => m - 1) } }
  function nextMonth() { if (month === 11) { setYear(y => y + 1); setMonth(0) } else { setMonth(m => m + 1) } }

  function dayPosts(day: number) {
    const ds = `${year}-${pad(month + 1)}-${pad(day)}`
    return posts.filter(p => p.date === ds)
  }

  function handleDayClick(day: number) {
    const ds = `${year}-${pad(month + 1)}-${pad(day)}`
    setSelectedDate(prev => prev === ds ? null : ds)
  }

  const selectedPosts = selectedDate ? posts.filter(p => p.date === selectedDate) : []

  // Counts
  const pending   = posts.filter(p => p.status === 'pending').length
  const published = posts.filter(p => p.status === 'published').length

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-3 text-xs">
          <span className="flex items-center gap-1.5 text-amber-600">
            <span className="w-2 h-2 rounded-full bg-amber-400" />{pending} ממתינים
          </span>
          <span className="flex items-center gap-1.5 text-teal-600">
            <span className="w-2 h-2 rounded-full bg-teal-400" />{published} פורסמו
          </span>
        </div>
        <button
          onClick={() => { setSelectedDate(today); setShowAdd(true) }}
          className="flex items-center gap-2 text-white text-sm font-600 px-4 py-2 rounded-2xl transition-all hover:opacity-90"
          style={{ background: 'linear-gradient(135deg, #F472B6, #C084FC)' }}
        >
          <Plus size={15} /> תזמן פוסט
        </button>
      </div>

      {/* Calendar grid */}
      <div className="border border-gray-100 rounded-2xl overflow-hidden" dir="ltr">
        {/* Month nav */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50/50">
          <button onClick={prevMonth} className="p-1.5 rounded-xl hover:bg-white transition-colors">
            <ChevronLeft size={15} className="text-gray-400" />
          </button>
          <span className="text-sm font-600 text-gray-700" dir="rtl">{monthName}</span>
          <button onClick={nextMonth} className="p-1.5 rounded-xl hover:bg-white transition-colors">
            <ChevronRight size={15} className="text-gray-400" />
          </button>
        </div>

        {/* Day names */}
        <div className="grid grid-cols-7">
          {DAY_NAMES.map(d => (
            <div key={d} className="text-center text-xs font-500 text-gray-400 py-2">{d}</div>
          ))}
        </div>

        {/* Days */}
        <div className="grid grid-cols-7">
          {cells.map((day, i) => {
            if (!day) return <div key={`e-${i}`} className="aspect-square" />
            const ds  = `${year}-${pad(month + 1)}-${pad(day)}`
            const dp  = dayPosts(day)
            const isToday    = ds === today
            const isSelected = selectedDate === ds

            return (
              <button
                key={day}
                onClick={() => handleDayClick(day)}
                className={`aspect-square p-1 flex flex-col items-center gap-0.5 transition-all hover:bg-gray-50 ${
                  isSelected ? 'bg-pink-50' : ''
                }`}
              >
                <span className={`text-xs w-6 h-6 flex items-center justify-center rounded-full font-medium ${
                  isToday    ? 'bg-violet-500 text-white' :
                  isSelected ? 'bg-pink-400 text-white'   : 'text-gray-600'
                }`}>
                  {day}
                </span>
                {dp.length > 0 && (
                  <div className="flex gap-0.5 flex-wrap justify-center">
                    {dp.slice(0, 3).map(p => (
                      <span key={p.id} className={`w-1.5 h-1.5 rounded-full ${TYPE_DOT[p.contentType]}`} />
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
        {(Object.entries(CONTENT_TYPE_LABELS) as [PostContentType, string][]).map(([type, label]) => (
          <span key={type} className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${TYPE_DOT[type]}`} />
            {label}
          </span>
        ))}
      </div>

      {/* Selected day panel */}
      {selectedDate && (
        <div className="mt-4 border border-gray-100 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50 bg-gray-50/40">
            <h4 className="text-sm font-600 text-gray-700" dir="rtl">
              {new Date(selectedDate + 'T00:00').toLocaleDateString('he-IL', {
                weekday: 'long', day: 'numeric', month: 'long'
              })}
            </h4>
            <button
              onClick={() => setShowAdd(true)}
              className="flex items-center gap-1.5 text-xs font-600 text-pink-500 hover:text-pink-600 transition-colors"
            >
              <Plus size={13} /> הוסף פוסט
            </button>
          </div>

          {selectedPosts.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6" dir="rtl">אין פוסטים ביום זה</p>
          ) : (
            <div className="divide-y divide-gray-50">
              {selectedPosts.map(post => {
                const sc = STATUS_CONFIG[post.status]
                return (
                  <button
                    key={post.id}
                    onClick={() => setDetailPost(post)}
                    className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50/60 transition-colors text-right"
                  >
                    <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${TYPE_DOT[post.contentType]}`} />
                    <div className="flex-1 min-w-0" dir="rtl">
                      <p className="text-sm font-500 text-gray-800 truncate">{post.title}</p>
                      <p className="text-xs text-gray-400">
                        {PLATFORM_EMOJI[post.platform]} {post.platform} · {CONTENT_TYPE_LABELS[post.contentType]} · {post.time}
                      </p>
                    </div>
                    <span className={`text-xs font-600 px-2.5 py-1 rounded-full flex-shrink-0 ${sc.cls}`}>
                      {sc.label}
                    </span>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* Upcoming posts list */}
      {posts.length > 0 && (
        <div className="mt-4">
          <h4 className="text-xs font-600 text-gray-500 mb-2">כל הפוסטים ({posts.length})</h4>
          <div className="space-y-2">
            {posts
              .slice()
              .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
              .map(post => {
                const sc   = STATUS_CONFIG[post.status]
                const date = new Date(post.date + 'T00:00').toLocaleDateString('he-IL', { day: 'numeric', month: 'short' })
                return (
                  <button
                    key={post.id}
                    onClick={() => setDetailPost(post)}
                    className="w-full flex items-center gap-3 p-3 rounded-2xl bg-gray-50/60 hover:bg-gray-100/60 transition-colors text-right"
                  >
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${TYPE_DOT[post.contentType]}`} />
                    <div className="flex-1 min-w-0" dir="rtl">
                      <p className="text-sm font-500 text-gray-800 truncate">{post.title}</p>
                      <p className="text-xs text-gray-400">{PLATFORM_EMOJI[post.platform]} {date} · {post.time}</p>
                    </div>
                    {post.mediaUrl && <Image size={13} className="text-gray-300 flex-shrink-0" />}
                    <span className={`text-[10px] font-600 px-2 py-0.5 rounded-full flex-shrink-0 ${sc.cls}`}>
                      {sc.label}
                    </span>
                  </button>
                )
              })}
          </div>
        </div>
      )}

      {/* Modals */}
      {showAdd && (
        <AddPostModal
          clientId={clientId}
          clientName={clientName}
          selectedDate={selectedDate ?? today}
          clientPlatform={clientPlatform}
          onClose={() => setShowAdd(false)}
        />
      )}
      {detailPost && (
        <PostDetailModal
          post={detailPost}
          clientId={clientId}
          onClose={() => setDetailPost(null)}
        />
      )}
    </div>
  )
}
