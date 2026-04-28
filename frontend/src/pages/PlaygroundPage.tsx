import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { deploymentsAPI, inferenceAPI } from '@/lib/api'
import { Deployment } from '@/types'
import { Play, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

export default function PlaygroundPage() {
  const [selectedDeployment, setSelectedDeployment] = useState('')
  const [inputJson, setInputJson] = useState('{\n  "features": [1.2, 3.4, 5.6]\n}')
  const [response, setResponse] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const { data: deployments = [] } = useQuery({
    queryKey: ['deployments'],
    queryFn: () => deploymentsAPI.list().then(r => r.data),
  })

  const handleRun = async () => {
    if (!selectedDeployment) return toast.error('Select a deployment first')
    try {
      JSON.parse(inputJson)
    } catch {
      return toast.error('Invalid JSON input')
    }
    setLoading(true)
    try {
      const res = await inferenceAPI.predict(selectedDeployment, JSON.parse(inputJson))
      setResponse(res.data)
    } catch (e: any) {
      toast.error('Inference failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#e2e8f0', margin: '0 0 6px' }}>API Playground</h1>
        <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>Test your deployed models with live inference</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div>
          <div className="glass-card" style={{ padding: '24px', marginBottom: '16px' }}>
            <label style={{ fontSize: '13px', color: '#94a3b8', display: 'block', marginBottom: '8px' }}>Select Deployment</label>
            <select className="input-field" value={selectedDeployment} onChange={e => setSelectedDeployment(e.target.value)} style={{ marginBottom: '20px' }}>
              <option value="">Choose deployment...</option>
              {deployments.filter((d: Deployment) => d.status === 'running').map((d: Deployment) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>

            <label style={{ fontSize: '13px', color: '#94a3b8', display: 'block', marginBottom: '8px' }}>Request Body (JSON)</label>
            <textarea
              value={inputJson}
              onChange={e => setInputJson(e.target.value)}
              rows={10}
              style={{
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '10px', padding: '14px', color: '#e2e8f0', width: '100%',
                fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', resize: 'vertical', outline: 'none',
              }}
            />
            <button className="btn-primary" onClick={handleRun} disabled={loading} style={{ marginTop: '16px', width: '100%', justifyContent: 'center' }}>
              {loading ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Play size={16} />}
              {loading ? 'Running...' : 'Run Inference'}
            </button>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '12px' }}>Response</div>
          {response ? (
            <pre style={{
              fontFamily: 'JetBrains Mono, monospace', fontSize: '13px',
              color: '#a3e635', background: 'rgba(0,0,0,0.3)', borderRadius: '10px',
              padding: '16px', overflow: 'auto', margin: 0, whiteSpace: 'pre-wrap',
            }}>
              {JSON.stringify(response, null, 2)}
            </pre>
          ) : (
            <div style={{ color: '#475569', fontSize: '14px', textAlign: 'center', padding: '40px 0' }}>
              Response will appear here after running inference
            </div>
          )}
        </div>
      </div>
    </div>
  )
}