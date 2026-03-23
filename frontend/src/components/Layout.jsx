import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Zap, BarChart2, Lightbulb, Settings, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const navItems = [
  { to: '/',           icon: LayoutDashboard, label: 'Home'     },
  { to: '/appliances', icon: Zap,             label: 'Devices'  },
  { to: '/charts',     icon: BarChart2,       label: 'Charts'   },
  { to: '/tips',       icon: Lightbulb,       label: 'Tips'     },
  { to: '/settings',   icon: Settings,        label: 'Settings' },
]

export default function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto relative" style={{background: 'linear-gradient(135deg, #0a0f0a 0%, #0d1f10 40%, #0a1a0e 100%)'}}>

      {/* Animated background orbs */}
      <div className="fixed inset-0 max-w-md mx-auto overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-10" style={{background: 'radial-gradient(circle, #22c55e, transparent)'}} />
        <div className="absolute top-1/3 -left-20 w-48 h-48 rounded-full opacity-8" style={{background: 'radial-gradient(circle, #16a34a, transparent)'}} />
        <div className="absolute bottom-1/4 right-0 w-56 h-56 rounded-full opacity-6" style={{background: 'radial-gradient(circle, #15803d, transparent)'}} />
      </div>

      {/* Fixed top bar */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-md z-50" style={{background: 'rgba(10,15,10,0.92)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(34,197,94,0.15)'}}>

        {/* Welcome bar */}
        <div className="flex items-center justify-between px-4 pt-10 pb-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{background: 'linear-gradient(135deg, #16a34a, #22c55e)', boxShadow: '0 0 12px rgba(34,197,94,0.4)'}}>
              <span className="text-xs font-bold text-white">
                {(user?.first_name?.[0] || user?.username?.[0] || 'U').toUpperCase()}
              </span>
            </div>
            <div>
              <p className="text-[10px] text-green-500 font-medium tracking-wider uppercase leading-none">Welcome back</p>
              <p className="text-sm font-display font-bold text-white leading-tight">
                {user?.first_name ? `${user.first_name} ${user.last_name || ''}`.trim() : user?.username} 🌿
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-400 hover:text-red-300 transition-all"
            style={{background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)'}}
          >
            <LogOut size={12} />
            Logout
          </button>
        </div>

        {/* Nav */}
        <nav className="flex items-center justify-around px-1 pb-1.5">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              {({ isActive }) => (
                <>
                  <div className={`p-1 rounded-lg transition-all duration-200 ${isActive ? 'bg-green-900/60' : ''}`}>
                    <Icon size={16} className={isActive ? 'text-green-400' : 'text-gray-500'} />
                  </div>
                  <span className="text-[10px]">{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Page content */}
      <main className="flex-1 px-4 pt-28 pb-8 overflow-y-auto relative z-10">
        <Outlet />
      </main>
    </div>
  )
}
