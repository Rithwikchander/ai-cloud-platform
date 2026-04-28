import { useNavigate } from 'react-router-dom'
import { Cloud, Zap, Shield, BarChart3, ArrowRight, Github } from 'lucide-react'

export default function LandingPage() {
  const navigate = useNavigate()
  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', color: '#e2e8f0' }}>
      <div style={{ backgroundImage: 'radial-gradient(ellipse at 50% -20%, rgba(99,102,241,0.2) 0%, transparent 60%)', minHeight: '100vh' }}>
        {/* Nav */}
        <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 60px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Cloud size={16} color="white" />
            </div>
            <span style={{ fontWeight: 700, fontSize: '16px' }}>AI Cloud Platform</span>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn-secondary" onClick={() => navigate('/login')}>Sign in</button>
            <button className="btn-primary" onClick={() => navigate('/login')}>Get started <ArrowRight size={14} /></button>
          </div>
        </nav>

        {/* Hero */}
        <div style={{ textAlign: 'center', padding: '100px 60px 80px' }}>
          <div style={{ display: 'inline-block', background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '20px', padding: '6px 16px', fontSize: '13px', color: '#818cf8', marginBottom: '24px' }}>
            Deploy ML models in seconds ✦
          </div>
          <h1 style={{ fontSize: '64px', fontWeight: 800, lineHeight: 1.1, margin: '0 0 24px', letterSpacing: '-2px' }}>
            Deploy AI models<br /><span className="gradient-text">instantly to the cloud</span>
          </h1>
          <p style={{ fontSize: '20px', color: '#94a3b8', maxWidth: '600px', margin: '0 auto 40px', lineHeight: 1.6 }}>
            Upload your ML model, click deploy. Get a live API endpoint with monitoring, autoscaling, and versioning in under 60 seconds.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <button className="btn-primary" onClick={() => navigate('/login')} style={{ padding: '14px 28px', fontSize: '16px' }}>
              Start deploying <ArrowRight size={18} />
            </button>
            <button className="btn-secondary" style={{ padding: '14px 28px', fontSize: '16px' }}>
              <Github size={18} /> View on GitHub
            </button>
          </div>
        </div>

        {/* Features */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', padding: '0 60px 100px', maxWidth: '1200px', margin: '0 auto' }}>
          {[
            { icon: Zap, title: 'One-click deploy', desc: 'Containerize and deploy any ML model to Kubernetes instantly', color: '#6366f1' },
            { icon: BarChart3, title: 'Real-time monitoring', desc: 'Track requests, latency, errors, and resource usage live', color: '#8b5cf6' },
            { icon: Shield, title: 'Secure by default', desc: 'JWT auth, API keys, rate limiting, and RBAC out of the box', color: '#06b6d4' },
            { icon: Cloud, title: 'Multi-cloud', desc: 'Deploy to AWS EKS, Oracle OKE, or GCP GKE with one config', color: '#10b981' },
          ].map(({ icon: Icon, title, desc, color }) => (
            <div key={title} className="glass-card" style={{ padding: '28px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <Icon size={22} color={color} />
              </div>
              <div style={{ fontSize: '16px', fontWeight: 600, color: '#e2e8f0', marginBottom: '8px' }}>{title}</div>
              <div style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.6 }}>{desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}