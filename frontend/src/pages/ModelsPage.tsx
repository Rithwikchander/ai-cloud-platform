import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { modelsAPI } from '@/lib/api'
import { MLModel } from '@/types'
import { formatBytes, formatDate, getFrameworkIcon, getStatusColor } from '@/lib/utils'
import { Upload, Trash2, Plus, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ModelsPage() {
  const qc = useQueryClient()
  const [showUpload, setShowUpload] = useState(false)
  const [name, setName] = useState('')
  const [version, setVersion] = useState('v1')
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)

  const { data: models = [], isLoading } = useQuery({
    queryKey: ['models'],
    queryFn: () => modelsAPI.list().then(r => r.data),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => modelsAPI.delete(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['models'] }); toast.success('Model deleted') },
  })

  const handleUpload = async () => {
    if (!file || !name) return toast.error('Name and file required')
    setUploading(true)
    const fd = new FormData()
    fd.append('name', name)
    fd.append('version', version)
    fd.append('file', file)
    try {
      await modelsAPI.upload(fd)
      toast.success('Model uploaded successfully!')
      qc.invalidateQueries({ queryKey: ['models'] })
      setShowUpload(false); setName(''); setFile(null)
    } catch (e: any) {
      toast.error(e.response?.data?.detail || 'Upload failed')
    } finally { setUploading(false) }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#e2e8f0', margin: '0 0 6px' }}>ML Models</h1>
          <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>Upload and manage your machine learning models</p>
        </div>
        <button className="btn-primary" onClick={() => setShowUpload(!showUpload)}>
          <Plus size={16} /> Upload Model
        </button>
      </div>

      {showUpload && (
        <div className="glass-card glow-border" style={{ padding: '28px', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#e2e8f0', margin: '0 0 20px' }}>Upload New Model</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ fontSize: '13px', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>Model Name</label>
              <input className="input-field" placeholder="my-model" value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div>
              <label style={{ fontSize: '13px', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>Version</label>
              <input className="input-field" placeholder="v1" value={version} onChange={e => setVersion(e.target.value)} />
            </div>
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '13px', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>Model File (.pkl, .joblib, .onnx, .pt)</label>
            <input type="file" accept=".pkl,.joblib,.onnx,.pt,.pth"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '10px 14px', color: '#e2e8f0', width: '100%', fontSize: '14px' }}
              onChange={e => setFile(e.target.files?.[0] || null)} />
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn-primary" onClick={handleUpload} disabled={uploading}>
              {uploading ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Upload size={16} />}
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
            <button className="btn-secondary" onClick={() => setShowUpload(false)}>Cancel</button>
          </div>
        </div>
      )}

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>Loading models...</div>
      ) : models.length === 0 ? (
        <div className="glass-card" style={{ padding: '60px', textAlign: 'center' }}>
          <div style={{ fontSize: '40px', marginBottom: '16px' }}>📦</div>
          <div style={{ color: '#94a3b8', fontSize: '16px', marginBottom: '8px' }}>No models yet</div>
          <div style={{ color: '#64748b', fontSize: '14px' }}>Upload your first ML model to get started</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '12px' }}>
          {models.map((model: MLModel) => (
            <div key={model.id} className="glass-card" style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ fontSize: '28px' }}>{getFrameworkIcon(model.framework)}</div>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: 600, color: '#e2e8f0' }}>{model.name}</div>
                  <div style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
                    {model.version} · {model.framework} · {model.file_size ? formatBytes(model.file_size) : '—'} · {formatDate(model.created_at)}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span className={getStatusColor(model.status)} style={{ fontSize: '12px', fontWeight: 500, padding: '4px 10px', borderRadius: '6px' }}>{model.status}</span>
                <button onClick={() => deleteMutation.mutate(model.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: '6px' }}>
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