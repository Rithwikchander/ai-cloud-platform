import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import {
  LayoutDashboard, Brain, Rocket, Activity,
  Code2, LogOut, Cloud, Settings
} from 'lucide-react'

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Brain, label: 'Models', path: '/models' },
  { icon: Rocket, label: 'Deployments', path: '/deployments' },
  { icon: Activity, label: 'Monitoring', path: '/monitoring' },
  { icon: Code2, label: 'Playground', path: '/playground' },
]

export default function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuthStore()

  return (
    <aside style={{
      width: '240px', height: '100vh', position: 'fixed', left: 0, top: 0,
      background: 'rgba(10, 10, 20, 0.95)',
      borderRight: '1px solid rgba(255,255,255,0.06)',
      display: 'flex', flexDirection: 'column', padding: '24px 16px',
      backdropFilter: 'blur(20px)', zIndex: 100,
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '36px', padding: '0 8px' }}>
        <div style={{
          width: '36px', height: '36px', borderRadius: '10px',
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Cloud size={18} color="white" />
        </div>
        <div>
          <div style={{ fontSize: '14px', fontWeight: 700, color: '#e2e8f0' }}>AI Platform</div>
          <div style={{ fontSize: '11px', color: '#64748b' }}>Cloud Deploy</div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {navItems.map(({ icon: Icon, label, path }) => (
          <div
            key={path}
            className={`sidebar-item ${location.pathname === path ? 'active' : ''}`}
            onClick={() => navigate(path)}
          >
            <Icon size={18} />
            {label}
          </div>
        ))}
      </nav>

      {/* User */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '16px' }}>
        <div style={{ padding: '10px 14px', marginBottom: '4px' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#e2e8f0' }}>{user?.username || 'User'}</div>
          <div style={{ fontSize: '11px', color: '#64748b' }}>{user?.role || 'user'}</div>
        </div>
        <div className="sidebar-item" onClick={logout}>
          <LogOut size={18} />
          Sign out
        </div>
      </div>
    </aside>
  )
}