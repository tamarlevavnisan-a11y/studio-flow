import { useState } from 'react'
import Modal from '../ui/Modal'
import { useClients } from '../../store/ClientsContext'

interface Props { onClose: () => void }

const PLATFORM_OPTIONS = [
  { id: 'Instagram', label: 'Instagram', emoji: '📸', color: 'from-pink-500 to-purple-600' },
  { id: 'TikTok',    label: 'TikTok',    emoji: '🎵', color: 'from-gray-900 to-gray-700'   },
  { id: 'Facebook',  label: 'Facebook',  emoji: '📘', color: 'from-blue-600 to-blue-700'   },
  { id: 'YouTube',   label: 'YouTube',   emoji: '▶️', color: 'from-red-500 to-red-600'     },
  { id: 'LinkedIn',  label: 'LinkedIn',  emoji: '💼', color: 'from-sky-600 to-sky-700'     },
]

const inputCls = 'w-full border border-gray-100 rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-dusty-pink bg-gray-50 placeholder-gray-300'

export default function AddClientModal({ onClose }: Props) {
  const { addClient } = useClients()
  const [form, setForm] = useState({ name: '', email: '', phone: '', notes: '' })
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['Instagram'])
  const set = (field: string, value: string) => setForm(f => ({ ...f, [field]: value }))

  function togglePlatform(id: string) {
    setSelectedPlatforms(prev =>
      prev.includes(id)
        ? prev.length > 1 ? prev.filter(p => p !== id) : prev  // keep at least one
        : [...prev, id]
    )
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim()) return
    addClient({
      name: form.name.trim(),
      platform: selectedPlatforms[0], // primary
      status: 'pending',
      avatar: form.name.trim()[0],
      email: form.email || undefined,
      phone: form.phone || undefined,
      notes: form.notes || undefined,
    })
    onClose()
  }

  return (
    <Modal title="לקוח חדש" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4" dir="rtl">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">שם הלקוח *</label>
          <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="שם מלא" required className={inputCls} />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-2">פלטפורמות פעילות</label>
          <div className="flex flex-wrap gap-2">
            {PLATFORM_OPTIONS.map(p => {
              const active = selectedPlatforms.includes(p.id)
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => togglePlatform(p.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-600 border transition-all ${
                    active
                      ? 'text-white border-transparent shadow-sm bg-gradient-to-r ' + p.color
                      : 'bg-gray-50 border-gray-100 text-gray-500 hover:border-gray-200'
                  }`}
                >
                  <span>{p.emoji}</span>
                  <span>{p.label}</span>
                </button>
              )
            })}
          </div>
          <p className="text-[10px] text-gray-400 mt-1.5">
            הפלטפורמה הראשונה שנבחרה היא הראשית · אפשר לבחור כמה שרוצים
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">אימייל</label>
            <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="email@example.com" className={inputCls} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">טלפון</label>
            <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="050-0000000" className={inputCls} />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">הערות</label>
          <textarea value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="מידע נוסף, קהל יעד, סגנון..." rows={3} className={`${inputCls} resize-none`} />
        </div>
        <div className="flex gap-3 pt-1">
          <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-2xl border border-gray-100 text-sm text-gray-500 hover:bg-gray-50 transition-colors">ביטול</button>
          <button type="submit" className="flex-1 py-2.5 rounded-2xl text-white text-sm font-500 transition-all hover:opacity-90" style={{ backgroundColor: '#F472B6' }}>
            הוסף לקוח
          </button>
        </div>
      </form>
    </Modal>
  )
}
