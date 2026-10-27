import { useState, useEffect, useCallback } from 'react'
import DashboardLayout from '../layouts/DashboardLayout'
import StatusBadge from '../components/StatusBadge'
import LoadingSpinner from '../components/LoadingSpinner'
import { useToast } from '../context/ToastContext'
import {
  getAdminStats,
  getAdminUsers,
  getBugs,
  adminUpdateFeedbackStatus,
  adminUpdateBugStatus,
  getChangelog,
  createChangelog,
  updateChangelog,
  deleteChangelog,
} from '../services/api'
import {
  Users, MessageSquare, Bug, TrendingUp,
  ShieldCheck, Plus, Edit2, Trash2, X, Check
} from 'lucide-react'
import ConfirmModal from '../components/ConfirmModal'

const FEEDBACK_STATUSES = ['Planned', 'Under Review', 'In Progress', 'Completed', 'Declined']
const BUG_STATUSES = ['Open', 'In Progress', 'Resolved', 'Closed', 'Wont Fix']
const CHANGELOG_CATS = ['Feature', 'Improvement', 'Bug Fix', 'Performance', 'Security', 'Breaking Change']

function formatDate(d) {
  if (!d) return ''
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="stat-card">
      <div
        className="stat-card-icon"
        style={{
          backgroundColor: color + '20',
          color,
          boxShadow: `0 0 15px ${color}40`,
          border: `1px solid ${color}50`
        }}
      >
        <Icon size={22} />
      </div>
      <div>
        <div className="stat-card-value">{value ?? '—'}</div>
        <div className="stat-card-label">{label}</div>
      </div>
    </div>
  )
}

const TABS = ['overview', 'feedback', 'bugs', 'changelog', 'users']

