import { NavLink, useNavigate } from 'react-router-dom'
import { Home, Calendar, Users, Heart, Wand2, LogOut } from 'lucide-react'
import { useAuth } from '../../store/AuthContext'

const navItems = [
  { to: '/',        icon: Home,     label: 'בית',       activeColor: 'text-violet-500', activeDot: 'bg-lavender' },
  { to: '/calendar',icon: Calendar, label: 'יומן',      activeColor: 'text-violet-500', activeDot: 'bg-lavender' },
  { to: '/clients', icon: Users,    label: 'לקוחות',    activeColor: 'text-pink-500',   activeDot: 'bg-dusty-pink' },
  { to: '/studio',  icon: Wand2,    label: 'AI',        activeColor: 'text-violet-600', activeDot: 'bg-lavender' },
  { to: '/health',  icon: Heart,    label: 'בריאות',    activeColor: 'text-emerald-500',activeDot: 'bg-mint' },
]

export default function BottomNav() {
  const { signOut } = useAuth()
  const navigate = useNavigate()

  async function handleSignOut() {
    await signOut()
    navigate('/auth')
  }

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-20 bg-white border-t border-gray-100"
      style={{ boxShadow: '0 -4px 20px rgba(0,0,0,0.06)' }}>
      <div className="flex h-16 px-1">
        {navItems.map(({ to, icon: Icon, label, activeColor, activeDot }) => (
          <NavLink key={to} to={to} end={to === '/'}
            className="flex-1 flex flex-col items-center justify-center gap-0.5 relative">
            {({ isActive }) => (
              <>
                {isActive && <span className={`absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full ${activeDot}`} />}
                <div className={`p-1.5 rounded-xl transition-all duration-200 ${isActive ? 'bg-gray-50 scale-105' : ''}`}>
                  <Icon size={18} className={isActive ? activeColor : 'text-gray-400'} strokeWidth={isActive ? 2.2 : 1.8} />
                </div>
                <span className={`text-[9px] font-medium transition-colors ${isActive ? activeColor : 'text-gray-400'}`}>{label}</span>
              </>
            )}
          </NavLink>
        ))}
        {/* Logout */}
        <button onClick={handleSignOut}
          className="flex-1 flex flex-col items-center justify-center gap-0.5">
          <div className="p-1.5 rounded-xl hover:bg-red-50 transition-colors">
            <LogOut size={18} className="text-gray-400 hover:text-red-400" strokeWidth={1.8} />
          </div>
          <span className="text-[9px] font-medium text-gray-400">יציאה</span>
        </button>
      </div>
    </nav>
  )
}
