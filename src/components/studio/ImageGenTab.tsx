import { useState, useRef } from 'react'
import { Wand2, Download, Upload, X, AlertCircle, Sparkles } from 'lucide-react'
import { generateImage } from '../../lib/huggingface'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../store/AuthContext'
import type { ClientDetail } from '../../types'

const STYLE_PRESETS = [
  { label: 'צילום מקצועי', suffix: 'professional studio photography, high quality, realistic' },
  { label: 'מינימליסטי',   suffix: 'minimalist, clean white background, product shot' },
  { label: 'ויב חמים',     suffix: 'warm tones, golden hour, lifestyle photography' },
  { label: 'דוגמנית AI',   suffix: 'professional model, fashion shoot, editorial style' },
  { label: 'אמנותי',       suffix: 'artistic, creative composition, vibrant colors' },
]

interface Props { client: ClientDetail }

export default function ImageGenTab({ client }: Props) {
  const { user }   = useAuth()
  const brand      = client.brandProfile
  const accent     = brand?.primaryColor ?? '#C084FC'

  const [prompt, setPrompt]       = useState('')
  const [style, setStyle]         = useState(STYLE_PRESETS[0])
  const [imageUrl, setImageUrl]   = useState<string | null>(null)
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState('')
  const [saving, setSaving]       = useState(false)
  const [saved, setSaved]         = useState(false)
  const [productFile, setProductFile]     = useState<File | null>(null)
  const [productPreview, setProductPreview] = useState<string>('')
  const productRef = useRef<HTMLInputElement>(null)
  const hasKey = !!import.meta.env.VITE_HF_TOKEN

  function handleProductFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setProductFile(file)
    setProductPreview(URL.createObjectURL(file))
  }

  async function generate() {
    setLoading(true)
    setError('')
    setImageUrl(null)
    setSaved(false)

    const brandCtx = brand
      ? `Brand colors: ${brand.primaryColor} and ${brand.secondaryColor}. Style: ${brand.tone}.`
      : ''
    const productCtx = productFile ? `Product integration with uploaded product image. ` : ''
    const fullPrompt = `${prompt || `content for ${client.name} on ${client.platform}`}. ${productCtx}${brandCtx} ${style.suffix}`

    try {
      const url = await generateImage(fullPrompt)
      setImageUrl(url)
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'שגיאה ביצירת תמונה'
      if (msg.includes('loading')) setError('המודל בטעינה (30 שניות) — נסי שוב')
      else setError(msg)
    } finally {
      setLoading(false)
    }
  }

  async function saveToClient() {
    if (!imageUrl || !user) return
    setSaving(true)
    try {
      const res   = await fetch(imageUrl)
      const blob  = await res.blob()
      const path  = `${user.id}/${client.id}/ai-${Date.now()}.jpg`
      const { error: upErr } = await supabase.storage.from('post-media').upload(path, blob, { contentType: 'image/jpeg' })
      if (!upErr) setSaved(true)
    } catch {
      // silent
    } finally {
      setSaving(false)
    }
  }

  function download() {
    if (!imageUrl) return
    const a = document.createElement('a')
    a.href = imageUrl
    a.download = `${client.name}-ai-${Date.now()}.jpg`
    a.click()
  }

  return (
    <div className="space-y-4" dir="rtl">

      {!hasKey && (
        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 text-sm text-amber-700">
          <AlertCircle size={14} />
          הוסיפי <code className="bg-amber-100 px-1">VITE_HF_TOKEN</code> ב-<code className="bg-amber-100 px-1">.env.local</code>
          {' '}(חינמי ב-<a href="https://huggingface.co/settings/tokens" target="_blank" rel="noopener noreferrer" className="underline">huggingface.co</a>)
        </div>
      )}

      {/* Product upload */}
      <div>
        <p className="text-xs font-600 text-gray-500 mb-2">העלאת מוצר לשילוב בתמונה (אופציונלי)</p>
        {productPreview ? (
          <div className="relative inline-block">
            <img src={productPreview} alt="product" className="h-24 rounded-2xl object-contain border border-gray-200 bg-gray-50" />
            <button onClick={() => { setProductFile(null); setProductPreview('') }}
              className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full shadow flex items-center justify-center">
              <X size={12} className="text-gray-500" />
            </button>
          </div>
        ) : (
          <button onClick={() => productRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-gray-200 rounded-2xl text-sm text-gray-400 hover:border-violet-300 hover:text-violet-500 transition-all">
            <Upload size={14} /> העלי תמונת מוצר
          </button>
        )}
        <input ref={productRef} type="file" accept="image/*" onChange={handleProductFile} className="hidden" />
      </div>

      {/* Style presets */}
      <div>
        <p className="text-xs font-600 text-gray-500 mb-2">סגנון תמונה</p>
        <div className="flex flex-wrap gap-2">
          {STYLE_PRESETS.map(s => (
            <button key={s.label} onClick={() => setStyle(s)}
              className={`px-3.5 py-1.5 rounded-2xl text-xs font-600 border transition-all ${
                style.label === s.label ? 'text-white border-transparent' : 'bg-white border-gray-200 text-gray-500'
              }`}
              style={style.label === s.label ? { background: `linear-gradient(135deg, ${accent}, ${brand?.secondaryColor ?? '#F472B6'})` } : {}}>
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Prompt */}
      <div>
        <label className="text-xs font-600 text-gray-500 block mb-1.5">תיאור התמונה הרצויה</label>
        <textarea
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          rows={3}
          placeholder={`לדוג': Woman holding coffee mug, morning lifestyle, cozy home setting — עבור ${client.name}`}
          className="w-full border border-gray-200 rounded-2xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 resize-none bg-white"
        />
        <p className="text-[10px] text-gray-400 mt-1">
          <Sparkles size={10} className="inline ml-1" />
          כתבי בעברית — המערכת מתרגמת לאנגלית אוטומטית
        </p>
      </div>

      {/* Generate */}
      <button onClick={generate} disabled={loading || !hasKey}
        className="w-full py-3.5 rounded-2xl text-white text-sm font-600 flex items-center justify-center gap-2 disabled:opacity-50 transition-all hover:opacity-90"
        style={{ background: `linear-gradient(135deg, ${accent}, ${brand?.secondaryColor ?? '#F472B6'})` }}>
        <Wand2 size={16} />
        {loading ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            יוצרת תמונה... (עד 30 שניות)
          </span>
        ) : 'צרי תמונה AI'}
      </button>

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-500 bg-red-50 rounded-2xl px-4 py-3">
          <AlertCircle size={14} />{error}
        </div>
      )}

      {/* Result */}
      {imageUrl && (
        <div className="space-y-3">
          <img src={imageUrl} alt="generated" className="w-full rounded-3xl object-cover" />
          <div className="flex gap-2">
            <button onClick={download}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-2xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
              <Download size={14} /> הורידי
            </button>
            <button onClick={saveToClient} disabled={saving || saved}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-2xl text-sm text-white font-600 transition-all hover:opacity-90 disabled:opacity-60"
              style={{ background: saved ? '#10B981' : `linear-gradient(135deg, ${accent}, ${brand?.secondaryColor ?? '#F472B6'})` }}>
              {saved ? '✓ נשמר!' : saving ? 'שומרת...' : 'שמרי לחומרי הלקוח'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
