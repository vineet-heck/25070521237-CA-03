import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'

// Pages
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import FeedbackBoard from './pages/FeedbackBoard'
import SubmitFeedback from './pages/SubmitFeedback'
import FeedbackDetail from './pages/FeedbackDetail'
import Roadmap from './pages/Roadmap'
import Changelog from './pages/Changelog'
import BugTracker from './pages/BugTracker'
import SavedItems from './pages/SavedItems'
import Profile from './pages/Profile'
import AdminStudio from './pages/AdminStudio'
import NotFound from './pages/NotFound'
import LoadingSpinner from './components/LoadingSpinner'

import './styles/global.css'

// Protected route: redirect to /login if not authenticated
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()
  if (loading) return <LoadingSpinner fullPage />
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return children
}

// Admin-only route: redirect to /dashboard if not admin
function AdminRoute({ children }) {
  const { isAuthenticated, loading, user } = useAuth()
  if (loading) return <LoadingSpinner fullPage />
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (user?.role !== 'admin') return <Navigate to="/dashboard" replace />
  return children
}

export default function App() {
  return (
    <ToastProvider>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected routes */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/feedback" element={<ProtectedRoute><FeedbackBoard /></ProtectedRoute>} />
        <Route path="/feedback/new" element={<ProtectedRoute><SubmitFeedback /></ProtectedRoute>} />
        <Route path="/feedback/:id" element={<ProtectedRoute><FeedbackDetail /></ProtectedRoute>} />
        <Route path="/roadmap" element={<ProtectedRoute><Roadmap /></ProtectedRoute>} />
        <Route path="/changelog" element={<ProtectedRoute><Changelog /></ProtectedRoute>} />
        <Route path="/bugs" element={<ProtectedRoute><BugTracker /></ProtectedRoute>} />
        <Route path="/saved" element={<ProtectedRoute><SavedItems /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

        {/* Admin-only route */}
        <Route path="/admin" element={<AdminRoute><AdminStudio /></AdminRoute>} />

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ToastProvider>
  )
}
