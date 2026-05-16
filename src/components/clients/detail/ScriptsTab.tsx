import { useState } from 'react'
import { Plus, ChevronDown, ChevronUp, Trash2, Edit3, Check } from 'lucide-react'
import Modal from '../../ui/Modal'
import { useClients } from '../../../store/ClientsContext'
import type { Script } from '../../../types'

const statusConfig: Record<Script['status'], { label: string; cls: string }> = {
  draft: { label: 'טיוטה', cls: 'bg-gray-100 text-gray-500' },
  ready: { label: 'מוכן', cls: 'bg-emerald-100 text-emerald-700' },
  sent:  { label: 'נשלח', cls: 'bg-violet-100 text-violet-700' },
}

const typeLabel: Record<Script['type'], string> = {
  caption: 'קפשן',
  script: 'תסריט',
  story: 'סטורי',
}

const platforms = ['Instagram', 'TikTok', 'Facebook', 'YouTube', 'LinkedIn']

interface Props {
  clientId: string
  scripts: Script[]
}

function AddScriptModal({ clientId, onClose }: { clientId: string; onClose: () => void }) {
  const { addScript } = useClients()
  const [form, setForm] = useState({ title: '', platform: 'Instagram', type: 'caption' as Script['type'], content: '' })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title.trim() || !form.content.trim()) return
    addScript(clientId, { ...form, status: 'draft' })
    onClose()
  }

  return (
    <Modal title="תסריט חדש" onClose={onClose} width="max-w-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">כותרת</label>
          <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="שם התסריט" required className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">פלטפורמה</label>
            <select value={form.platform} onChange={e => setForm(f => ({ ...f, platform: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 bg-white">
              {platforms.map(p => <option key={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">סוג</label>
            <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as Script['type'] }))} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 bg-white">
              <option value="caption">קפשן</option>
              <option value="script">תסריט</option>
              <option value="story">סטורי</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">תוכן</label>
          <textarea value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} placeholder="כתבי את התסריט כאן..." rows={6} required className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 resize-none" />
        </div>
        <div className="flex gap-3">
          <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors">ביטול</button>
          <button type="submit" className="flex-1 py-2.5 rounded-xl bg-pink-500 text-white text-sm font-medium hover:bg-pink-600 transition-colors">שמור תסריט</button>
        </div>
      </form>
    </Modal>
  )
}

function ScriptRow({ script, clientId }: { script: Script; clientId: string }) {
  const { updateScript, deleteScript } = useClients()
  const [expanded, setExpanded] = useState(false)
  const sc = statusConfig[script.status]

  const nextStatus: Record<Script['status'], Script['status']> = { draft: 'ready', ready: 'sent', sent: 'draft' }

  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden">
      <div className="flex items-center gap-3 p-3 bg-white">
        <button onClick={() => setExpanded(e => !e)} className="flex-1 flex items-center gap-3 text-right min-w-0">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-800 truncate">{script.title}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs text-gray-400">{typeLabel[script.type]}</span>
              <span className="text-gray-200">·</span>
              <span className="text-xs text-gray-400">{script.platform}</span>
            </div>
          </div>
          {expanded ? <ChevronUp size={14} className="text-gray-400 flex-shrink-0" /> : <ChevronDown size={14} className="text-gray-400 flex-shrink-0" />}
        </button>
        <button
          onClick={() => updateScript(clientId, script.id, { status: nextStatus[script.status] })}
          className={`text-xs font-medium px-2.5 py-1 rounded-full transition-colors cursor-pointer ${sc.cls}`}
        >
          {sc.label}
        </button>
        <button onClick={() => deleteScript(clientId, script.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-300 hover:text-red-400 transition-colors">
          <Trash2 size={14} />
        </button>
      </div>
      {expanded && (
        <div className="px-4 pb-4 pt-1 bg-gray-50 border-t border-gray-100">
          <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">{script.content}</pre>
          <button
            onClick={() => {
              navigator.clipboard.writeText(script.content)
            }}
            className="mt-3 flex items-center gap-1.5 text-xs text-violet-500 hover:text-violet-700 transition-colors"
          >
            <Check size={12} /> העתק תוכן
          </button>
        </div>
      )}
    </div>
  )
}

export default function ScriptsTab({ clientId, scripts }: Props) {
  const [showAdd, setShowAdd] = useState(false)

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500">{scripts.length} תסריטים</p>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 bg-pink-500 text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-pink-600 transition-colors"
        >
          <Plus size={15} />
          תסריט חדש
        </button>
      </div>

      {scripts.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <Edit3 size={32} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">אין תסריטים עדיין</p>
          <p className="text-xs mt-1">לחצי על "תסריט חדש" להתחיל</p>
        </div>
      ) : (
        <div className="space-y-2">
          {scripts.map(s => <ScriptRow key={s.id} script={s} clientId={clientId} />)}
        </div>
      )}

      {showAdd && <AddScriptModal clientId={clientId} onClose={() => setShowAdd(false)} />}
    </div>
  )
}
