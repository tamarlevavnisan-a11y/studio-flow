import { useState, useRef, useEffect } from 'react'
import { Send, Copy, Check, AlertCircle } from 'lucide-react'
import { streamChat, buildSystemPrompt } from '../../lib/anthropic'
import type { ClientDetail } from '../../types'

interface Msg { role: 'user' | 'assistant'; content: string }

const QUICK_PROMPTS = [
  'תני לי 5 רעיונות לפוסטים לשבוע הבא',
  'כתבי לי קפשן מושך לפוסט על מוצר חדש',
  'תני לי תסריט לריל של 30 שניות',
  'תצעי אסטרטגיית תוכן לחודש הבא',
  'מה הטרנדים הכי חמים עכשיו?',
]

interface Props { client: ClientDetail }

export default function ChatTab({ client }: Props) {
  const [messages, setMessages] = useState<Msg[]>([])
  const [input, setInput]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [copied, setCopied]     = useState<number | null>(null)
  const [error, setError]       = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)
  const hasKey = !!import.meta.env.VITE_ANTHROPIC_KEY

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const system = buildSystemPrompt(client.name, client.platform, client.brandProfile)

  async function send(text: string) {
    if (!text.trim() || loading) return
    setError('')
    const userMsg: Msg = { role: 'user', content: text }
    const newMsgs = [...messages, userMsg]
    setMessages(newMsgs)
    setInput('')
    setLoading(true)

    const assistantMsg: Msg = { role: 'assistant', content: '' }
    setMessages(m => [...m, assistantMsg])

    try {
      await streamChat(newMsgs, system, (chunk) => {
        setMessages(m => {
          const updated = [...m]
          updated[updated.length - 1] = {
            ...updated[updated.length - 1],
            content: updated[updated.length - 1].content + chunk,
          }
          return updated
        })
      })
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'שגיאה בחיבור ל-Claude')
      setMessages(m => m.slice(0, -1))
    } finally {
      setLoading(false)
    }
  }

  async function copyMsg(i: number) {
    await navigator.clipboard.writeText(messages[i].content)
    setCopied(i)
    setTimeout(() => setCopied(null), 1500)
  }

  const brand = client.brandProfile
  const accent = brand?.primaryColor ?? '#C084FC'

  return (
    <div className="flex flex-col h-[600px]">

      {!hasKey && (
        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 mb-4 text-sm text-amber-700">
          <AlertCircle size={15} className="flex-shrink-0" />
          הוסיפי את המפתח <code className="bg-amber-100 px-1.5 rounded">VITE_ANTHROPIC_KEY</code> בקובץ <code className="bg-amber-100 px-1.5 rounded">.env.local</code>
        </div>
      )}

      {/* Quick prompts */}
      {messages.length === 0 && (
        <div className="mb-4" dir="rtl">
          <p className="text-xs font-600 text-gray-400 mb-2">התחלה מהירה:</p>
          <div className="flex flex-wrap gap-2">
            {QUICK_PROMPTS.map(p => (
              <button key={p} onClick={() => send(p)}
                className="text-xs px-3.5 py-2 rounded-2xl bg-white border border-gray-200 text-gray-600 hover:border-violet-300 hover:text-violet-700 transition-all">
                {p}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1" dir="rtl">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}>
            <div className={`relative group max-w-[85%] rounded-3xl px-4 py-3 text-sm leading-relaxed ${
              msg.role === 'user'
                ? 'bg-gray-100 text-gray-800 rounded-tr-sm'
                : 'text-white rounded-tl-sm'
            }`}
              style={msg.role === 'assistant' ? { background: `linear-gradient(135deg, ${accent}DD, ${brand?.secondaryColor ?? '#F472B6'}DD)` } : {}}>
              <pre className="whitespace-pre-wrap font-sans">{msg.content || (loading && i === messages.length - 1 ? '...' : '')}</pre>
              {msg.role === 'assistant' && msg.content && (
                <button onClick={() => copyMsg(i)}
                  className="absolute -top-2 -left-2 opacity-0 group-hover:opacity-100 w-7 h-7 rounded-full bg-white shadow flex items-center justify-center transition-all">
                  {copied === i ? <Check size={12} className="text-green-500" /> : <Copy size={12} className="text-gray-400" />}
                </button>
              )}
            </div>
          </div>
        ))}
        {error && (
          <div className="flex items-center gap-2 text-sm text-red-500 bg-red-50 rounded-2xl px-4 py-3">
            <AlertCircle size={14} />{error}
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex gap-3 mt-4" dir="rtl">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), send(input))}
          placeholder={`שאלי כל דבר על תוכן של ${client.name}...`}
          disabled={loading || !hasKey}
          className="flex-1 border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 disabled:opacity-50 bg-white"
        />
        <button onClick={() => send(input)} disabled={loading || !input.trim() || !hasKey}
          className="w-11 h-11 rounded-2xl flex items-center justify-center text-white disabled:opacity-40 transition-all hover:opacity-90 flex-shrink-0"
          style={{ background: `linear-gradient(135deg, ${accent}, ${brand?.secondaryColor ?? '#F472B6'})` }}>
          <Send size={16} />
        </button>
      </div>
    </div>
  )
}
