import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './stores/authStore'
import LoginPage from './pages/LoginPage'
import DesktopPage from './pages/DesktopPage'
import { useEffect } from 'react'

function App() {
  const { isAuthenticated, checkAuth } = useAuthStore()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  return (
    <Router>
      <Routes>
        <Route path="/login" element={
          isAuthenticated ? <Navigate to="/desktop" replace /> : <LoginPage />
        } />
        <Route path="/desktop" element={
          isAuthenticated ? <DesktopPage /> : <Navigate to="/login" replace />
        } />
        <Route path="/" element={<Navigate to="/desktop" replace />} />
      </Routes>
    </Router>
  )
}

export default App