export default function AdminStudio() {
  const { showToast } = useToast()
  const [activeTab, setActiveTab] = useState('overview')
  const [stats, setStats] = useState(null)
  const [feedbackList, setFeedbackList] = useState([])
  const [bugList, setBugList] = useState([])
  const [userList, setUserList] = useState([])
  const [changelogList, setChangelogList] = useState([])
  const [loading, setLoading] = useState(true)
  const [updatingStatus, setUpdatingStatus] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [clForm, setClForm] = useState(null) // null = hidden, {} = create, {...} = edit

  const fetchAll = useCallback(async () => {
    setLoading(true)
    try {
      const [statsRes, usersRes, clRes] = await Promise.all([
        getAdminStats(),
        getAdminUsers(),
        getChangelog(),
      ])
      const s = statsRes.data
      // API shape: { totals, feedbackByStatus (obj), bugsBySeverity (obj), bugsByStatus (obj), recentActivity }
      setStats({
        totalUsers: s.totals?.totalUsers ?? 0,
        totalFeedback: s.totals?.totalFeedback ?? 0,
        openBugs: s.totals?.totalBugs ?? 0,
        completedItems: s.feedbackByStatus?.Completed ?? 0,
        feedbackByStatus: Object.entries(s.feedbackByStatus || {}).map(([k, v]) => ({ _id: k, count: v })),
        bugsBySeverity: Object.entries(s.bugsBySeverity || {}).map(([k, v]) => ({ _id: k, count: v })),
      })
      setFeedbackList(s.recentActivity || [])
      // Load bugs
      try {
        const bugsRes = await getBugs({})
        setBugList(bugsRes.data?.bugs || (Array.isArray(bugsRes.data) ? bugsRes.data : []))
      } catch { setBugList([]) }
      setUserList(usersRes.data?.users || (Array.isArray(usersRes.data) ? usersRes.data : []))
      setChangelogList(clRes.data?.changelog || (Array.isArray(clRes.data) ? clRes.data : []))
    } catch {
      showToast('Failed to load admin data', 'error')
    } finally {
      setLoading(false)
    }
  }, [showToast])

  useEffect(() => { fetchAll() }, [fetchAll])

  const handleFeedbackStatus = async (id, status) => {
    setUpdatingStatus(id)
    try {
      await adminUpdateFeedbackStatus(id, { status })
      showToast('Status updated', 'success')
      setFeedbackList(prev => prev.map(f => f._id === id ? { ...f, status } : f))
    } catch { showToast('Failed to update', 'error') }
    finally { setUpdatingStatus(null) }
  }

  const handleBugStatus = async (id, status) => {
    setUpdatingStatus(id)
    try {
      await adminUpdateBugStatus(id, { status })
      showToast('Status updated', 'success')
      setBugList(prev => prev.map(b => b._id === id ? { ...b, status } : b))
    } catch { showToast('Failed to update', 'error') }
    finally { setUpdatingStatus(null) }
  }

  const handleClSave = async () => {
    const f = clForm
    if (!f.version || !f.title || !f.summary || !f.details || !f.releaseDate) {
      showToast('Fill all required fields', 'error'); return
    }
    try {
      if (f._id) {
        await updateChangelog(f._id, f)
        showToast('Entry updated', 'success')
      } else {
        await createChangelog(f)
        showToast('Entry created', 'success')
      }
      setClForm(null)
      const res = await getChangelog()
      setChangelogList(res.data?.changelog || (Array.isArray(res.data) ? res.data : []))
    } catch (err) {
      showToast(err.response?.data?.message || 'Save failed', 'error')
    }
  }

  const handleClDelete = async (id) => {
    try {
      await deleteChangelog(id)
      showToast('Deleted', 'success')
      setDeleteConfirm(null)
      setChangelogList(prev => prev.filter(c => c._id !== id))
    } catch { showToast('Delete failed', 'error') }
  }

  if (loading) return <DashboardLayout><LoadingSpinner /></DashboardLayout>

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <ShieldCheck size={24} style={{ display: 'inline', marginRight: 8, color: 'var(--primary)' }} />
            Admin Studio
          </h1>
          <p className="page-subtitle">Manage feedback, bugs, changelog, and platform settings.</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="admin-tabs">
        {TABS.map(tab => (
          <button
            key={tab}
            className={`admin-tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="admin-section">
          <div className="stats-grid">
            <StatCard icon={Users} label="Total Users" value={stats?.totalUsers} color="#00d2ff" />
            <StatCard icon={MessageSquare} label="Total Feedback" value={stats?.totalFeedback} color="#b388ff" />
            <StatCard icon={Bug} label="Total Bugs" value={stats?.openBugs} color="#ff3366" />
            <StatCard icon={TrendingUp} label="Completed Items" value={stats?.completedItems} color="#06d6a0" />
          </div>

          <div className="admin-two-col">
            <div className="card">
              <div className="card-header"><h3 className="card-title">Feedback by Status</h3></div>
              <div className="card-body">
                {stats?.feedbackByStatus?.map(item => (
                  <div className="stat-row" key={item._id}>
                    <StatusBadge status={item._id} />
                    <span className="stat-row-count">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="card">
              <div className="card-header"><h3 className="card-title">Bugs by Severity</h3></div>
              <div className="card-body">
                {stats?.bugsBySeverity?.map(item => (
                  <div className="stat-row" key={item._id}>
                    <StatusBadge status={item._id} type="severity" />
                    <span className="stat-row-count">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Feedback Tab */}
      {activeTab === 'feedback' && (
        <div className="admin-section">
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Author</th>
                  <th>Votes</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {feedbackList.map(fb => (
                  <tr key={fb._id}>
                    <td className="table-title">{fb.title}</td>
                    <td><span className="badge badge-sm">{fb.category}</span></td>
                    <td className="text-sm text-secondary">{fb.author?.name || '—'}</td>
                    <td className="text-sm">{fb.voteCount ?? 0}</td>
                    <td>
                      <select
                        className="form-select table-select"
                        value={fb.status}
                        disabled={updatingStatus === fb._id}
                        onChange={e => handleFeedbackStatus(fb._id, e.target.value)}
                      >
                        {FEEDBACK_STATUSES.map(s => <option key={s}>{s}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Bugs Tab */}
      {activeTab === 'bugs' && (
        <div className="admin-section">
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Severity</th>
                  <th>Reporter</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {bugList.map(bug => (
                  <tr key={bug._id}>
                    <td className="table-title">{bug.title}</td>
                    <td><StatusBadge status={bug.severity} type="severity" /></td>
                    <td className="text-sm text-secondary">{bug.reporter?.name || '—'}</td>
                    <td className="text-sm text-muted">{formatDate(bug.createdAt)}</td>
                    <td>
                      <select
                        className="form-select table-select"
                        value={bug.status}
                        disabled={updatingStatus === bug._id}
                        onChange={e => handleBugStatus(bug._id, e.target.value)}
                      >
                        {BUG_STATUSES.map(s => <option key={s}>{s}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Changelog Tab */}
      {activeTab === 'changelog' && (
        <div className="admin-section">
          <div className="admin-section-header">
            <h3>Changelog Entries</h3>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => setClForm({ version: '', title: '', summary: '', details: '', releaseDate: '', category: 'Feature' })}
            >
              <Plus size={14} /> New Entry
            </button>
          </div>

          {clForm && (
            <div className="card admin-inline-form">
              <h4 className="mb-3">{clForm._id ? 'Edit Entry' : 'New Entry'}</h4>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Version *</label>
                  <input className="form-input" value={clForm.version} onChange={e => setClForm(f => ({ ...f, version: e.target.value }))} placeholder="v2.4.0" />
                </div>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select className="form-select" value={clForm.category} onChange={e => setClForm(f => ({ ...f, category: e.target.value }))}>
                    {CHANGELOG_CATS.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Title *</label>
                <input className="form-input" value={clForm.title} onChange={e => setClForm(f => ({ ...f, title: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Release Date *</label>
                <input className="form-input" type="date" value={clForm.releaseDate} onChange={e => setClForm(f => ({ ...f, releaseDate: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Summary *</label>
                <input className="form-input" value={clForm.summary} onChange={e => setClForm(f => ({ ...f, summary: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Details *</label>
                <textarea className="form-textarea" rows={5} value={clForm.details} onChange={e => setClForm(f => ({ ...f, details: e.target.value }))} />
              </div>
              <div className="flex gap-2">
                <button className="btn btn-primary btn-sm" onClick={handleClSave}><Check size={14} /> Save</button>
                <button className="btn btn-secondary btn-sm" onClick={() => setClForm(null)}><X size={14} /> Cancel</button>
              </div>
            </div>
          )}

          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr><th>Version</th><th>Title</th><th>Category</th><th>Date</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {changelogList.map(cl => (
                  <tr key={cl._id}>
                    <td><span className="badge">{cl.version}</span></td>
                    <td className="table-title">{cl.title}</td>
                    <td><span className="badge badge-sm">{cl.category}</span></td>
                    <td className="text-sm text-muted">{formatDate(cl.releaseDate)}</td>
                    <td>
                      <div className="flex gap-2">
                        <button
                          className="btn btn-ghost btn-sm btn-icon"
                          onClick={() => setClForm({ ...cl, releaseDate: cl.releaseDate?.slice(0, 10) || '' })}
                        ><Edit2 size={14} /></button>
                        <button
                          className="btn btn-ghost btn-sm btn-icon"
                          style={{ color: 'var(--danger)' }}
                          onClick={() => setDeleteConfirm(cl._id)}
                        ><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="admin-section">
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th></tr>
              </thead>
              <tbody>
                {userList.map(u => (
                  <tr key={u._id}>
                    <td className="font-medium">{u.name}</td>
                    <td className="text-sm text-secondary">{u.email}</td>
                    <td>
                      <span className={`badge ${u.role === 'admin' ? 'badge-admin' : 'badge-user'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="text-sm text-muted">{formatDate(u.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteConfirm}
        title="Delete Changelog Entry"
        message="Delete this changelog entry? This cannot be undone."
        confirmText="Delete"
        isDestructive
        onConfirm={() => handleClDelete(deleteConfirm)}
        onCancel={() => setDeleteConfirm(null)}
      />
    </DashboardLayout>
  )
}
