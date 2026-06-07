import { useState } from 'react'
import { Camera, X, AlertCircle } from 'lucide-react'
import { useInstagram } from '../../../store/InstagramContext'
import { instagramLoginUrl, META_APP_ID } from '../../../lib/meta'

interface Props {
  clientId: string
  compact?: boolean
}

export default function InstagramConnectButton({ clientId, compact = false }: Props) {
  const { getConnection, disconnectClient } = useInstagram()
  const [disconnecting, setDisconnecting] = useState(false)
  const connection = getConnection(clientId)

  // Connected
  if (connection) {
    return (
      <div className="flex items-center gap-2 text-xs">
        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-green-50 text-green-600 font-600 border border-green-100">
          <Camera size={13} /> @{connection.igUsername}
        </span>
        <button
          onClick={async () => { setDisconnecting(true); await disconnectClient(clientId); setDisconnecting(false) }}
          disabled={disconnecting}
          className="text-gray-300 hover:text-red-400 transition-colors p-1.5 rounded-xl hover:bg-red-50"
          title="נתק"
        >
          <X size={13} />
        </button>
      </div>
    )
  }

  // Not configured
  if (!META_APP_ID) {
    return (
      <div className="flex items-center gap-1.5 text-xs text-amber-600 bg-amber-50 px-3 py-1.5 rounded-2xl border border-amber-100">
        <AlertCircle size={12} />
        {compact ? 'לא מוגדר' : 'VITE_META_APP_ID חסר ב-.env.local'}
      </div>
    )
  }

  // Ready to connect
  return (
    <a
      href={instagramLoginUrl(clientId)}
      className="flex items-center gap-1.5 text-xs font-600 px-3 py-1.5 rounded-2xl text-white transition-opacity hover:opacity-90 whitespace-nowrap"
      style={{ background: 'linear-gradient(135deg, #F472B6, #C084FC)' }}
    >
      <Camera size={13} />
      {compact ? 'התחבר' : 'חבר חשבון Instagram'}
    </a>
  )
}
