import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { Users, Crown, Calendar, Shield, RefreshCw, AlertCircle } from 'lucide-react'
import { supabase, ADMIN_EMAIL } from '../lib/supabase'
import { useAuth } from '../store/AuthContext'

interface Profile {
  id: string
  email: string
  created_at: string
}

function StatCard({ value, label, icon: Icon, color, bg }: {
  value: number; label: string; icon: React.ElementType; color: string; bg: string
}) {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
      <div className={`w-11 h-11 rounded-2xl ${bg} flex items-center justify-center mb-4`}>
        <Icon size={20} className={color} />
      </div>
      <p className="text-4xl font-700 text-gray-900">{value}</p>
      <p className="text-sm text-gray-500 mt-1">{label}</p>
    </div>
  )
}

export default function AdminPage() {
  const { isAdmin } = useAuth()
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState('')

  if (!isAdmin) return <Navigate to="/" replace />

  async function loadProfiles() {
    setLoading(true)
    setError('')
    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, created_at')
      .order('created_at', { ascending: false })

    if (error) {
      setError(
        error.message.includes('does not exist') || error.code === '42P01'
          ? 'טבלת profiles לא קיימת — הרצי את supabase-setup.sql בדשבורד'
          : 'שגיאה בטעינת המשתמשים: ' + error.message
      )
    } else {
      setProfiles(data ?? [])
    }
    setLoading(false)
  }

  useEffect(() => { loadProfiles() }, [])

  const today      = new Date().toDateString()
  const newToday   = profiles.filter(p => new Date(p.created_at).toDateString() === today).length

  return (
    <div className="space-y-6" dir="rtl">

      {/* Header */}
      <div className="rounded-3xl p-6 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #EDE9FF 0%, #FDF2F8 100%)' }}>
        <div className="absolute top-0 left-0 w-64 h-64 rounded-full opacity-30 pointer-events-none"
          style={{ background: '#C4B5FD', filter: 'blur(50px)', transform: 'translate(-40%, -40%)' }} />
        <div className="relative flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
            style={{ background: 'linear-gradient(135deg, #C4B5FD, #F9A8D4)' }}>
            <Crown size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-700 text-gray-900">לוח בקרה ניהולי</h1>
            <p className="text-sm text-violet-600/70 mt-0.5">גישת מנהלת מערכת בלבד ✨</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard
          value={profiles.length}
          label='סה"כ משתמשות'
          icon={Users}
          color="text-violet-500"
          bg="bg-lavender-light"
        />
        <StatCard
          value={newToday}
          label="הצטרפו היום"
          icon={Calendar}
          color="text-pink-500"
          bg="bg-dusty-pink-light"
        />
      </div>

      {/* Users list */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">

        {/* Table header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield size={16} className="text-violet-400" />
            <h2 className="font-600 text-gray-800">משתמשות רשומות</h2>
          </div>
          <button onClick={loadProfiles} disabled={loading}
            className="w-8 h-8 rounded-xl hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-40"
            title="רענון">
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>

        {/* States */}
        {loading && (
          <div className="px-6 py-14 text-center">
            <div className="w-10 h-10 rounded-2xl animate-pulse mx-auto mb-3"
              style={{ background: 'linear-gradient(135deg, #C4B5FD, #F9A8D4)' }} />
            <p className="text-sm text-gray-400">טוענת משתמשות...</p>
          </div>
        )}

        {!loading && error && (
          <div className="px-6 py-14 text-center space-y-3">
            <AlertCircle size={36} className="text-red-300 mx-auto" />
            <p className="text-sm font-500 text-red-500">{error}</p>
            <p className="text-xs text-gray-400 max-w-xs mx-auto">
              פתחי את הקובץ <code className="bg-gray-100 px-1.5 py-0.5 rounded-lg text-gray-600">supabase-setup.sql</code> בתיקיית הפרויקט והריצי אותו בסופאבייס Dashboard
            </p>
          </div>
        )}

        {!loading && !error && profiles.length === 0 && (
          <div className="px-6 py-14 text-center">
            <Users size={36} className="text-gray-200 mx-auto mb-3" />
            <p className="text-sm text-gray-400">אין משתמשות רשומות עדיין</p>
          </div>
        )}

        {!loading && !error && profiles.length > 0 && (
          <div className="divide-y divide-gray-50">
            {profiles.map((profile, i) => {
              const isAdminUser = profile.email === ADMIN_EMAIL
              const initials    = profile.email[0].toUpperCase()
              const date        = new Date(profile.created_at).toLocaleDateString('he-IL', {
                day: 'numeric', month: 'long', year: 'numeric'
              })
              return (
                <div key={profile.id}
                  className={`px-6 py-4 flex items-center gap-4 transition-colors hover:bg-gray-50/60 ${
                    isAdminUser ? 'bg-lavender-light/20' : ''
                  }`}>

                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-600 text-sm flex-shrink-0"
                    style={{ background: isAdminUser
                      ? 'linear-gradient(135deg, #C4B5FD, #F9A8D4)'
                      : 'linear-gradient(135deg, #93C5FD, #6EE7B7)' }}>
                    {initials}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-500 text-gray-800 truncate">{profile.email}</p>
                      {isAdminUser && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-600 text-violet-700 bg-lavender-light">
                          <Crown size={9} />Admin
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Calendar size={11} className="text-gray-400 flex-shrink-0" />
                      <p className="text-xs text-gray-400">נרשמה {date}</p>
                    </div>
                  </div>

                  {/* Index */}
                  <span className="text-[11px] text-gray-300 font-500 flex-shrink-0">#{i + 1}</span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
