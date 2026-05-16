import { Users, Check, X } from 'lucide-react'
import Card from '../ui/Card'
import { useClients } from '../../store/ClientsContext'

const platformColors: Record<string, string> = {
  Instagram: 'bg-dusty-pink-light text-pink-600',
  TikTok:    'bg-lavender-light text-violet-600',
  Facebook:  'bg-indigo-100 text-indigo-600',
  YouTube:   'bg-peach-light text-orange-600',
  LinkedIn:  'bg-blue-100 text-blue-600',
}

const avatarGradients = [
  'from-lavender to-dusty-pink',
  'from-dusty-pink to-peach',
  'from-mint to-lavender',
  'from-peach to-butter',
]

export default function ClientsApprovalCard() {
  const { clients, updateClientStatus } = useClients()
  const pending = clients.filter(c => c.status === 'pending')

  return (
    <Card accent="pink" className="p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users size={15} className="text-pink-400" />
          <h3 className="text-sm font-500 text-gray-700">ממתינים לאישור</h3>
        </div>
        {pending.length > 0 && (
          <span className="text-xs font-600 bg-dusty-pink text-pink-700 w-5 h-5 rounded-full flex items-center justify-center">
            {pending.length}
          </span>
        )}
      </div>

      {pending.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-6 text-gray-400">
          <span className="text-2xl mb-2">🎉</span>
          <p className="text-xs">אין בקשות ממתינות</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {pending.slice(0, 3).map((client, i) => (
            <div key={client.id} className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${avatarGradients[i % 4]} flex items-center justify-center text-white font-600 text-sm flex-shrink-0`}>
                {client.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-500 text-gray-800 truncate leading-tight">{client.name}</p>
                <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${platformColors[client.platform] ?? 'bg-gray-100 text-gray-600'}`}>
                  {client.platform}
                </span>
              </div>
              <div className="flex gap-1 flex-shrink-0">
                <button
                  onClick={() => updateClientStatus(client.id, 'active')}
                  className="w-7 h-7 rounded-full bg-mint-light hover:bg-mint flex items-center justify-center text-emerald-600 transition-all duration-200"
                >
                  <Check size={13} />
                </button>
                <button
                  onClick={() => updateClientStatus(client.id, 'rejected')}
                  className="w-7 h-7 rounded-full bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-400 transition-all duration-200"
                >
                  <X size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
