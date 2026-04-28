import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { deploymentsAPI, modelsAPI } from '@/lib/api'
import { Deployment, MLModel } from '@/types'
import { formatDate, getStatusColor } from '@/lib/utils'
import { Rocket, Trash2, Plus, Copy, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

export default function DeploymentsPage() {
  const qc = useQueryClient()
  const [showDeploy, setShowDeploy] = useState(false)
  const [selectedModel, setSelectedModel] = useState('')
  const [deployName, setDeployName] = useState('')
  const [replicas, setReplicas] = useState(1)

  const { data: deployments = [], isLoading } = useQuery({
    queryKey: ['deployments'],
    queryFn: () => deploymentsAPI.list().then(r => r.data),
    refetchInterval: 15000,
  })

  const { data: models = [] } = useQuery({
    queryKey: ['models'],
    queryFn: () => modelsAPI.list().then(r => r.data),
  })

  const deployMutation = useMutation({
    mutationFn: () => deploymentsAPI.create({ model_id: selectedModel, name: deployName, replicas }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['deployments'] })
      toast.success('Deployed successfully!')
      setShowDeploy(false); setDeployName(''); setSelectedModel('')
    },
    onError: (e: any) => toast.error(e.response?.data?.detail || 'Deployment failed'),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deploymentsAPI.delete(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['deployments'] }); toast.success('Deployment stopped') },
  })

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#e2e8f0', margin: '0 0 6px' }}>Deployments</h1>
          <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>Deploy models to live API endpoints</p>
        </div>
        <button className="btn-primary" onClick={() => setShowDeploy(!showDeploy)}>
          <Plus size={16} /> New Deployment
        </button>
      </div>

      {showDeploy && (
        <div className="glass-card glow-border" style={{ padding: '28px', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#e2e8f0', margin: '0 0 20px' }}>Deploy a Model</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 120px', gap: '16px', marginBottom: '20px' }}>
            <div>
              <label style={{ fontSize: '13px', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>Deployment Name</label>
              <input className="input-field" placeholder="my-deployment" value={deployName} onChange={e => setDeployName(e.target.value)} />
            </div>
            <div>
              <label style={{ fontSize: '13px', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>Select Model</label>
              <select className="input-field" value={selectedModel} onChange={e => setSelectedModel(e.target.value)}>
                <option value="">Choose model...</option>
                {models.map((m: MLModel) => <option key={m.id} value={m.id}>{m.name} ({m.version})</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: '13px', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>Replicas</label>
              <input className="input-field" type="number" min={1} max={10} value={replicas} onChange={e => setReplicas(Number(e.target.value))} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn-primary" onClick={() => deployMutation.mutate()} disabled={deployMutation.isPending}>
              {deployMutation.isPending ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Rocket size={16} />}
              {deployMutation.isPending ? 'Deploying...' : 'Deploy Now'}
            </button>
            <button className="btn-secondary" onClick={() => setShowDeploy(false)}>Cancel</button>
          </div>
        </div>
      )}

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>Loading deployments...</div>
      ) : deployments.length === 0 ? (
        <div className="glass-card" style={{ padding: '60px', textAlign: 'center' }}>
          <div style={{ fontSize: '40px', marginBottom: '16px' }}>🚀</div>
          <div style={{ color: '#94a3b8', fontSize: '16px' }}>No deployments yet</div>
          <div style={{ color: '#64748b', fontSize: '14px', marginTop: '8px' }}>Deploy a model to create a live API endpoint</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '12px' }}>
          {deployments.map((d: Deployment) => (
            <div key={d.id} className="glass-card" style={{ padding: '20px 24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '15px', fontWeight: 600, color: '#e2e8f0' }}>{d.name}</span>
                    <span className={getStatusColor(d.status)} style={{ fontSize: '11px', fontWeight: 500, padding: '3px 8px', borderRadius: '5px' }}>{d.status}</span>
                  </div>
                  {d.endpoint_url && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <code style={{ fontSize: '12px', color: '#818cf8', background: 'rgba(99,102,241,0.1)', padding: '4px 10px', borderRadius: '6px' }}>
                        {d.endpoint_url}
                      </code>
                      <button onClick={() => { navigator.clipboard.writeText(d.endpoint_url!); toast.success('Copied!') }}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                        <Copy size={14} />
                      </button>
                    </div>
                  )}
                  <div style={{ fontSize: '13px', color: '#64748b' }}>
                    {d.replicas} replica{d.replicas !== 1 ? 's' : ''} · {d.total_requests.toLocaleString()} requests · {d.avg_latency_ms}ms avg · {formatDate(d.created_at)}
                  </div>
                </div>
                <button onClick={() => deleteMutation.mutate(d.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: '6px' }}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}