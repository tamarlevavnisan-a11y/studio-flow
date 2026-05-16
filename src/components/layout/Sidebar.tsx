import { NavLink } from 'react-router-dom'
import { Home, Calendar, Users, Heart, FolderOpen, Zap, Sparkles } from 'lucide-react'

const navItems = [
  { to: '/',          icon: Home,       label: 'בית',          iconColor: 'text-violet-400', activeBg: 'bg-lavender-light' },
  { to: '/calendar',  icon: Calendar,   label: 'לוח שנה',      iconColor: 'text-violet-400', activeBg: 'bg-lavender-light' },
  { to: '/clients',   icon: Users,      label: 'לקוחות',       iconColor: 'text-pink-400',   activeBg: 'bg-dusty-pink-light' },
  { to: '/health',    icon: Heart,      label: 'בריאות',       iconColor: 'text-emerald-500',activeBg: 'bg-mint-light' },
  { to: '/projects',  icon: FolderOpen, label: 'פרויקטים',    iconColor: 'text-orange-400', activeBg: 'bg-peach-light' },
  { to: '/quick',     icon: Zap,        label: 'גישה מהירה',  iconColor: 'text-yellow-500', activeBg: 'bg-butter-light' },
]

export default function Sidebar() {
  return (
    <aside className="hidden lg:flex flex-col w-64 min-h-screen bg-white fixed right-0 top-0 z-20"
      style={{ boxShadow: '-4px 0 24px rgba(0,0,0,0.04)' }}>

      {/* Logo */}
      <div className="px-6 pt-7 pb-6">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-lavender to-dusty-pink flex items-center justify-center flex-shrink-0">
            <Sparkles size={15} className="text-white" />
          </div>
          <div>
            <h1 className="text-base font-600 text-gray-900 leading-tight tracking-tight">Studio Flow</h1>
            <p className="text-[10px] text-gray-400 leading-tight">ניהול חיים ועסק</p>
          </div>
        </div>
      </div>

      <div className="mx-4 h-px bg-gray-100 mb-4" />

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-0.5">
        {navItems.map(({ to, icon: Icon, label, iconColor, activeBg }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? `${activeBg} text-gray-800`
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${
                  isActive ? 'bg-white shadow-sm' : 'bg-transparent'
                }`}>
                  <Icon size={16} className={isActive ? iconColor : 'text-gray-400'} />
                </div>
                <span>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User */}
      <div className="mx-4 h-px bg-gray-100 mb-4 mt-2" />
      <div className="px-5 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-lavender to-dusty-pink flex items-center justify-center text-white font-600 text-sm flex-shrink-0">
            ת
          </div>
          <div className="min-w-0">
            <p className="text-sm font-500 text-gray-800 truncate">תמר</p>
            <p className="text-xs text-gray-400 truncate">מנהלת עסק</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
