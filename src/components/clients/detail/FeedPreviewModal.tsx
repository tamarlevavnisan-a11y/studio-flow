import { useState } from 'react'
import { X, Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Play, Grid, List } from 'lucide-react'
import type { ScheduledPost } from '../../../types'

interface Props {
  clientName: string
  clientAvatar: string
  posts: ScheduledPost[]
  onClose: () => void
  highlightPostId?: string
}

type FeedPlatform = 'Instagram' | 'TikTok' | 'Facebook'
type IgView = 'grid' | 'feed'

const PLATFORM_TABS: { id: FeedPlatform; label: string; emoji: string }[] = [
  { id: 'Instagram', label: 'Instagram', emoji: '📸' },
  { id: 'TikTok',    label: 'TikTok',    emoji: '🎵' },
  { id: 'Facebook',  label: 'Facebook',  emoji: '📘' },
]

// Avatar color gradient based on first letter
function avatarGradient(letter: string): string {
  const gradients = [
    'linear-gradient(135deg,#F472B6,#C084FC)',
    'linear-gradient(135deg,#60A5FA,#818CF8)',
    'linear-gradient(135deg,#34D399,#60A5FA)',
    'linear-gradient(135deg,#FBBF24,#F87171)',
    'linear-gradient(135deg,#A78BFA,#F472B6)',
  ]
  return gradients[(letter.charCodeAt(0) ?? 0) % gradients.length]
}

// ── Instagram Grid View ───────────────────────────────────────────────────────

