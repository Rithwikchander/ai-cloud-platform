import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { authAPI } from '@/lib/api'
import toast from 'react-hot-toast'
import { Cloud, Loader2 } from 'lucide-react'

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false)
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { setToken, setUser } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async () => {
    setLoading(true)
    try {
      if (isRegister) {
        await authAPI.register(email, username, password)
        toast.success('Account created! Please sign in.')
        setIsRegister(false)
      } else {
        const res = await authAPI.login(email, password)
        setToken(res.data.access_token)
        const me = await authAPI.me()
        setUser(me.data)
        toast.success('Welcome back!')
        navigate('/dashboard')
      }
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: '#0a0a0f',
      backgroundImage: 'radial-gradient(ellipse at 50% 0%, rgba(99,102,241,0.15) 0%, transparent 60%)',
    }}>
      <div className="glass-card glow-border" style={{ width: '100%', maxWidth: '420px', padding: '48px 40px', margin: '20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{
            width: '52px', height: '52px', borderRadius: '14px', margin: '0 auto 16px',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Cloud size={24} color="white" />
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#e2e8f0', margin: '0 0 8px' }}>
            AI Cloud Platform
          </h1>
          <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>
            {isRegister ? 'Create your account' : 'Sign in to your account'}
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '6px', display: 'block' }}>Email</label>
            <input className="input-field" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          {isRegister && (
            <div>
              <label style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '6px', display: 'block' }}>Username</label>
              <input className="input-field" placeholder="yourname" value={username} onChange={e => setUsername(e.target.value)} />
            </div>
          )}
          <div>
            <label style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '6px', display: 'block' }}>Password</label>
            <input className="input-field" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
          </div>
          <button className="btn-primary" onClick={handleSubmit} disabled={loading} style={{ marginTop: '8px', justifyContent: 'center' }}>
            {loading ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : null}
            {isRegister ? 'Create Account' : 'Sign In'}
          </button>
        </div>

        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: '#64748b' }}>
          {isRegister ? 'Already have an account? ' : "Don't have an account? "}
          <span style={{ color: '#818cf8', cursor: 'pointer' }} onClick={() => setIsRegister(!isRegister)}>
            {isRegister ? 'Sign in' : 'Sign up'}
          </span>
        </p>
      </div>
    </div>
  )
}