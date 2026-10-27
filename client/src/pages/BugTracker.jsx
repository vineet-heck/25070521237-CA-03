import { useState, useEffect, useCallback, useRef } from 'react'
import DashboardLayout from '../layouts/DashboardLayout'
import StatusBadge from '../components/StatusBadge'
import LoadingSpinner from '../components/LoadingSpinner'
import EmptyState from '../components/EmptyState'
import ConfirmModal from '../components/ConfirmModal'
import { useToast } from '../context/ToastContext'
import { useAuth } from '../context/AuthContext'
import { getBugs, createBug, updateBug, deleteBug } from '../services/api'
import { Bug, Plus, X, Search, ChevronDown, ChevronUp, Edit2, Trash2, AlertTriangle } from 'lucide-react'

const SEVERITIES = ['Critical', 'High', 'Medium', 'Low']
const STATUSES = ['Open', 'In Progress', 'Resolved', 'Closed', 'Wont Fix']

function formatDate(d) {
  if (!d) return ''
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const EMPTY_FORM = {
  title: '', description: '', severity: 'Medium',
  stepsToReproduce: '', environment: '',
}

export default function BugTracker() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const [bugs, setBugs] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterSeverity, setFilterSeverity] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [expanded, setExpanded] = useState({})
  const [showForm, setShowForm] = useState(false)
  const [editBug, setEditBug] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [statusUpdating, setStatusUpdating] = useState(null)
  const searchTimer = useRef(null)

  const isAdmin = user?.role === 'admin'

  const fetchBugs = useCallback(async () => {
    try {
      const params = {}
      if (search) params.search = search
      if (filterSeverity) params.severity = filterSeverity
      if (filterStatus) params.status = filterStatus
      const res = await getBugs(params)
      // Backend returns { count, bugs: [...] }
      const bugData = res.data?.bugs || (Array.isArray(res.data) ? res.data : [])
      setBugs(bugData)
    } catch {
      showToast('Failed to load bugs', 'error')
    } finally {
      setLoading(false)
    }
  }, [search, filterSeverity, filterStatus, showToast])

  useEffect(() => {
    clearTimeout(searchTimer.current)
    searchTimer.current = setTimeout(fetchBugs, 300)
    return () => clearTimeout(searchTimer.current)
  }, [fetchBugs])

  const toggleExpand = (id) => setExpanded(p => ({ ...p, [id]: !p[id] }))

  const openCreate = () => { setEditBug(null); setForm(EMPTY_FORM); setShowForm(true) }
  const openEdit = (bug) => {
    setEditBug(bug)
    setForm({
      title: bug.title || '',
      description: bug.description || '',
      severity: bug.severity || 'Medium',
      stepsToReproduce: bug.stepsToReproduce || '',
      environment: bug.environment || '',
    })
    setShowForm(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title || !form.description || !form.severity) {
      showToast('Title, description and severity are required', 'error'); return
    }
    setSaving(true)
    try {
      if (editBug) {
        await updateBug(editBug._id, form)
        showToast('Bug report updated', 'success')
      } else {
        await createBug(form)
        showToast('Bug reported successfully', 'success')
      }
      setShowForm(false)
      fetchBugs()
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteBug(id)
      showToast('Bug report deleted', 'success')
      setDeleteConfirm(null)
      fetchBugs()
    } catch {
      showToast('Failed to delete bug report', 'error')
    }
  }

  const handleStatusChange = async (bugId, status) => {
    setStatusUpdating(bugId)
    try {
      await updateBug(bugId, { status })
      showToast('Status updated', 'success')
      fetchBugs()
    } catch {
      showToast('Failed to update status', 'error')
    } finally {
      setStatusUpdating(null)
    }
  }

  const canEdit = (bug) => isAdmin || bug.reporter?._id === user?._id

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <h1 className="page-title">Bug Tracker</h1>
          <p className="page-subtitle">Report, track, and resolve software issues.</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>
          <Plus size={16} /> Report a Bug
        </button>
      </div>

      {/* Filters */}
      <div className="filter-bar">
        <div className="search-wrapper">
          <Search size={16} className="search-icon" />
          <input
            className="form-input search-input"
            placeholder="Search bugs…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select className="form-select filter-select" value={filterSeverity} onChange={e => setFilterSeverity(e.target.value)}>
          <option value="">All Severities</option>
          {SEVERITIES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select className="form-select filter-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="">All Statuses</option>
          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal" style={{ maxWidth: 540 }}>
            <div className="modal-header">
              <h3>{editBug ? 'Edit Bug Report' : 'Report a Bug'}</h3>
              <button className="btn btn-ghost btn-icon" onClick={() => setShowForm(false)}><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit} className="modal-body">
              <div className="form-group">
                <label className="form-label">Title *</label>
                <input className="form-input" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Brief description of the bug" />
              </div>
              <div className="form-group">
                <label className="form-label">Description *</label>
                <textarea className="form-textarea" rows={4} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="What went wrong? What did you expect to happen?" />
              </div>
              <div className="form-group">
                <label className="form-label">Severity *</label>
                <select className="form-select" value={form.severity} onChange={e => setForm(f => ({ ...f, severity: e.target.value }))}>
                  {SEVERITIES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Steps to Reproduce</label>
                <textarea className="form-textarea" rows={3} value={form.stepsToReproduce} onChange={e => setForm(f => ({ ...f, stepsToReproduce: e.target.value }))} placeholder="1. Go to...&#10;2. Click...&#10;3. See error" />
              </div>
              <div className="form-group">
                <label className="form-label">Environment</label>
                <input className="form-input" value={form.environment} onChange={e => setForm(f => ({ ...f, environment: e.target.value }))} placeholder="e.g. Chrome 120, Windows 11" />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving…' : editBug ? 'Save Changes' : 'Submit Report'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bug List */}
      {loading ? (
        <LoadingSpinner />
      ) : bugs.length === 0 ? (
        <EmptyState
          icon={Bug}
          title="No bugs found"
          description="No bug reports match your current filters."
          actionLabel="Report a Bug"
          onAction={openCreate}
        />
      ) : (
        <div className="bug-list">
          {bugs.map((bug) => {
            const isOpen = expanded[bug._id]
            const mine = canEdit(bug)
            return (
              <div className="card bug-card" key={bug._id}>
                <div className="bug-card-header">
                  <div className="bug-card-title-row">
                    <AlertTriangle size={16} style={{ color: bug.severity === 'Critical' ? 'var(--danger)' : bug.severity === 'High' ? '#F97316' : 'var(--warning)', flexShrink: 0 }} />
                    <h4 className="bug-card-title">{bug.title}</h4>
                  </div>
                  <div className="bug-card-badges">
                    <StatusBadge status={bug.severity} type="severity" />
                    <StatusBadge status={bug.status} />
                  </div>
                </div>

                <p className="bug-card-desc">{bug.description?.slice(0, 120)}{bug.description?.length > 120 ? '…' : ''}</p>

                <div className="bug-card-footer">
                  <div className="bug-meta">
                    <span className="text-muted text-sm">by {bug.reporter?.name || 'Unknown'}</span>
                    <span className="text-muted text-sm">· {formatDate(bug.createdAt)}</span>
                  </div>
                  <div className="flex gap-2">
                    <button className="btn btn-ghost btn-sm" onClick={() => toggleExpand(bug._id)}>
                      {isOpen ? <><ChevronUp size={14} /> Less</> : <><ChevronDown size={14} /> Details</>}
                    </button>
                    {mine && (
                      <>
                        <button className="btn btn-ghost btn-sm btn-icon" onClick={() => openEdit(bug)}><Edit2 size={14} /></button>
                        <button className="btn btn-ghost btn-sm btn-icon" style={{ color: 'var(--danger)' }} onClick={() => setDeleteConfirm(bug._id)}><Trash2 size={14} /></button>
                      </>
                    )}
                  </div>
                </div>

                {isOpen && (
                  <div className="bug-expanded">
                    {bug.stepsToReproduce && (
                      <div className="bug-detail-section">
                        <h5 className="bug-detail-label">Steps to Reproduce</h5>
                        <pre className="bug-detail-pre">{bug.stepsToReproduce}</pre>
                      </div>
                    )}
                    {bug.environment && (
                      <div className="bug-detail-section">
                        <h5 className="bug-detail-label">Environment</h5>
                        <p className="text-sm">{bug.environment}</p>
                      </div>
                    )}
                    {isAdmin && (
                      <div className="bug-detail-section">
                        <h5 className="bug-detail-label">Update Status</h5>
                        <select
                          className="form-select"
                          style={{ width: 'auto' }}
                          value={bug.status}
                          disabled={statusUpdating === bug._id}
                          onChange={e => handleStatusChange(bug._id, e.target.value)}
                        >
                          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteConfirm}
        title="Delete Bug Report"
        message="Are you sure you want to delete this bug report?"
        confirmText="Delete"
        isDestructive
        onConfirm={() => handleDelete(deleteConfirm)}
        onCancel={() => setDeleteConfirm(null)}
      />
    </DashboardLayout>
  )
}
