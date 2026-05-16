import { useState } from 'react'
import { Palette, Type, Target, Sparkles } from 'lucide-react'
import Modal from '../ui/Modal'
import type { BrandProfile } from '../../types'

interface Props {
  clientName: string
  initial?: BrandProfile
  onSave: (p: BrandProfile) => void
  onClose: () => void
}

const FONTS = ['Heebo', 'Assistant', 'Rubik', 'Frank Ruhl Libre'] as const
const TONES = [
  { value: 'professional', label: 'מקצועי' },
  { value: 'casual',       label: 'קזואל' },
  { value: 'fun',          label: 'כיפי' },
  { value: 'inspiring',    label: 'מעורר השראה' },
  { value: 'luxury',       label: 'יוקרתי' },
] as const

const DEFAULT: BrandProfile = {
  primaryColor: '#F472B6', secondaryColor: '#C084FC',
  fontHeading: 'Heebo', fontBody: 'Heebo',
  writingStyle: '', marketingMessage: '', targetAudience: '',
  tone: 'professional', keywords: [],
}

const inp = `w-full border border-gray-200 rounded-2xl px-3.5 py-2.5 text-sm
  focus:outline-none focus:ring-2 focus:ring-violet-200 bg-white transition-all`

export default function BrandSetupModal({ clientName, initial, onSave, onClose }: Props) {
  const [form, setForm] = useState<BrandProfile>(initial ?? DEFAULT)
  const [kwInput, setKwInput] = useState('')

  const set = <K extends keyof BrandProfile>(k: K, v: BrandProfile[K]) =>
    setForm(f => ({ ...f, [k]: v }))

  function addKeyword() {
    const kw = kwInput.trim()
    if (!kw || form.keywords.includes(kw)) return
    set('keywords', [...form.keywords, kw])
    setKwInput('')
  }

  return (
    <Modal title={`פרופיל מותג — ${clientName}`} onClose={onClose} width="max-w-xl">
      <div className="space-y-5" dir="rtl">

        {/* Colors */}
        <div>
          <p className="flex items-center gap-2 text-xs font-700 text-gray-500 mb-3">
            <Palette size={13} /> צבעי מותג
          </p>
          <div className="flex gap-4">
            <label className="flex-1">
              <span className="text-xs text-gray-500 block mb-1.5">ראשי</span>
              <div className="flex items-center gap-2">
                <input type="color" value={form.primaryColor}
                  onChange={e => set('primaryColor', e.target.value)}
                  className="w-10 h-10 rounded-xl border border-gray-200 cursor-pointer p-0.5" />
                <input value={form.primaryColor}
                  onChange={e => set('primaryColor', e.target.value)}
                  className={`${inp} flex-1 font-mono text-xs`} />
              </div>
            </label>
            <label className="flex-1">
              <span className="text-xs text-gray-500 block mb-1.5">משני</span>
              <div className="flex items-center gap-2">
                <input type="color" value={form.secondaryColor}
                  onChange={e => set('secondaryColor', e.target.value)}
                  className="w-10 h-10 rounded-xl border border-gray-200 cursor-pointer p-0.5" />
                <input value={form.secondaryColor}
                  onChange={e => set('secondaryColor', e.target.value)}
                  className={`${inp} flex-1 font-mono text-xs`} />
              </div>
            </label>
          </div>
          {/* Preview */}
          <div className="h-8 rounded-2xl mt-2 transition-all"
            style={{ background: `linear-gradient(135deg, ${form.primaryColor}, ${form.secondaryColor})` }} />
        </div>

        {/* Fonts */}
        <div>
          <p className="flex items-center gap-2 text-xs font-700 text-gray-500 mb-3">
            <Type size={13} /> פונטים
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className="text-xs text-gray-500 block mb-1.5">כותרות</span>
              <select value={form.fontHeading} onChange={e => set('fontHeading', e.target.value as BrandProfile['fontHeading'])} className={inp}>
                {FONTS.map(f => <option key={f} value={f} style={{ fontFamily: f }}>{f}</option>)}
              </select>
            </div>
            <div>
              <span className="text-xs text-gray-500 block mb-1.5">גוף טקסט</span>
              <select value={form.fontBody} onChange={e => set('fontBody', e.target.value as BrandProfile['fontBody'])} className={inp}>
                {FONTS.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
          </div>
          <p className="text-lg mt-2 text-gray-700" style={{ fontFamily: form.fontHeading }}>
            כותרת לדוגמה — {clientName}
          </p>
        </div>

        {/* Tone */}
        <div>
          <p className="flex items-center gap-2 text-xs font-700 text-gray-500 mb-3">
            <Sparkles size={13} /> טון ודיבור
          </p>
          <div className="flex flex-wrap gap-2">
            {TONES.map(t => (
              <button key={t.value} type="button"
                onClick={() => set('tone', t.value)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-600 border transition-all ${
                  form.tone === t.value
                    ? 'text-white border-transparent'
                    : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
                }`}
                style={form.tone === t.value
                  ? { background: `linear-gradient(135deg, ${form.primaryColor}, ${form.secondaryColor})` }
                  : {}}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Text fields */}
        <div>
          <p className="flex items-center gap-2 text-xs font-700 text-gray-500 mb-3">
            <Target size={13} /> זהות שיווקית
          </p>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-500 block mb-1.5">סגנון כתיבה</label>
              <textarea value={form.writingStyle} onChange={e => set('writingStyle', e.target.value)}
                placeholder="לדוג': שפה חמה ואישית, שימוש בEmoji, משפטים קצרים..."
                rows={2} className={`${inp} resize-none`} />
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1.5">מסר שיווקי מרכזי</label>
              <textarea value={form.marketingMessage} onChange={e => set('marketingMessage', e.target.value)}
                placeholder="לדוג': עזרה לנשים לבנות עסק מצליח מהבית..."
                rows={2} className={`${inp} resize-none`} />
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1.5">קהל יעד</label>
              <input value={form.targetAudience} onChange={e => set('targetAudience', e.target.value)}
                placeholder="לדוג': נשים 25-45, יזמיות, אוהבות אופנה..." className={inp} />
            </div>
          </div>
        </div>

        {/* Keywords */}
        <div>
          <label className="text-xs font-700 text-gray-500 block mb-2">מילות מפתח</label>
          <div className="flex gap-2 mb-2">
            <input value={kwInput} onChange={e => setKwInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
              placeholder="הוסיפי מילת מפתח + Enter"
              className={`${inp} flex-1`} />
            <button type="button" onClick={addKeyword}
              className="px-4 rounded-2xl text-white text-sm font-600"
              style={{ background: `linear-gradient(135deg, ${form.primaryColor}, ${form.secondaryColor})` }}>
              +
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {form.keywords.map(kw => (
              <span key={kw} className="flex items-center gap-1.5 bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-full">
                {kw}
                <button onClick={() => set('keywords', form.keywords.filter(k => k !== kw))}
                  className="text-gray-400 hover:text-red-400 transition-colors leading-none">×</button>
              </span>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose}
            className="flex-1 py-3 rounded-2xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50">
            ביטול
          </button>
          <button type="button" onClick={() => { onSave(form); onClose() }}
            className="flex-1 py-3 rounded-2xl text-white text-sm font-600 transition-all hover:opacity-90"
            style={{ background: `linear-gradient(135deg, ${form.primaryColor}, ${form.secondaryColor})` }}>
            שמור פרופיל מותג ✨
          </button>
        </div>
      </div>
    </Modal>
  )
}
