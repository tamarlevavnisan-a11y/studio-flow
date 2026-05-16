import { useState } from 'react'
import { Sparkles, Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react'
import { useAuth } from '../store/AuthContext'

type Mode = 'login' | 'signup'

const inputCls = `
  w-full bg-white/80 border border-white/60 rounded-2xl px-4 py-3 text-sm
  text-gray-700 placeholder-gray-400 outline-none
  focus:ring-2 focus:ring-pink-300 focus:border-pink-300
  transition-all duration-200 backdrop-blur-sm
`

export default function AuthPage() {
  const { signIn, signUp } = useAuth()
  const [mode, setMode]       = useState<Mode>('login')
  const [email, setEmail]     = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPw, setShowPw]   = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [success, setSuccess] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!email || !password) { setError('יש למלא מייל וסיסמה'); return }
    if (password.length < 6)  { setError('הסיסמה חייבת להכיל לפחות 6 תווים'); return }
    if (mode === 'signup' && password !== confirm) { setError('הסיסמאות אינן תואמות'); return }

    setLoading(true)
    try {
      if (mode === 'login') {
        const { error } = await signIn(email, password)
        if (error) setError(translateError(error.message))
      } else {
        const { error, needsConfirm } = await signUp(email, password)
        if (error) {
          setError(translateError(error.message))
        } else if (needsConfirm) {
          setSuccess('נשלח אימות למייל שלך — לחצי על הקישור להמשך')
        }
      }
    } finally {
      setLoading(false)
    }
  }

  function translateError(msg: string): string {
    if (msg.includes('Invalid login')) return 'מייל או סיסמה שגויים'
    if (msg.includes('already registered')) return 'כתובת המייל כבר רשומה'
    if (msg.includes('weak password')) return 'הסיסמה חלשה מדי'
    if (msg.includes('rate limit')) return 'יותר מדי ניסיונות — נסי שוב בעוד כמה דקות'
    return msg
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" dir="rtl"
      style={{ background: 'linear-gradient(135deg, #EDE9FF 0%, #FDF2F8 50%, #FFF9F0 100%)' }}>

      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-40 pointer-events-none"
        style={{ background: '#C4B5FD', filter: 'blur(80px)', transform: 'translate(30%, -30%)' }} />
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full opacity-30 pointer-events-none"
        style={{ background: '#FBCFE8', filter: 'blur(70px)', transform: 'translate(-30%, 30%)' }} />
      <div className="absolute top-1/2 left-1/4 w-64 h-64 rounded-full opacity-20 pointer-events-none"
        style={{ background: '#BBF7D0', filter: 'blur(60px)', transform: 'translateY(-50%)' }} />

      {/* Card */}
      <div className="relative w-full max-w-md mx-4">
        <div className="bg-white/70 backdrop-blur-xl rounded-[28px] p-8 shadow-2xl border border-white/80"
          style={{ boxShadow: '0 20px 60px rgba(196,181,253,0.25), 0 4px 20px rgba(0,0,0,0.08)' }}>

          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-lavender to-dusty-pink flex items-center justify-center mb-3 shadow-lg"
              style={{ background: 'linear-gradient(135deg, #C4B5FD, #F9A8D4)' }}>
              <Sparkles size={24} className="text-white" />
            </div>
            <h1 className="text-2xl font-700 text-gray-800 tracking-tight">Studio Flow</h1>
            <p className="text-sm text-gray-500 mt-1">ניהול חיים ועסק ✨</p>
          </div>

          {/* Mode toggle */}
          <div className="flex bg-gray-100/80 rounded-2xl p-1 mb-6">
            {(['login', 'signup'] as Mode[]).map(m => (
              <button key={m} onClick={() => { setMode(m); setError(''); setSuccess('') }}
                className={`flex-1 py-2.5 rounded-xl text-sm font-500 transition-all duration-200 ${
                  mode === m
                    ? 'bg-white text-gray-800 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}>
                {m === 'login' ? 'התחברות' : 'הרשמה'}
              </button>
            ))}
          </div>

          {/* Welcome text */}
          <div className="mb-5">
            <h2 className="text-lg font-600 text-gray-800">
              {mode === 'login' ? 'ברוכה השבה 👋' : 'יוצרים חשבון חדש 🌸'}
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {mode === 'login'
                ? 'הכניסי את פרטי ההתחברות שלך'
                : 'הירשמי עם מייל וסיסמה כדי להתחיל'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Email */}
            <div className="relative">
              <Mail size={15} className="absolute top-1/2 -translate-y-1/2 right-3.5 text-gray-400 pointer-events-none" />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="כתובת מייל"
                className={`${inputCls} pr-10`}
                autoComplete="email"
                required
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock size={15} className="absolute top-1/2 -translate-y-1/2 right-3.5 text-gray-400 pointer-events-none" />
              <input
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="סיסמה (לפחות 6 תווים)"
                className={`${inputCls} pr-10 pl-10`}
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                required
              />
              <button type="button" onClick={() => setShowPw(s => !s)}
                className="absolute top-1/2 -translate-y-1/2 left-3.5 text-gray-400 hover:text-gray-600 transition-colors">
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>

            {/* Confirm password (signup only) */}
            {mode === 'signup' && (
              <div className="relative">
                <Lock size={15} className="absolute top-1/2 -translate-y-1/2 right-3.5 text-gray-400 pointer-events-none" />
                <input
                  type={showPw ? 'text' : 'password'}
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  placeholder="אימות סיסמה"
                  className={`${inputCls} pr-10`}
                  autoComplete="new-password"
                  required
                />
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-2xl px-4 py-3">
                <AlertCircle size={15} className="text-red-400 flex-shrink-0" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Success */}
            {success && (
              <div className="flex items-center gap-2 bg-mint-light border border-mint rounded-2xl px-4 py-3">
                <CheckCircle size={15} className="text-emerald-500 flex-shrink-0" />
                <p className="text-sm text-emerald-700">{success}</p>
              </div>
            )}

            {/* Submit */}
            <button type="submit" disabled={loading}
              className="w-full py-3.5 rounded-2xl text-white font-600 text-sm transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5 disabled:opacity-60 disabled:translate-y-0 mt-2"
              style={{ background: 'linear-gradient(135deg, #F472B6, #C084FC)', boxShadow: '0 4px 16px rgba(244,114,182,0.35)' }}>
              {loading ? '...' : mode === 'login' ? 'כניסה לחשבון ✨' : 'יצירת חשבון 🌸'}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-xs text-gray-400 mt-6">
            {mode === 'login' ? (
              <>עדיין אין לך חשבון?{' '}
                <button onClick={() => { setMode('signup'); setError('') }}
                  className="text-pink-500 font-500 hover:underline">הירשמי עכשיו</button>
              </>
            ) : (
              <>כבר יש לך חשבון?{' '}
                <button onClick={() => { setMode('login'); setError('') }}
                  className="text-pink-500 font-500 hover:underline">התחברי כאן</button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  )
}
