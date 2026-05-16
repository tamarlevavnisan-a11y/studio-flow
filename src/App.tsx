import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Dashboard from './pages/Dashboard'
import CalendarPage from './pages/CalendarPage'
import ClientsPage from './pages/ClientsPage'
import ClientDetailPage from './pages/ClientDetailPage'
import HealthPage from './pages/HealthPage'
import ProjectsPage from './pages/ProjectsPage'
import QuickPage from './pages/QuickPage'
import { ClientsProvider } from './store/ClientsContext'
import { CalendarProvider } from './store/CalendarContext'

export default function App() {
  return (
    <BrowserRouter>
      <CalendarProvider>
        <ClientsProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="/clients" element={<ClientsPage />} />
              <Route path="/clients/:id" element={<ClientDetailPage />} />
              <Route path="/health" element={<HealthPage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/quick" element={<QuickPage />} />
            </Routes>
          </Layout>
        </ClientsProvider>
      </CalendarProvider>
    </BrowserRouter>
  )
}
