import { useState } from 'react'
import { Wand2, Copy, Check, Calendar, AlertCircle } from 'lucide-react'
import { anthropic, buildSystemPrompt } from '../../lib/anthropic'
import { usePosts } from '../../store/PostsContext'
import type { ClientDetail, PostContentType, PostPlatform } from '../../types'

const CONTENT_TYPES = [
  { type: 'post',    label: 'פוסט',      prompt: 'כתבי קפשן מרתק לפוסט אינסטגרם' },
  { type: 'reel',   label: 'ריל',       prompt: 'כתבי תסריט מלא לריל של 30 שניות' },
  { type: 'story',  label: 'סטורי',     prompt: 'כתבי טקסט לסדרת סטוריז (3 סלייידים)' },
  { type: 'carousel', label: 'קרוסלה', prompt: 'כתבי תוכן ל-5 שקפי קרוסלה' },
] as const

const PLATFORMS: { value: PostPlatform; label: string }[] = [
  { value: 'Instagram', label: '📸 Instagram' },
  { value: 'TikTok',    label: '🎵 TikTok' },
  { value: 'Facebook',  label: '📘 Facebook' },
]

interface Props { client: ClientDetail }

export default function TextGenTab({ client }: Props) {
  const { addPost } = usePosts()
  const [contentType, setContentType] = useState<PostContentType>('post')
  const [platform, setPlatform] = useState<PostPlatform>(
    (PLATFORMS.find(p => p.value === client.platform)?.value) ?? 'Instagram'
  )
  const [topic, setTopic]     = useState('')
  const [result, setResult]   = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied]   = useState(false)
  const [error, setError]     = useState('')
  const [scheduled, setScheduled] = useState(false)
  const hasKey = !!import.meta.env.VITE_ANTHROPIC_KEY

  const brand  = client.brandProfile
  const accent = brand?.primaryColor ?? '#C084FC'
  const system = buildSystemPrompt(client.name, platform, brand)

  async function generate() {
    if (!anthropic) return
    setLoading(true)
    setResult('')
    setError('')
    setScheduled(false)

    const typeEntry = CONTENT_TYPES.find(t => t.type === contentType)!
    const userPrompt = `${typeEntry.prompt} עבור ${client.name} בנושא: ${topic || 'תוכן כללי מותאם למותג'}.
${brand?.keywords?.length ? `השתמשי במילות מפתח: ${brand.keywords.join(', ')}` : ''}
הוסיפי האשטגים רלוונטיים בסוף.`

    try {
      const stream = await anthropic.messages.stream({
        model: 'claude-opus-4-5',
        max_tokens: 1024,
        system,
        messages: [{ role: 'user', content: userPrompt }],
      })
      for await (const chunk of stream) {
        if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
          setResult(r => r + chunk.delta.text)
        }
      }
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
    const today = new Date()
    const tmr = new Date(today)
    tmr.setDate(today.getDate() + 1)
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

      {!hasKey && (
        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 text-sm text-amber-700">
          <AlertCircle size={14} />
          הוסיפי <code className="bg-amber-100 px-1">VITE_ANTHROPIC_KEY</code> ב-<code className="bg-amber-100 px-1">.env.local</code>
        </div>
      )}

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

      {/* Generate button */}
      <button onClick={generate} disabled={loading || !hasKey}
        className="w-full py-3 rounded-2xl text-white text-sm font-600 flex items-center justify-center gap-2 disabled:opacity-50 transition-all hover:opacity-90"
        style={{ background: `linear-gradient(135deg, ${accent}, ${brand?.secondaryColor ?? '#F472B6'})` }}>
        <Wand2 size={16} />
        {loading ? 'יוצרת...' : `צרי ${CONTENT_TYPES.find(t => t.type === contentType)?.label}`}
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
