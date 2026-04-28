export interface User {
  id: string
  email: string
  username: string
  role: 'admin' | 'user'
  api_key: string
  created_at: string
}

export interface MLModel {
  id: string
  name: string
  description?: string
  version: string
  framework: 'sklearn' | 'pytorch' | 'onnx' | 'tensorflow' | 'unknown'
  status: 'uploading' | 'validating' | 'ready' | 'failed'
  file_size?: number
  created_at: string
}

export interface Deployment {
  id: string
  name: string
  status: 'pending' | 'building' | 'deploying' | 'running' | 'failed' | 'stopped'
  endpoint_url?: string
  replicas: number
  total_requests: number
  avg_latency_ms: number
  created_at: string
}

export interface DashboardMetrics {
  total_models: number
  total_deployments: number
  running_deployments: number
  total_requests: number
  avg_latency_ms: number
  uptime_percent: number
  requests_per_minute: number[]
  latency_history: number[]
  error_rate: number[]
}