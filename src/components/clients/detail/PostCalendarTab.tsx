import { useState, useRef } from 'react'
import { ChevronRight, ChevronLeft, Plus, Trash2, Upload, X, Image, Film, Eye, Send } from 'lucide-react'
import Modal from '../../ui/Modal'
import InstagramConnectButton from './InstagramConnectButton'
import FeedPreviewModal from './FeedPreviewModal'
import { usePosts } from '../../../store/PostsContext'
import { useInstagram } from '../../../store/InstagramContext'
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

const PLATFORM_OPTIONS: { id: PostPlatform; emoji: string; label: string; color: string; connectSupport: 'ready' | 'soon' }[] = [
  { id: 'Instagram', emoji: '📸', label: 'Instagram', color: 'from-pink-500 to-purple-600', connectSupport: 'ready' },
  { id: 'TikTok',    emoji: '🎵', label: 'TikTok',    color: 'from-gray-900 to-gray-700',   connectSupport: 'soon'  },
  { id: 'Facebook',  emoji: '📘', label: 'Facebook',  color: 'from-blue-600 to-blue-700',   connectSupport: 'soon'  },
]

// ── Helpers ───────────────────────────────────────────────────────────────────

function pad(n: number) { return String(n).padStart(2, '0') }

function todayStr() {
  const d = new Date()
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

const inputCls = `w-full border border-gray-200 rounded-2xl px-3.5 py-2.5 text-sm
  focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-300 transition-all bg-white`

// ── Platform Checkboxes ───────────────────────────────────────────────────────

function PlatformCheckboxes({
  selected,
  onChange,
}: {
  selected: PostPlatform[]
  onChange: (platforms: PostPlatform[]) => void
}) {
  function toggle(id: PostPlatform) {
    const next = selected.includes(id)
      ? selected.length > 1 ? selected.filter(p => p !== id) : selected
      : [...selected, id]
    onChange(next)
  }

  return (
    <div className="flex flex-wrap gap-2">
      {PLATFORM_OPTIONS.map(p => {
        const active = selected.includes(p.id)
        return (
          <button
            key={p.id}
            type="button"
            onClick={() => toggle(p.id)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-600 border transition-all ${
              active
                ? `text-white border-transparent bg-gradient-to-r ${p.color} shadow-sm`
                : 'bg-gray-50 border-gray-200 text-gray-500 hover:border-gray-300'
            }`}
          >
            <span>{p.emoji}</span>
            <span>{p.label}</span>
          </button>
        )
      })}
    </div>
  )
}

// ── Connect Accounts Section ──────────────────────────────────────────────────

function ConnectAccountsSection({ clientId }: { clientId: string }) {
  return (
    <div className="rounded-2xl overflow-hidden border border-gray-100 mb-4">
      {/* Header */}
      <div className="px-4 py-3 bg-gradient-to-r from-pink-50 to-purple-50 border-b border-gray-100">
        <p className="text-xs font-700 text-gray-700">🔗 חיבור חשבונות לפרסום אוטומטי</p>
        <p className="text-[10px] text-gray-400 mt-0.5">חברי חשבון כדי שהפוסטים יתפרסמו אוטומטית בזמן המתוזמן</p>
      </div>

      {/* Rows */}
      <div className="divide-y divide-gray-50">
        {/* Instagram */}
        <div className="flex items-center gap-3 px-4 py-3 bg-white">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-base flex-shrink-0"
            style={{ background: 'linear-gradient(135deg,#f9a8d4,#c084fc)' }}>
            📸
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-600 text-gray-800">Instagram</p>
            <p className="text-[10px] text-gray-400">חשבון עסקי דרך Meta / Facebook</p>
          </div>
          <InstagramConnectButton clientId={clientId} compact />
        </div>

        {/* Facebook */}
        <div className="flex items-center gap-3 px-4 py-3 bg-white">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-base flex-shrink-0 bg-blue-100">
            📘
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-600 text-gray-800">Facebook</p>
            <p className="text-[10px] text-gray-400">דף עסקי</p>
          </div>
          <span className="text-[10px] px-2.5 py-1 rounded-xl bg-amber-50 text-amber-600 font-600 border border-amber-100 flex-shrink-0">
            בקרוב
          </span>
        </div>

        {/* TikTok */}
        <div className="flex items-center gap-3 px-4 py-3 bg-white">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-base flex-shrink-0 bg-gray-900">
            🎵
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-600 text-gray-800">TikTok</p>
            <p className="text-[10px] text-gray-400">Creator / Business account</p>
          </div>
          <span className="text-[10px] px-2.5 py-1 rounded-xl bg-amber-50 text-amber-600 font-600 border border-amber-100 flex-shrink-0">
            בקרוב
          </span>
        </div>
      </div>
    </div>
  )
}

// ── Add Post Modal ────────────────────────────────────────────────────────────

interface AddPostModalProps {
  clientId: string
  clientName: string
  clientAvatar: string
  selectedDate: string
  clientPlatform: string
  onClose: () => void
  onOpenFeed?: (postId?: string) => void
}

function AddPostModal({ clientId, clientName, clientAvatar, selectedDate, clientPlatform, onClose, onOpenFeed }: AddPostModalProps) {
  const { addPost, uploadMedia, posts: allPosts } = usePosts()
  const fileRef = useRef<HTMLInputElement>(null)

  const defaultPlatform = (PLATFORM_OPTIONS.find(p => p.id === clientPlatform)?.id ?? 'Instagram') as PostPlatform
  const [platforms, setPlatforms] = useState<PostPlatform[]>([defaultPlatform])

  const [form, setForm] = useState({
    title:       '',
    content:     '',
    contentType: 'post' as PostContentType,
    date:        selectedDate,
    time:        '09:00',
    status:      'pending' as PostStatus,
  })
  const [mediaFile,    setMediaFile]    = useState<File | null>(null)
  const [mediaPreview, setMediaPreview] = useState<string>('')
  const [saving,       setSaving]       = useState(false)
  const [savedPostId,  setSavedPostId]  = useState<string | null>(null)

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
    await addPost({
      clientId,
      clientName,
      ...form,
      platform: platforms[0],
      platforms,
      mediaUrl,
    })
    // find the newly added post by matching title+date+time
    const newPost = allPosts.find(p =>
      p.clientId === clientId && p.title === form.title && p.date === form.date
    )
    if (newPost) setSavedPostId(newPost.id)
    setSaving(false)
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

        {/* Platforms */}
        <div>
          <label className="block text-xs font-600 text-gray-600 mb-2">פלטפורמות לפרסום</label>
          <PlatformCheckboxes selected={platforms} onChange={setPlatforms} />
          <p className="text-[10px] text-gray-400 mt-1.5">בחרי אחת או יותר — הפוסט יפורסם בכולן</p>
        </div>

        {/* Content */}
        <div>
          <label className="block text-xs font-600 text-gray-600 mb-1.5">טקסט הפוסט / קפשן</label>
          <textarea
            value={form.content}
            onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
            placeholder="כתבי את הטקסט המלא של הפוסט כאן..."
            rows={3}
            className={`${inputCls} resize-none leading-relaxed`}
          />
        </div>

        {/* Content type */}
        <div>
          <label className="block text-xs font-600 text-gray-600 mb-1.5">סוג תוכן</label>
          <div className="flex gap-2">
            {(Object.entries(CONTENT_TYPE_LABELS) as [PostContentType, string][]).map(([type, label]) => (
              <button
                key={type}
                type="button"
                onClick={() => setForm(f => ({ ...f, contentType: type }))}
                className={`flex-1 py-2 rounded-2xl text-xs font-600 border transition-all ${
                  form.contentType === type
                    ? `${TYPE_DOT[type].replace('bg-', 'bg-').replace('400', '100')} border-transparent text-gray-700 shadow-sm`
                    : 'bg-white border-gray-200 text-gray-400 hover:border-gray-300'
                }`}
              >
                <span className={`inline-block w-1.5 h-1.5 rounded-full ${TYPE_DOT[type]} mr-1 mb-0.5`} />
                {label}
              </button>
            ))}
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

        {/* Feed preview hint */}
        {(mediaPreview || form.content) && onOpenFeed && (
          <button
            type="button"
            onClick={() => { onClose(); onOpenFeed?.() }}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-2xl border border-pink-200 text-pink-500 text-xs font-600 hover:bg-pink-50 transition-colors"
          >
            <Eye size={14} />
            תצוגה מקדימה בפיד
          </button>
        )}

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
            {saving ? 'שומר...' : `תזמן ב-${platforms.length > 1 ? platforms.length + ' פלטפורמות' : platforms[0]} ✨`}
          </button>
        </div>
      </form>
    </Modal>
  )
}

// ── Post Detail Modal ─────────────────────────────────────────────────────────

function PostDetailModal({
  post,
  clientId,
  clientName,
  clientAvatar,
  onClose,
  onOpenFeed,
}: {
  post: ScheduledPost
  clientId: string
  clientName: string
  clientAvatar: string
  onClose: () => void
  onOpenFeed: (postId: string) => void
}) {
  const { updatePost, deletePost } = usePosts()
  const { getConnection } = useInstagram()
  const connection = getConnection(clientId)
  const [publishing, setPublishing] = useState(false)
  const [publishMsg, setPublishMsg] = useState('')

  async function cycleStatus() {
    const next = STATUS_CONFIG[post.status].next
    await updatePost(post.id, { status: next })
    onClose()
  }

  async function handleDelete() {
    await deletePost(post.id)
    onClose()
  }

  async function publishNow() {
    if (!connection) return
    setPublishing(true)
    setPublishMsg('')
    try {
      const res = await fetch('/api/instagram-publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          igUserId:    connection.igUserId,
          accessToken: connection.accessToken,
          caption:     post.content,
          mediaUrl:    post.mediaUrl,
          contentType: post.contentType,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'הפרסום נכשל')
      await updatePost(post.id, { status: 'published' })
      setPublishMsg('✅ פורסם בהצלחה באינסטגרם!')
      setTimeout(onClose, 1500)
    } catch (err) {
      setPublishMsg(`❌ ${err instanceof Error ? err.message : 'שגיאה בפרסום'}`)
    } finally {
      setPublishing(false)
    }
  }

  const sc = STATUS_CONFIG[post.status]
  const date = new Date(post.date + 'T00:00').toLocaleDateString('he-IL', {
    weekday: 'long', day: 'numeric', month: 'long'
  })
  const isIgPost = post.platforms.includes('Instagram')

  return (
    <Modal title="פרטי פוסט" onClose={onClose}>
      <div className="space-y-4" dir="rtl">
        {/* Header */}
        <div className="flex items-start gap-3">
          <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 mt-1.5 ${TYPE_DOT[post.contentType]}`} />
          <div className="flex-1">
            <h3 className="font-600 text-gray-900">{post.title}</h3>
            <div className="flex flex-wrap gap-1 mt-1">
              {post.platforms.map(pl => (
                <span key={pl} className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-500">
                  {PLATFORM_OPTIONS.find(p => p.id === pl)?.emoji} {pl}
                </span>
              ))}
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                {CONTENT_TYPE_LABELS[post.contentType]}
              </span>
            </div>
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

        {/* Publish Now — Instagram only, when connected */}
        {isIgPost && post.status === 'pending' && (
          <div className="rounded-2xl border overflow-hidden"
            style={{ borderColor: connection ? '#bbf7d0' : '#fde68a' }}>
            <div className="px-4 py-3 flex items-center justify-between"
              style={{ background: connection ? '#f0fdf4' : '#fffbeb' }}>
              <div>
                <p className="text-xs font-700" style={{ color: connection ? '#15803d' : '#92400e' }}>
                  {connection ? `📸 מחובר: @${connection.igUsername}` : '📸 לא מחובר לאינסטגרם'}
                </p>
                <p className="text-[10px] mt-0.5" style={{ color: connection ? '#166534' : '#78350f' }}>
                  {connection
                    ? 'לחצי "פרסם עכשיו" לפרסום מיידי, או שמרי — יתפרסם אוטומטית בזמן המתוזמן'
                    : 'חברי חשבון Instagram כדי לפרסם אוטומטית'}
                </p>
              </div>
              {connection && post.status === 'pending' && (
                <button
                  onClick={publishNow}
                  disabled={publishing}
                  className="flex items-center gap-1.5 text-xs font-700 px-3 py-2 rounded-xl text-white transition-all disabled:opacity-60 flex-shrink-0 mr-2"
                  style={{ background: 'linear-gradient(135deg,#F472B6,#C084FC)' }}
                >
                  <Send size={12} />
                  {publishing ? 'מפרסם...' : 'פרסם עכשיו'}
                </button>
              )}
            </div>
            {publishMsg && (
              <div className="px-4 py-2 text-xs font-500 text-center border-t border-gray-100">
                {publishMsg}
              </div>
            )}
          </div>
        )}

        {/* Feed preview */}
        <button
          onClick={() => { onClose(); onOpenFeed(post.id) }}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl border border-pink-200 text-pink-500 text-xs font-600 hover:bg-pink-50 transition-colors"
        >
          <Eye size={14} />
          ראי איך זה נראה בפיד
        </button>

        {/* Status + delete */}
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
  clientAvatar?: string
}

export default function PostCalendarTab({ clientId, clientName, clientPlatform, clientAvatar = 'C' }: Props) {
  const { posts: allPosts } = usePosts()
  const posts = allPosts.filter(p => p.clientId === clientId)

  const now = new Date()
  const [year, setYear]               = useState(now.getFullYear())
  const [month, setMonth]             = useState(now.getMonth())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [showAdd, setShowAdd]         = useState(false)
  const [detailPost, setDetailPost]   = useState<ScheduledPost | null>(null)
  const [showFeed, setShowFeed]       = useState(false)
  const [feedHighlight, setFeedHighlight] = useState<string | undefined>()
  const [showConnect, setShowConnect] = useState(true)

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

  const pending   = posts.filter(p => p.status === 'pending').length
  const published = posts.filter(p => p.status === 'published').length

  function openFeedForPost(postId?: string) {
    setFeedHighlight(postId)
    setShowFeed(true)
  }

  return (
    <div dir="rtl">
      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div className="flex items-center gap-3 text-xs flex-wrap">
          <span className="flex items-center gap-1.5 text-amber-600">
            <span className="w-2 h-2 rounded-full bg-amber-400" />{pending} ממתינים
          </span>
          <span className="flex items-center gap-1.5 text-teal-600">
            <span className="w-2 h-2 rounded-full bg-teal-400" />{published} פורסמו
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Feed Preview */}
          <button
            onClick={() => openFeedForPost()}
            className="flex items-center gap-1.5 text-xs font-600 px-3 py-2 rounded-2xl border border-pink-200 text-pink-500 hover:bg-pink-50 transition-colors"
          >
            <Eye size={13} /> פיד מדומה
          </button>

          {/* Connect accounts toggle */}
          <button
            onClick={() => setShowConnect(c => !c)}
            className="flex items-center gap-1.5 text-xs font-600 px-3 py-2 rounded-2xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
          >
            🔗 {showConnect ? 'הסתר חשבונות' : 'חיבור חשבונות'}
          </button>

          {/* Add post */}
          <button
            onClick={() => { setSelectedDate(today); setShowAdd(true) }}
            className="flex items-center gap-2 text-white text-sm font-600 px-4 py-2 rounded-2xl transition-all hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #F472B6, #C084FC)' }}
          >
            <Plus size={15} /> תזמן פוסט
          </button>
        </div>
      </div>

      {/* ── Connect Accounts (collapsible) ── */}
      {showConnect && <ConnectAccountsSection clientId={clientId} />}

      {/* ── Calendar grid ── */}
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
            <h4 className="text-sm font-600 text-gray-700">
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
            <p className="text-sm text-gray-400 text-center py-6">אין פוסטים ביום זה</p>
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
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-500 text-gray-800 truncate">{post.title}</p>
                      <p className="text-xs text-gray-400">
                        {post.platforms.map(p => PLATFORM_OPTIONS.find(o => o.id === p)?.emoji).join(' ')} · {CONTENT_TYPE_LABELS[post.contentType]} · {post.time}
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

      {/* All posts list */}
      {posts.length > 0 && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-600 text-gray-500">כל הפוסטים ({posts.length})</h4>
            <button
              onClick={() => openFeedForPost()}
              className="text-xs text-pink-500 font-500 flex items-center gap-1 hover:text-pink-600"
            >
              <Eye size={11} /> הצג בפיד
            </button>
          </div>
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
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-500 text-gray-800 truncate">{post.title}</p>
                      <p className="text-xs text-gray-400">
                        {post.platforms.map(p => PLATFORM_OPTIONS.find(o => o.id === p)?.emoji).join(' ')} {date} · {post.time}
                      </p>
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
          clientAvatar={clientAvatar}
          selectedDate={selectedDate ?? today}
          clientPlatform={clientPlatform}
          onClose={() => setShowAdd(false)}
          onOpenFeed={() => openFeedForPost()}
        />
      )}
      {detailPost && (
        <PostDetailModal
          post={detailPost}
          clientId={clientId}
          clientName={clientName}
          clientAvatar={clientAvatar}
          onClose={() => setDetailPost(null)}
          onOpenFeed={(id) => openFeedForPost(id)}
        />
      )}
      {showFeed && (
        <FeedPreviewModal
          clientName={clientName}
          clientAvatar={clientAvatar}
          posts={posts}
          onClose={() => { setShowFeed(false); setFeedHighlight(undefined) }}
          highlightPostId={feedHighlight}
        />
      )}
    </div>
  )
}
