import { useQuery } from '@tanstack/react-query'
import { metricsAPI } from '@/lib/api'
import { useAuthStore } from '@/store/authStore'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { Brain, Rocket, Activity, Zap, TrendingUp, Server } from 'lucide-react'

export default function DashboardPage() {
  const { user } = useAuthStore()
  const { data: metrics } = useQuery({
    queryKey: ['dashboard-metrics'],
    queryFn: () => metricsAPI.dashboard().then(r => r.data),
    refetchInterval: 10000,
  })

  const rpmData = metrics?.requests_per_minute?.map((v: number, i: number) => ({ t: i, rpm: v })) || []
  const latData = metrics?.latency_history?.map((v: number, i: number) => ({ t: i, ms: v })) || []

  const stats = [
    { icon: Brain, label: 'Total Models', value: metrics?.total_models ?? 0, color: '#6366f1' },
    { icon: Rocket, label: 'Deployments', value: metrics?.total_deployments ?? 0, color: '#8b5cf6' },
    { icon: Activity, label: 'Running', value: metrics?.running_deployments ?? 0, color: '#10b981' },
    { icon: Zap, label: 'Total Requests', value: (metrics?.total_requests ?? 0).toLocaleString(), color: '#06b6d4' },
    { icon: TrendingUp, label: 'Avg Latency', value: `${metrics?.avg_latency_ms ?? 0}ms`, color: '#f59e0b' },
    { icon: Server, label: 'Uptime', value: `${metrics?.uptime_percent ?? 0}%`, color: '#10b981' },
  ]

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#e2e8f0', margin: '0 0 8px' }}>
          Welcome back, <span className="gradient-text">{user?.username}</span>
        </h1>
        <p style={{ color: '#64748b', fontSize: '15px', margin: 0 }}>
          Here's what's happening with your deployments
        </p>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '28px' }}>
        {stats.map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="glass-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={18} color={color} />
              </div>
              <span style={{ fontSize: '13px', color: '#64748b' }}>{label}</span>
            </div>
            <div style={{ fontSize: '28px', fontWeight: 700, color: '#e2e8f0' }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#e2e8f0', margin: '0 0 20px' }}>Requests / minute</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={rpmData}>
              <defs>
                <linearGradient id="rpm" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="t" hide />
              <YAxis hide />
              <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#e2e8f0' }} />
              <Area type="monotone" dataKey="rpm" stroke="#6366f1" fill="url(#rpm)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#e2e8f0', margin: '0 0 20px' }}>Avg latency (ms)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={latData}>
              <defs>
                <linearGradient id="lat" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="t" hide />
              <YAxis hide />
              <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#e2e8f0' }} />
              <Area type="monotone" dataKey="ms" stroke="#06b6d4" fill="url(#lat)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}