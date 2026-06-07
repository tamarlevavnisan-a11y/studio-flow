import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { CheckCircle, AlertCircle } from 'lucide-react'
import { useInstagram } from '../store/InstagramContext'
import { instagramRedirectUri } from '../lib/meta'

// Lands here after the user completes the Facebook Login dialog.
// `code` is the OAuth authorization code, `state` carries the clientId we
// passed in when opening the dialog (see lib/meta.ts → instagramLoginUrl).
export default function InstagramCallbackPage() {
  const [params]  = useSearchParams()
  const navigate  = useNavigate()
  const { saveConnection } = useInstagram()
  const [status, setStatus] = useState<'working' | 'error' | 'done'>('working')
  const [error, setError]   = useState('')
  const ran = useRef(false)

  useEffect(() => {
    if (ran.current) return
    ran.current = true

    async function run() {
      const code       = params.get('code')
      const clientId   = params.get('state')
      const oauthError = params.get('error_description') || params.get('error')

      if (oauthError) { setStatus('error'); setError(oauthError); return }
      if (!code || !clientId) { setStatus('error'); setError('חסרים פרטים בתגובה מפייסבוק'); return }

      try {
        const res = await fetch('/api/instagram-oauth', {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({ code, redirectUri: instagramRedirectUri() }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data?.error || 'החיבור נכשל')

        await saveConnection(clientId, {
          igUserId:    data.igUserId,
          igUsername:  data.igUsername,
          pageId:      data.pageId,
          accessToken: data.accessToken,
          expiresAt:   data.expiresAt,
        })

        setStatus('done')
        setTimeout(() => navigate(`/clients/${clientId}`, { replace: true }), 1200)
      } catch (err) {
        setStatus('error')
        setError(err instanceof Error ? err.message : 'אירעה שגיאה לא צפויה')
      }
    }

    run()
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center"
      style={{ background: 'linear-gradient(135deg, #EDE9FF 0%, #FDF2F8 50%, #FFF9F0 100%)' }}>
      <div className="bg-white rounded-[24px] p-8 max-w-sm w-full text-center" style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}>
        {status === 'working' && (
          <>
            <div className="w-10 h-10 mx-auto rounded-2xl animate-pulse mb-4"
              style={{ background: 'linear-gradient(135deg, #C4B5FD, #F9A8D4)' }} />
            <p className="text-sm text-gray-500">מתחבר לאינסטגרם...</p>
          </>
        )}
        {status === 'done' && (
          <>
            <CheckCircle size={36} className="mx-auto text-teal-500 mb-3" />
            <p className="text-sm font-600 text-gray-700">החיבור הושלם בהצלחה!</p>
            <p className="text-xs text-gray-400 mt-1">מעביר אותך חזרה לעמוד הלקוח...</p>
          </>
        )}
        {status === 'error' && (
          <>
            <AlertCircle size={36} className="mx-auto text-red-500 mb-3" />
            <p className="text-sm font-600 text-gray-700">החיבור נכשל</p>
            <p className="text-xs text-gray-400 mt-1.5">{error}</p>
            <button
              onClick={() => navigate('/clients')}
              className="mt-4 text-xs text-violet-500 hover:underline"
            >
              חזרה לרשימת הלקוחות
            </button>
          </>
        )}
      </div>
    </div>
  )
}
