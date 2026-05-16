import { useState } from 'react'
import { Plus, Search, Users } from 'lucide-react'
import { useClients } from '../store/ClientsContext'
import ClientCard from '../components/clients/ClientCard'
import AddClientModal from '../components/clients/AddClientModal'
import type { ClientDetail } from '../types'

type Filter = 'all' | ClientDetail['status']

const filters: { value: Filter; label: string }[] = [
  { value: 'all',      label: 'הכל' },
  { value: 'active',   label: 'פעיל' },
  { value: 'pending',  label: 'ממתין' },
  { value: 'paused',   label: 'בהשהיה' },
  { value: 'rejected', label: 'נדחה' },
]

export default function ClientsPage() {
  const { clients } = useClients()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<Filter>('all')
  const [showAdd, setShowAdd] = useState(false)

  const filtered = clients.filter(c => {
    const matchFilter = filter === 'all' || c.status === filter
    const matchSearch = c.name.includes(search) || c.platform.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-600 text-gray-800">לקוחות</h2>
          <p className="text-sm text-gray-400 mt-0.5">{clients.length} לקוחות בסה"כ</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 text-white text-sm font-500 px-5 py-2.5 rounded-2xl transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5"
          style={{ backgroundColor: '#F472B6' }}
        >
          <Plus size={16} />
          לקוח חדש
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search size={14} className="absolute top-1/2 -translate-y-1/2 right-4 text-gray-400" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="חפשי לקוח לפי שם או פלטפורמה..."
          className="w-full bg-white border border-gray-100 rounded-2xl pr-10 pl-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-dusty-pink placeholder-gray-300"
          style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
        />
      </div>

      {/* Filter pills */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1 scrollbar-hide">
        {filters.map(f => {
          const count = f.value === 'all' ? clients.length : clients.filter(c => c.status === f.value).length
          const active = filter === f.value
          return (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 ${
                active
                  ? 'text-white shadow-sm'
                  : 'bg-white text-gray-500 border border-gray-100 hover:border-dusty-pink'
              }`}
              style={active ? { backgroundColor: '#F472B6' } : {}}
            >
              {f.label}
              <span className={`text-[10px] rounded-full px-1.5 py-0.5 font-600 ${
                active ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
              }`}>
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <Users size={40} className="mx-auto mb-3 opacity-20" />
          <p className="text-sm">לא נמצאו לקוחות</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map((client, i) => (
            <ClientCard key={client.id} client={client} index={i} />
          ))}
        </div>
      )}

      {showAdd && <AddClientModal onClose={() => setShowAdd(false)} />}
    </div>
  )
}
