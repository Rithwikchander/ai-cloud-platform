import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import ModelsPage from './pages/ModelsPage'
import DeploymentsPage from './pages/DeploymentsPage'
import MonitoringPage from './pages/MonitoringPage'
import PlaygroundPage from './pages/PlaygroundPage'
import Sidebar from './components/ui/Sidebar'

function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{ flex: 1, marginLeft: '240px', padding: '32px', overflowY: 'auto' }}>
        {children}
      </main>
    </div>
  )
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore()
  if (isAuthenticated) return <Navigate to="/dashboard" replace />
  return <>{children}</>
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={
          <PublicRoute><LoginPage /></PublicRoute>
        } />

        {/* Protected routes */}
        <Route path="/dashboard" element={<ProtectedLayout><DashboardPage /></ProtectedLayout>} />
        <Route path="/models" element={<ProtectedLayout><ModelsPage /></ProtectedLayout>} />
        <Route path="/deployments" element={<ProtectedLayout><DeploymentsPage /></ProtectedLayout>} />
        <Route path="/monitoring" element={<ProtectedLayout><MonitoringPage /></ProtectedLayout>} />
        <Route path="/playground" element={<ProtectedLayout><PlaygroundPage /></ProtectedLayout>} />

        {/* Catch all unknown routes → redirect to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}