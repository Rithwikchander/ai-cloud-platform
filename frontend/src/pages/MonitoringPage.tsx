import { useQuery } from '@tanstack/react-query'
import { metricsAPI } from '@/lib/api'
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

export default function MonitoringPage() {
  const { data: metrics } = useQuery({
    queryKey: ['metrics'],
    queryFn: () => metricsAPI.dashboard().then(r => r.data),
    refetchInterval: 5000,
  })

  const rpmData = metrics?.requests_per_minute?.map((v: number, i: number) => ({ t: `${i}s`, rpm: v })) || []
  const latData = metrics?.latency_history?.map((v: number, i: number) => ({ t: `${i}s`, ms: v })) || []
  const errData = metrics?.error_rate?.map((v: number, i: number) => ({ t: `${i}s`, rate: parseFloat(v.toFixed(2)) })) || []

  const tooltipStyle = { background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#e2e8f0' }

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#e2e8f0', margin: '0 0 6px' }}>Monitoring</h1>
        <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>Real-time metrics across all deployments · auto-refreshes every 5s</p>
      </div>

      <div style={{ display: 'grid', gap: '20px' }}>
        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#e2e8f0', margin: '0 0 20px' }}>Requests per minute</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={rpmData}>
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="t" stroke="#475569" tick={{ fontSize: 11 }} />
              <YAxis stroke="#475569" tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="rpm" stroke="#6366f1" fill="url(#g1)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div className="glass-card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#e2e8f0', margin: '0 0 20px' }}>Latency (ms)</h3>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={latData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="t" stroke="#475569" tick={{ fontSize: 11 }} />
                <YAxis stroke="#475569" tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Line type="monotone" dataKey="ms" stroke="#06b6d4" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="glass-card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#e2e8f0', margin: '0 0 20px' }}>Error rate (%)</h3>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={errData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="t" stroke="#475569" tick={{ fontSize: 11 }} />
                <YAxis stroke="#475569" tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="rate" fill="#ef4444" radius={[4, 4, 0, 0]} opacity={0.8} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}