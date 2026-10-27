import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor: attach token from localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor: handle 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api

// Auth
export const register = (data) => api.post('/api/auth/register', data)
export const login = (data) => api.post('/api/auth/login', data)
export const getMe = () => api.get('/api/auth/me')

// Feedback
export const getFeedback = (params) => api.get('/api/feedback', { params })
export const getFeedbackById = (id) => api.get(`/api/feedback/${id}`)
export const createFeedback = (data) => api.post('/api/feedback', data)
export const updateFeedback = (id, data) => api.put(`/api/feedback/${id}`, data)
export const deleteFeedback = (id) => api.delete(`/api/feedback/${id}`)
export const voteFeedback = (id) => api.post(`/api/feedback/${id}/vote`)
export const addComment = (id, data) => api.post(`/api/feedback/${id}/comments`, data)
export const getComments = (id) => api.get(`/api/feedback/${id}/comments`)

// Bugs
export const getBugs = (params) => api.get('/api/bugs', { params })
export const getBugById = (id) => api.get(`/api/bugs/${id}`)
export const createBug = (data) => api.post('/api/bugs', data)
export const updateBug = (id, data) => api.put(`/api/bugs/${id}`, data)
export const deleteBug = (id) => api.delete(`/api/bugs/${id}`)

// Changelog
export const getChangelog = () => api.get('/api/changelog')
export const createChangelog = (data) => api.post('/api/changelog', data)
export const updateChangelog = (id, data) => api.put(`/api/changelog/${id}`, data)
export const deleteChangelog = (id) => api.delete(`/api/changelog/${id}`)

// Saved
export const getSavedItems = () => api.get('/api/saved')
export const toggleSave = (data) => api.post('/api/saved/toggle', data)
export const checkSaved = (params) => api.get('/api/saved/check', { params })

// Dashboard
export const getDashboardSummary = () => api.get('/api/dashboard/summary')

// Roadmap
export const getRoadmap = () => api.get('/api/roadmap')
export const updateRoadmapStatus = (id, data) => api.put(`/api/roadmap/${id}/status`, data)

// Users
export const getProfile = () => api.get('/api/users/me')
export const updateProfile = (data) => api.put('/api/users/me', data)
export const getUserActivity = () => api.get('/api/users/me/activity')

// Admin
export const getAdminStats = () => api.get('/api/admin/stats')
export const getAdminUsers = () => api.get('/api/admin/users')
export const adminUpdateFeedbackStatus = (id, data) => api.put(`/api/admin/feedback/${id}/status`, data)
export const adminUpdateBugStatus = (id, data) => api.put(`/api/admin/bugs/${id}/status`, data)
