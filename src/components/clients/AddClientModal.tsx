import { useState } from 'react'
import Modal from '../ui/Modal'
import { useClients } from '../../store/ClientsContext'

interface Props { onClose: () => void }

const platforms = ['Instagram', 'TikTok', 'Facebook', 'YouTube', 'LinkedIn']

const inputCls = 'w-full border border-gray-100 rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-dusty-pink bg-gray-50 placeholder-gray-300'

export default function AddClientModal({ onClose }: Props) {
  const { addClient } = useClients()
  const [form, setForm] = useState({ name: '', platform: 'Instagram', email: '', phone: '', notes: '' })
  const set = (field: string, value: string) => setForm(f => ({ ...f, [field]: value }))

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim()) return
    addClient({
      name: form.name.trim(),
      platform: form.platform,
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
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">שם הלקוח *</label>
          <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="שם מלא" required className={inputCls} />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">פלטפורמה ראשית</label>
          <select value={form.platform} onChange={e => set('platform', e.target.value)} className={inputCls}>
            {platforms.map(p => <option key={p}>{p}</option>)}
          </select>
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
