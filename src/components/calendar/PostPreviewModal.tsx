import { X, Calendar, Clock } from 'lucide-react'
import { usePosts } from '../../store/PostsContext'
import type { ScheduledPost, PostStatus } from '../../types'

const STATUS_CONFIG: Record<PostStatus, { label: string; cls: string; next: PostStatus }> = {
  pending:   { label: 'ממתין לפרסום', cls: 'bg-amber-100 text-amber-700',  next: 'published' },
  published: { label: 'פורסם',         cls: 'bg-teal-100  text-teal-700',   next: 'failed'    },
  failed:    { label: 'נכשל',          cls: 'bg-red-100   text-red-600',    next: 'pending'   },
}

const PLATFORM_EMOJI: Record<string, string> = {
  Instagram: '📸', TikTok: '🎵', Facebook: '📘',
}

const CONTENT_LABEL: Record<string, string> = {
  post: 'פוסט', reel: 'ריל', story: 'סטורי', carousel: 'קרוסלה',
}

interface Props {
  post: ScheduledPost
  onClose: () => void
}

export default function PostPreviewModal({ post, onClose }: Props) {
  const { updatePost } = usePosts()
  const sc   = STATUS_CONFIG[post.status]
  const date = new Date(post.date + 'T00:00').toLocaleDateString('he-IL', {
    weekday: 'long', day: 'numeric', month: 'long'
  })

  async function cycleStatus() {
    await updatePost(post.id, { status: sc.next })
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/30 backdrop-blur-sm p-4"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-[20px] shadow-2xl w-full max-w-sm" style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
          <div className="flex items-center gap-2">
            <span className="text-base">{PLATFORM_EMOJI[post.platform] ?? '📱'}</span>
            <div dir="rtl">
              <p className="text-sm font-600 text-gray-800 leading-tight">{post.title}</p>
              <p className="text-[10px] text-gray-400">{post.platform} · {CONTENT_LABEL[post.contentType] ?? post.contentType} · {post.clientName}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 transition-colors flex-shrink-0">
            <X size={14} />
          </button>
        </div>

        <div className="p-5 space-y-3" dir="rtl">
          {/* Content preview */}
          {post.content && (
            <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 rounded-2xl px-3.5 py-3 line-clamp-3">
              {post.content}
            </p>
          )}

          {/* Image preview */}
          {post.mediaUrl && post.mediaUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i) && (
            <img src={post.mediaUrl} alt="media" className="w-full h-36 object-cover rounded-2xl" />
          )}

          {/* Meta */}
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1.5"><Calendar size={12} />{date}</span>
            <span className="flex items-center gap-1.5"><Clock size={12} />{post.time}</span>
          </div>

          {/* Status toggle */}
          <button
            onClick={cycleStatus}
            className={`w-full py-2.5 rounded-2xl text-sm font-600 transition-all hover:opacity-80 ${sc.cls}`}
          >
            {sc.label} → {STATUS_CONFIG[sc.next].label}
          </button>
        </div>
      </div>
    </div>
  )
}
