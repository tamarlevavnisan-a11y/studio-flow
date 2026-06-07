import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { ReactNode } from 'react'
import Layout from './components/layout/Layout'
import Dashboard from './pages/Dashboard'
import CalendarPage from './pages/CalendarPage'
import ClientsPage from './pages/ClientsPage'
import ClientDetailPage from './pages/ClientDetailPage'
import HealthPage from './pages/HealthPage'
import ProjectsPage from './pages/ProjectsPage'
import QuickPage from './pages/QuickPage'
import AuthPage from './pages/AuthPage'
import AdminPage   from './pages/AdminPage'
import StudioAIPage from './pages/StudioAIPage'
import InstagramCallbackPage from './pages/InstagramCallbackPage'
import { ClientsProvider }   from './store/ClientsContext'
import { CalendarProvider }  from './store/CalendarContext'
import { NutritionProvider } from './store/NutritionContext'
import { PostsProvider }     from './store/PostsContext'
import { InstagramProvider } from './store/InstagramContext'
import { AuthProvider, useAuth } from './store/AuthContext'

// ── Loading spinner ───────────────────────────────────────────────────────────
function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center"
      style={{ background: 'linear-gradient(135deg, #EDE9FF 0%, #FDF2F8 50%, #FFF9F0 100%)' }}>
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-2xl animate-pulse"
          style={{ background: 'linear-gradient(135deg, #C4B5FD, #F9A8D4)' }} />
        <p className="text-sm text-gray-400">טוען...</p>
      </div>
    </div>
  )
}

// ── Protected route ───────────────────────────────────────────────────────────
function RequireAuth({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()
  const location = useLocation()
  if (loading) return <LoadingScreen />
  if (!user)   return <Navigate to="/auth" state={{ from: location }} replace />
  return <>{children}</>
}

// ── App routes ────────────────────────────────────────────────────────────────
function AppRoutes() {
  const { user, loading } = useAuth()

  if (loading) return <LoadingScreen />

  return (
    <Routes>
      {/* Public */}
      <Route path="/auth" element={user ? <Navigate to="/" replace /> : <AuthPage />} />

      {/* OAuth callback — renders full-screen, outside the dashboard layout */}
      <Route path="/instagram/callback" element={
        <RequireAuth>
          <InstagramProvider>
            <InstagramCallbackPage />
          </InstagramProvider>
        </RequireAuth>
      } />

      {/* Protected */}
      <Route path="/*" element={
        <RequireAuth>
          <NutritionProvider>
            <CalendarProvider>
              <ClientsProvider>
                <PostsProvider>
                <InstagramProvider>
                <Layout>
                  <Routes>
                    <Route path="/"            element={<Dashboard />} />
                    <Route path="/calendar"    element={<CalendarPage />} />
                    <Route path="/clients"     element={<ClientsPage />} />
                    <Route path="/clients/:id" element={<ClientDetailPage />} />
                    <Route path="/health"      element={<HealthPage />} />
                    <Route path="/projects"    element={<ProjectsPage />} />
                    <Route path="/quick"       element={<QuickPage />} />
                    <Route path="/admin"       element={<AdminPage />} />
                    <Route path="/studio"      element={<StudioAIPage />} />
                    <Route path="*"            element={<Navigate to="/" replace />} />
                  </Routes>
                </Layout>
                </InstagramProvider>
                </PostsProvider>
              </ClientsProvider>
            </CalendarProvider>
          </NutritionProvider>
        </RequireAuth>
      } />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}
