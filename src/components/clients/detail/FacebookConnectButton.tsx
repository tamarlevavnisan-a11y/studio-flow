import { useState } from 'react'
import { ThumbsUp, X, AlertCircle } from 'lucide-react'
import { useInstagram } from '../../../store/InstagramContext'
import { instagramLoginUrl, META_APP_ID } from '../../../lib/meta'

// Facebook Pages connect through the exact same Meta (Facebook Login) OAuth
// flow used for Instagram — a Business Instagram account can only be reached
// via a linked Facebook Page, so once that flow completes we already hold the
// Page ID + a Page access token. This button simply reflects/operates on that
// same shared connection record instead of duplicating the OAuth dance.
interface Props {
  clientId: string
  compact?: boolean
}

export default function FacebookConnectButton({ clientId, compact = false }: Props) {
  const { getConnection, disconnectClient } = useInstagram()
  const [disconnecting, setDisconnecting] = useState(false)
  const connection = getConnection(clientId)

  // Connected — the linked Facebook Page came along with the Instagram connection
  if (connection) {
    return (
      <div className="flex items-center gap-2 text-xs">
        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-green-50 text-green-600 font-600 border border-green-100">
          <ThumbsUp size={13} /> עמוד מקושר
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

  // Ready to connect — same Facebook Login dialog as the Instagram button.
  // Granting access to the Page automatically links it here too.
  return (
    <a
      href={instagramLoginUrl(clientId)}
      className="flex items-center gap-1.5 text-xs font-600 px-3 py-1.5 rounded-2xl text-white transition-opacity hover:opacity-90 whitespace-nowrap"
      style={{ background: 'linear-gradient(135deg, #2563EB, #1D4ED8)' }}
    >
      <ThumbsUp size={13} />
      {compact ? 'התחבר' : 'חבר דף Facebook'}
    </a>
  )
}
