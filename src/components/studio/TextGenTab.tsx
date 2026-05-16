import { useState } from 'react'
import { Wand2, Copy, Check, Calendar, AlertCircle } from 'lucide-react'
import { generateText } from '../../lib/huggingface'
import { usePosts } from '../../store/PostsContext'
import type { ClientDetail, PostContentType, PostPlatform, BrandProfile } from '../../types'

const CONTENT_TYPES = [
  { type: 'post',     label: 'פוסט',    prompt: 'Write an engaging Instagram caption' },
  { type: 'reel',     label: 'ריל',     prompt: 'Write a full 30-second reel script' },
  { type: 'story',    label: 'סטורי',   prompt: 'Write text for a 3-slide story series' },
  { type: 'carousel', label: 'קרוסלה', prompt: 'Write content for a 5-slide carousel post' },
] as const

const PLATFORMS: { value: PostPlatform; label: string }[] = [
  { value: 'Instagram', label: '📸 Instagram' },
  { value: 'TikTok',    label: '🎵 TikTok' },
  { value: 'Facebook',  label: '📘 Facebook' },
]

const TONE_LABELS: Record<BrandProfile['tone'], string> = {
  professional: 'professional',
  casual:       'casual and friendly',
  fun:          'fun and energetic',
  inspiring:    'inspiring and motivational',
  luxury:       'luxurious and sophisticated',
}

function buildPrompt(clientName: string, platform: string, brand?: BrandProfile): string {
  return `You are an expert social media content creator for an Israeli social media manager.
You create content for the client "${clientName}" on ${platform}.
${brand ? `
Brand profile:
- Writing style: ${brand.writingStyle || 'authentic and engaging'}
- Target audience: ${brand.targetAudience || 'general audience'}
- Marketing message: ${brand.marketingMessage || ''}
- Tone: ${TONE_LABELS[brand.tone] ?? brand.tone}
- Keywords: ${brand.keywords?.join(', ') || ''}
` : '(No brand profile set yet)'}
Write ALWAYS in Hebrew (עברית). Match the exact brand tone and style.
Use emojis naturally. Add relevant hashtags at the end.`
}

interface Props { client: ClientDetail }

export default function TextGenTab({ client }: Props) {
  const { addPost } = usePosts()
  const [contentType, setContentType] = useState<PostContentType>('post')
  const [platform, setPlatform]       = useState<PostPlatform>(
    (PLATFORMS.find(p => p.value === client.platform)?.value) ?? 'Instagram'
  )
  const [topic, setTopic]     = useState('')
  const [result, setResult]   = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied]   = useState(false)
  const [error, setError]     = useState('')
  const [scheduled, setScheduled] = useState(false)
  const brand  = client.brandProfile
  const accent = brand?.primaryColor ?? '#C084FC'

  async function generate() {
    setLoading(true)
    setResult('')
    setError('')
    setScheduled(false)

    const typeEntry = CONTENT_TYPES.find(t => t.type === contentType)!
    const userMsg   = `${typeEntry.prompt} for the brand "${client.name}" on ${platform}.
Topic: ${topic || 'general brand content matching the brand profile'}
${brand?.keywords?.length ? `Use these keywords: ${brand.keywords.join(', ')}` : ''}
Write in Hebrew only. Add relevant hashtags at the end.`

    try {
      const text = await generateText(
        buildPrompt(client.name, platform, brand),
        [{ role: 'user', content: userMsg }]
      )
      setResult(text)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'שגיאה ביצירת טקסט')
    } finally {
      setLoading(false)
    }
  }

  async function copy() {
    await navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  function schedulePost() {
    if (!result) return
    const tmr = new Date()
    tmr.setDate(tmr.getDate() + 1)
    addPost({
      clientId: client.id, clientName: client.name,
      title: topic || `${contentType} — ${client.name}`,
      content: result,
      contentType, platform,
      date: tmr.toISOString().slice(0, 10),
      time: '09:00',
      status: 'pending',
    })
    setScheduled(true)
  }

  return (
    <div className="space-y-4" dir="rtl">

      {/* Content type */}
      <div className="flex gap-2 flex-wrap">
        {CONTENT_TYPES.map(ct => (
          <button key={ct.type} onClick={() => setContentType(ct.type as PostContentType)}
            className={`px-4 py-2 rounded-2xl text-sm font-600 border transition-all ${
              contentType === ct.type ? 'text-white border-transparent' : 'bg-white border-gray-200 text-gray-500'
            }`}
            style={contentType === ct.type ? { background: `linear-gradient(135deg, ${accent}, ${brand?.secondaryColor ?? '#F472B6'})` } : {}}>
            {ct.label}
          </button>
        ))}
      </div>

      {/* Platform */}
      <div className="flex gap-2">
        {PLATFORMS.map(p => (
          <button key={p.value} onClick={() => setPlatform(p.value)}
            className={`flex-1 py-2 rounded-2xl text-xs font-600 border transition-all ${
              platform === p.value ? 'bg-gray-800 text-white border-transparent' : 'bg-white border-gray-200 text-gray-500'
            }`}>
            {p.label}
          </button>
        ))}
      </div>

      {/* Topic */}
      <div>
        <label className="text-xs font-600 text-gray-500 block mb-1.5">נושא / נקודת מוצא</label>
        <input
          value={topic}
          onChange={e => setTopic(e.target.value)}
          placeholder="לדוג': השקת מוצר חדש, טיפ שבועי, מבצע..."
          className="w-full border border-gray-200 rounded-2xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 bg-white"
        />
      </div>

      {/* Generate */}
      <button onClick={generate} disabled={loading}
        className="w-full py-3 rounded-2xl text-white text-sm font-600 flex items-center justify-center gap-2 disabled:opacity-50 transition-all hover:opacity-90"
        style={{ background: `linear-gradient(135deg, ${accent}, ${brand?.secondaryColor ?? '#F472B6'})` }}>
        <Wand2 size={16} />
        {loading
          ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> יוצרת...</>
          : `צרי ${CONTENT_TYPES.find(t => t.type === contentType)?.label}`}
      </button>

      {/* Result */}
      {(result || loading) && (
        <div className="relative">
          <div className="border border-gray-100 rounded-3xl p-4 bg-white min-h-[140px]">
            <pre className="whitespace-pre-wrap text-sm text-gray-800 leading-relaxed font-sans" style={{ fontFamily: brand?.fontBody ?? 'Heebo' }}>
              {result || '...'}
            </pre>
          </div>
          {result && (
            <div className="flex gap-2 mt-3">
              <button onClick={copy}
                className="flex items-center gap-2 flex-1 py-2.5 rounded-2xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors justify-center">
                {copied ? <><Check size={14} className="text-green-500" /> הועתק!</> : <><Copy size={14} /> העתקי</>}
              </button>
              <button onClick={schedulePost}
                className="flex items-center gap-2 flex-1 py-2.5 rounded-2xl text-sm font-600 justify-center transition-all hover:opacity-90"
                style={{ background: scheduled ? '#10B981' : `linear-gradient(135deg, ${accent}, ${brand?.secondaryColor ?? '#F472B6'})`, color: 'white' }}>
                {scheduled ? <><Check size={14} /> תוזמן!</> : <><Calendar size={14} /> תזמני לפוסט</>}
              </button>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-500 bg-red-50 rounded-2xl px-4 py-3">
          <AlertCircle size={14} />{error}
        </div>
      )}
    </div>
  )
}
