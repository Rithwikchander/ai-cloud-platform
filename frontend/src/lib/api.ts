import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/api/v1`
  : '/api/v1'

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', 
      new URLSearchParams({ username: email, password }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' }}
    ),
  register: (email: string, username: string, password: string) =>
    api.post('/auth/register', { email, username, password }),
  me: () => api.get('/auth/me'),
}

export const modelsAPI = {
  list: () => api.get('/models/'),
  upload: (formData: FormData) =>
    api.post('/models/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  delete: (id: string) => api.delete(`/models/${id}`),
}

export const deploymentsAPI = {
  list: () => api.get('/deployments/'),
  create: (data: { model_id: string; name: string; replicas: number }) =>
    api.post('/deployments/', data),
  delete: (id: string) => api.delete(`/deployments/${id}`),
}

export const metricsAPI = {
  dashboard: () => api.get('/metrics/dashboard'),
}

export const inferenceAPI = {
  predict: (deployment_id: string, inputs: Record<string, unknown>) =>
    api.post('/inference/predict', { deployment_id, inputs }),
}

export default api