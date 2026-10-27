import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../layouts/DashboardLayout'
import StatusBadge from '../components/StatusBadge'
import LoadingSpinner from '../components/LoadingSpinner'
import EmptyState from '../components/EmptyState'
import { useToast } from '../context/ToastContext'
import { useAuth } from '../context/AuthContext'
import { getProfile, updateProfile, getUserActivity } from '../services/api'
import { User, MessageSquare, Edit2, Check, X } from 'lucide-react'

function formatDate(d) {
  if (!d) return ''
  return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

export default function Profile() {
  const { user, updateUser } = useAuth()
  const { showToast } = useToast()
  const [profile, setProfile] = useState(null)
  const [activity, setActivity] = useState({ feedback: [], comments: [] })
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ name: '', bio: '' })
  const [saving, setSaving] = useState(false)

  const fetchData = useCallback(async () => {
    try {
      const [profRes, actRes] = await Promise.all([getProfile(), getUserActivity()])
      // profRes.data = { user, feedback, comments }
      const profileData = profRes.data?.user || profRes.data
      setProfile(profileData)
      // actRes.data = { recentFeedback, recentComments }
      setActivity({
        feedback: actRes.data?.recentFeedback || profRes.data?.feedback || [],
        comments: actRes.data?.recentComments || profRes.data?.comments || [],
      })
      setForm({ name: profileData.name || '', bio: profileData.bio || '' })
    } catch {
      showToast('Failed to load profile', 'error')
    } finally {
      setLoading(false)
    }
  }, [showToast])

  useEffect(() => { fetchData() }, [fetchData])

  const handleSave = async () => {
    if (!form.name.trim()) { showToast('Name is required', 'error'); return }
    setSaving(true)
    try {
      const res = await updateProfile({ name: form.name, bio: form.bio })
      // API returns { message, user }
      const updatedUser = res.data?.user || res.data
      setProfile(prev => ({ ...prev, ...updatedUser }))
      updateUser({ name: updatedUser.name, bio: updatedUser.bio })
      showToast('Profile updated', 'success')
      setEditing(false)
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update profile', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setForm({ name: profile?.name || '', bio: profile?.bio || '' })
    setEditing(false)
  }

  if (loading) return <DashboardLayout><LoadingSpinner /></DashboardLayout>

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-title">My Profile</h1>
        <p className="page-subtitle">Manage your account information and view your activity.</p>
      </div>

      <div className="profile-grid">
        {/* Profile Card */}
        <div className="card profile-card">
          <div className="profile-avatar-section">
            <div className="user-avatar user-avatar-xl">
              {(profile?.name || user?.name || 'U').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
            </div>
            <div>
              {editing ? (
                <input
                  className="form-input"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Your full name"
                />
              ) : (
                <h2 className="profile-name">{profile?.name}</h2>
              )}
              <span className={`badge badge-role ${profile?.role === 'admin' ? 'badge-admin' : 'badge-user'}`}>
                {profile?.role === 'admin' ? '★ Admin' : 'Member'}
              </span>
            </div>
          </div>

          <div className="profile-field">
            <label className="form-label">Email</label>
            <p className="profile-value">{profile?.email}</p>
          </div>

          <div className="profile-field">
            <label className="form-label">Bio</label>
            {editing ? (
              <textarea
                className="form-textarea"
                rows={3}
                value={form.bio}
                onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                placeholder="Tell us a bit about yourself…"
              />
            ) : (
              <p className="profile-value text-secondary">
                {profile?.bio || <span className="text-muted">No bio added yet.</span>}
              </p>
            )}
          </div>

          <div className="profile-field">
            <label className="form-label">Member Since</label>
            <p className="profile-value">{formatDate(profile?.createdAt)}</p>
          </div>

          <div className="profile-actions">
            {editing ? (
              <>
                <button className="btn btn-primary btn-sm" onClick={handleSave} disabled={saving}>
                  <Check size={14} /> {saving ? 'Saving…' : 'Save Changes'}
                </button>
                <button className="btn btn-secondary btn-sm" onClick={handleCancel}>
                  <X size={14} /> Cancel
                </button>
              </>
            ) : (
              <button className="btn btn-secondary btn-sm" onClick={() => setEditing(true)}>
                <Edit2 size={14} /> Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* Activity */}
        <div className="profile-activity">
          {/* My Feedback */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">My Submissions</h3>
              <span className="badge">{activity.feedback?.length || 0}</span>
            </div>
            <div className="card-body">
              {!activity.feedback?.length ? (
                <EmptyState
                  icon={MessageSquare}
                  title="No submissions yet"
                  description="Your feedback submissions will appear here."
                />
              ) : (
                <div className="activity-list">
                  {activity.feedback.map((fb) => (
                    <Link to={`/feedback/${fb._id}`} className="activity-item" key={fb._id}>
                      <div className="activity-item-content">
                        <span className="activity-item-title">{fb.title}</span>
                        <StatusBadge status={fb.status} />
                      </div>
                      <span className="text-muted text-sm">{formatDate(fb.createdAt)}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Recent Comments */}
          <div className="card mt-4">
            <div className="card-header">
              <h3 className="card-title">Recent Comments</h3>
              <span className="badge">{activity.comments?.length || 0}</span>
            </div>
            <div className="card-body">
              {!activity.comments?.length ? (
                <p className="text-muted text-sm" style={{ padding: '1rem 0' }}>No comments yet.</p>
              ) : (
                <div className="activity-list">
                  {activity.comments.map((c) => (
                    <Link
                      to={`/feedback/${c.feedback}`}
                      className="activity-item"
                      key={c._id}
                    >
                      <div className="activity-item-content">
                        <span className="activity-item-comment">"{c.text?.slice(0, 80)}{c.text?.length > 80 ? '…' : ''}"</span>
                      </div>
                      <span className="text-muted text-sm">{formatDate(c.createdAt)}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