function IgGrid({ posts, onSelectPost }: { posts: ScheduledPost[]; onSelectPost: (p: ScheduledPost) => void }) {
  return (
    <div className="grid grid-cols-3 gap-0.5">
      {posts.length === 0 && (
        <div className="col-span-3 flex flex-col items-center justify-center py-12 text-gray-300">
          <Grid size={32} className="mb-2" />
          <p className="text-xs">אין פוסטים עדיין</p>
        </div>
      )}
      {posts.map(post => (
        <button
          key={post.id}
          onClick={() => onSelectPost(post)}
          className="aspect-square relative overflow-hidden bg-gray-100 hover:opacity-90 transition-opacity"
        >
          {post.mediaUrl ? (
            <img src={post.mediaUrl} alt={post.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400 p-2 text-center leading-tight"
              style={{ background: 'linear-gradient(135deg,#fce7f3,#ede9fe)' }}>
              {post.title}
            </div>
          )}
          {(post.contentType === 'reel' || post.contentType === 'story') && (
            <div className="absolute top-1 right-1">
              <div className="w-4 h-4 bg-black/40 rounded-full flex items-center justify-center">
                <Play size={8} className="text-white fill-white ml-0.5" />
              </div>
            </div>
          )}
          {post.contentType === 'carousel' && (
            <div className="absolute top-1 right-1">
              <div className="w-4 h-4 bg-black/40 rounded flex items-center justify-center">
                <Grid size={8} className="text-white" />
              </div>
            </div>
          )}
          {post.status === 'pending' && (
            <div className="absolute bottom-0 left-0 right-0 bg-amber-400/80 text-[8px] text-white text-center py-0.5 font-600">
              ממתין
            </div>
          )}
        </button>
      ))}
    </div>
  )
}

// ── Instagram Post Card ───────────────────────────────────────────────────────

function IgPostCard({ post, clientName, clientAvatar }: { post: ScheduledPost; clientName: string; clientAvatar: string }) {
  const dateStr = new Date(post.date + 'T00:00').toLocaleDateString('he-IL', { day: 'numeric', month: 'short' })
  return (
    <div className="bg-white border-b border-gray-100">
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2">
        <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-700 flex-shrink-0"
          style={{ background: avatarGradient(clientAvatar) }}>
          {clientAvatar}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-700 text-gray-900 leading-tight">{clientName}</p>
          <p className="text-[9px] text-gray-400">{dateStr} · {post.time}</p>
        </div>
        <MoreHorizontal size={14} className="text-gray-400 flex-shrink-0" />
      </div>

      {/* Media */}
      {post.mediaUrl ? (
        <div className="relative">
          <img src={post.mediaUrl} alt={post.title} className="w-full aspect-square object-cover" />
          {(post.contentType === 'reel') && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <div className="w-10 h-10 bg-white/80 rounded-full flex items-center justify-center">
                <Play size={16} className="text-gray-800 fill-gray-800 ml-0.5" />
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="w-full aspect-square flex items-center justify-center p-6"
          style={{ background: 'linear-gradient(135deg,#fce7f3,#ede9fe)' }}>
          <p className="text-sm text-gray-600 text-center leading-relaxed line-clamp-6">{post.content || post.title}</p>
        </div>
      )}

      {/* Actions */}
      <div className="px-3 py-2">
        <div className="flex items-center gap-3 mb-1.5">
          <Heart size={16} className="text-gray-700" />
          <MessageCircle size={16} className="text-gray-700" />
          <Send size={16} className="text-gray-700" />
          <Bookmark size={16} className="text-gray-700 mr-auto" />
        </div>
        {post.content && (
          <p className="text-[10px] text-gray-700 leading-relaxed line-clamp-2">
            <span className="font-700">{clientName}</span> {post.content}
          </p>
        )}
      </div>

      {/* Status badge */}
      {post.status !== 'published' && (
        <div className={`mx-3 mb-2 px-2 py-1 rounded-xl text-[9px] font-600 text-center ${
          post.status === 'pending' ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-500'
        }`}>
          {post.status === 'pending' ? '⏰ מתוזמן לפרסום' : '❌ נכשל'}
        </div>
      )}
    </div>
  )
}

// ── TikTok View ───────────────────────────────────────────────────────────────

function TikTokView({ posts, clientName, clientAvatar }: { posts: ScheduledPost[]; clientName: string; clientAvatar: string }) {
  const reels = posts.filter(p => p.contentType === 'reel' || !p.contentType)
  const grid = reels.length > 0 ? reels : posts

  return (
    <div className="bg-black min-h-full">
      {/* Header */}
      <div className="px-3 pt-3 pb-2 flex items-center justify-between">
        <div className="flex gap-4 text-white/60 text-[11px] font-medium">
          <button>עוקב</button>
          <button className="text-white font-700 border-b border-white pb-0.5">בשבילך</button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 gap-0.5 px-0.5">
        {grid.length === 0 && (
          <div className="col-span-3 flex flex-col items-center justify-center py-12 text-gray-500">
            <Play size={32} className="mb-2" />
            <p className="text-xs">אין סרטונים עדיין</p>
          </div>
        )}
        {grid.map(post => (
          <div key={post.id} className="aspect-[9/16] relative overflow-hidden bg-gray-900 rounded-sm">
            {post.mediaUrl ? (
              <img src={post.mediaUrl} alt="" className="w-full h-full object-cover opacity-80" />
            ) : (
              <div className="w-full h-full flex items-center justify-center p-2"
                style={{ background: 'linear-gradient(180deg,#1a1a2e,#16213e)' }}>
                <p className="text-[9px] text-gray-300 text-center leading-tight line-clamp-4">{post.title}</p>
              </div>
            )}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Play size={10} className="text-white fill-white ml-0.5" />
              </div>
            </div>
            <div className="absolute bottom-1 left-1 right-1">
              <p className="text-[8px] text-white/90 truncate">{post.title}</p>
              <p className="text-[7px] text-white/50">{post.time}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Profile row */}
      <div className="mt-3 px-3 flex items-center gap-2 pb-3">
        <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-700"
          style={{ background: avatarGradient(clientAvatar) }}>
          {clientAvatar}
        </div>
        <span className="text-white text-[11px] font-600">@{clientName.toLowerCase().replace(/\s/g, '_')}</span>
      </div>
    </div>
  )
}

// ── Facebook View ─────────────────────────────────────────────────────────────

function FacebookView({ posts, clientName, clientAvatar }: { posts: ScheduledPost[]; clientName: string; clientAvatar: string }) {
  return (
    <div className="bg-gray-100 min-h-full">
      {/* Page header */}
      <div className="bg-white mb-2 pb-3">
        <div className="h-16 bg-gradient-to-r from-blue-400 to-blue-600 rounded-b-sm" />
        <div className="px-3 -mt-5 flex items-end gap-2">
          <div className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center text-white text-sm font-700 shadow-md"
            style={{ background: avatarGradient(clientAvatar) }}>
            {clientAvatar}
          </div>
          <div className="mb-1">
            <p className="text-[12px] font-700 text-gray-900">{clientName}</p>
            <p className="text-[9px] text-gray-400">דף עסקי</p>
          </div>
        </div>
      </div>

      {/* Posts */}
      <div className="space-y-2 px-2">
        {posts.length === 0 && (
          <div className="bg-white rounded-xl flex flex-col items-center py-10 text-gray-300">
            <List size={28} className="mb-2" />
            <p className="text-xs">אין פוסטים עדיין</p>
          </div>
        )}
        {posts.map(post => (
          <div key={post.id} className="bg-white rounded-xl overflow-hidden shadow-sm">
            <div className="px-3 py-2.5 flex items-center gap-2">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-700"
                style={{ background: avatarGradient(clientAvatar) }}>
                {clientAvatar}
              </div>
              <div>
                <p className="text-[11px] font-700 text-gray-900">{clientName}</p>
                <p className="text-[9px] text-gray-400">{new Date(post.date + 'T00:00').toLocaleDateString('he-IL', { day: 'numeric', month: 'short' })} · {post.time}</p>
              </div>
            </div>
            {post.content && (
              <p className="px-3 pb-2 text-[11px] text-gray-700 leading-relaxed line-clamp-3">{post.content}</p>
            )}
            {post.mediaUrl && (
              <img src={post.mediaUrl} alt="" className="w-full max-h-40 object-cover" />
            )}
            <div className="flex items-center gap-2 px-3 py-2 border-t border-gray-50">
              {['👍 אהבתי', '💬 תגובה', '↗️ שיתוף'].map(a => (
                <button key={a} className="flex-1 text-[9px] text-gray-500 font-medium py-1 hover:bg-gray-50 rounded-lg transition-colors">{a}</button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Main Modal ────────────────────────────────────────────────────────────────

export default function FeedPreviewModal({ clientName, clientAvatar, posts, onClose, highlightPostId }: Props) {
  const [platform, setPlatform] = useState<FeedPlatform>('Instagram')
  const [igView, setIgView]     = useState<IgView>('grid')
  const [selectedPost, setSelectedPost] = useState<ScheduledPost | null>(
    highlightPostId ? posts.find(p => p.id === highlightPostId) ?? null : null
  )

  // Filter posts by platform
  const platformPosts = posts.filter(p =>
    p.platforms?.includes(platform) || p.platform === platform
  ).sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="relative flex flex-col items-center gap-4" style={{ maxHeight: '95vh' }}>
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute -top-2 -right-2 z-10 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors"
        >
          <X size={15} />
        </button>

        {/* Platform tabs */}
        <div className="flex bg-white/10 backdrop-blur-sm rounded-2xl p-1 gap-1">
          {PLATFORM_TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setPlatform(t.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-600 transition-all ${
                platform === t.id
                  ? 'bg-white text-gray-800 shadow-sm'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <span>{t.emoji}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        {/* Instagram view toggle */}
        {platform === 'Instagram' && (
          <div className="flex bg-white/10 rounded-xl p-0.5 gap-0.5">
            <button
              onClick={() => setIgView('grid')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-600 transition-all ${igView === 'grid' ? 'bg-white text-gray-700 shadow-sm' : 'text-white/70'}`}
            >
              <Grid size={12} /> גריד
            </button>
            <button
              onClick={() => setIgView('feed')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-600 transition-all ${igView === 'feed' ? 'bg-white text-gray-700 shadow-sm' : 'text-white/70'}`}
            >
              <List size={12} /> פיד
            </button>
          </div>
        )}

        {/* Phone frame */}
        <div
          className="relative rounded-[36px] overflow-hidden shadow-2xl"
          style={{
            width: 260,
            height: 520,
            background: platform === 'TikTok' ? '#000' : platform === 'Facebook' ? '#f0f2f5' : '#fff',
            border: '6px solid #1a1a1a',
            boxShadow: '0 0 0 1px rgba(255,255,255,0.1), 0 30px 80px rgba(0,0,0,0.5)',
          }}
        >
          {/* Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-5 bg-black rounded-b-2xl z-10 flex items-center justify-center">
            <div className="w-8 h-1.5 bg-gray-800 rounded-full" />
          </div>

          {/* Instagram */}
          {platform === 'Instagram' && (
            <div className="h-full flex flex-col overflow-hidden">
              {/* IG header */}
              <div className="pt-6 px-3 pb-2 border-b border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[13px] font-black text-gray-900" style={{ fontFamily: 'serif' }}>{clientName}</span>
                  <div className="flex gap-2">
                    <Grid size={16} className="text-gray-700 cursor-pointer" onClick={() => setIgView('grid')} />
                    <List size={16} className="text-gray-700 cursor-pointer" onClick={() => setIgView('feed')} />
                  </div>
                </div>

                {/* Profile row */}
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-700 text-sm ring-2 ring-pink-400 ring-offset-1"
                    style={{ background: avatarGradient(clientAvatar) }}>
                    {clientAvatar}
                  </div>
                  <div className="flex gap-3 text-center">
                    {[['פוסטים', platformPosts.length], ['עוקבים', '—'], ['עוקב', '—']].map(([l, v]) => (
                      <div key={String(l)}>
                        <p className="text-[11px] font-700 text-gray-900">{v}</p>
                        <p className="text-[9px] text-gray-500">{l}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Stories */}
                <div className="flex gap-2 pb-2 overflow-x-hidden">
                  {platformPosts.slice(0, 4).map(post => (
                    <div key={post.id} className="flex flex-col items-center gap-1 flex-shrink-0">
                      <div className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-pink-400 ring-offset-1">
                        {post.mediaUrl ? (
                          <img src={post.mediaUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full" style={{ background: avatarGradient(clientAvatar) }} />
                        )}
                      </div>
                      <p className="text-[8px] text-gray-500 truncate max-w-[36px]">{post.title.split(' ')[0]}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto scrollbar-none">
                {igView === 'grid' ? (
                  <IgGrid posts={platformPosts} onSelectPost={setSelectedPost} />
                ) : (
                  <div>
                    {platformPosts.map(p => (
                      <IgPostCard key={p.id} post={p} clientName={clientName} clientAvatar={clientAvatar} />
                    ))}
                    {platformPosts.length === 0 && (
                      <div className="flex flex-col items-center justify-center py-12 text-gray-300">
                        <Heart size={32} className="mb-2" />
                        <p className="text-xs">אין פוסטים לפלטפורמה זו</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TikTok */}
          {platform === 'TikTok' && (
            <div className="h-full overflow-y-auto scrollbar-none pt-5">
              <TikTokView posts={platformPosts} clientName={clientName} clientAvatar={clientAvatar} />
            </div>
          )}

          {/* Facebook */}
          {platform === 'Facebook' && (
            <div className="h-full overflow-y-auto scrollbar-none pt-5">
              <FacebookView posts={platformPosts} clientName={clientName} clientAvatar={clientAvatar} />
            </div>
          )}
        </div>

        {/* Post count */}
        <p className="text-white/60 text-xs text-center">
          {platformPosts.length} פוסטים ב-{platform}
        </p>
      </div>

      {/* Selected post overlay */}
      {selectedPost && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center bg-black/70 backdrop-blur-sm p-6"
          onClick={() => setSelectedPost(null)}
        >
          <div className="bg-white rounded-[20px] w-full max-w-xs shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50">
              <p className="text-sm font-700 text-gray-800">{selectedPost.title}</p>
              <button onClick={() => setSelectedPost(null)} className="w-7 h-7 rounded-full hover:bg-gray-100 flex items-center justify-center">
                <X size={14} className="text-gray-400" />
              </button>
            </div>
            {selectedPost.mediaUrl && (
              <img src={selectedPost.mediaUrl} alt="" className="w-full aspect-square object-cover" />
            )}
            {!selectedPost.mediaUrl && (
              <div className="aspect-square flex items-center justify-center p-6"
                style={{ background: 'linear-gradient(135deg,#fce7f3,#ede9fe)' }}>
                <p className="text-sm text-gray-600 text-center leading-relaxed">{selectedPost.content || selectedPost.title}</p>
              </div>
            )}
            <div className="p-4 space-y-1">
              {selectedPost.content && <p className="text-xs text-gray-600 line-clamp-3">{selectedPost.content}</p>}
              <p className="text-[10px] text-gray-400">{selectedPost.date} · {selectedPost.time}</p>
              <div className="flex gap-1 flex-wrap">
                {selectedPost.platforms.map(pl => (
                  <span key={pl} className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-500">{pl}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
