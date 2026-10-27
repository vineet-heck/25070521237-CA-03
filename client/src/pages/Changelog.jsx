import { useState, useEffect, useCallback } from 'react'
import DashboardLayout from '../layouts/DashboardLayout'
import LoadingSpinner from '../components/LoadingSpinner'
import EmptyState from '../components/EmptyState'
import ConfirmModal from '../components/ConfirmModal'
import { useToast } from '../context/ToastContext'
import { useAuth } from '../context/AuthContext'
import {
  getChangelog,
  createChangelog,
  updateChangelog,
  deleteChangelog,
} from '../services/api'
import { BookOpen, Plus, Edit2, Trash2, X, ChevronDown, ChevronUp } from 'lucide-react'

const CATEGORIES = ['Feature', 'Improvement', 'Bug Fix', 'Performance', 'Security', 'Breaking Change']

const CATEGORY_COLORS = {
  Feature: '#4F46E5',
  Improvement: '#0EA5E9',
  'Bug Fix': '#10B981',
  Performance: '#F59E0B',
  Security: '#EF4444',
  'Breaking Change': '#DC2626',
}

function formatDate(d) {
  if (!d) return ''
  return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

const EMPTY_FORM = { version: '', title: '', summary: '', details: '', releaseDate: '', category: 'Feature' }

export default function Changelog() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState({})
  const [showForm, setShowForm] = useState(false)
  const [editEntry, setEditEntry] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const isAdmin = user?.role === 'admin'

  const fetchChangelog = useCallback(async () => {
    try {
      const res = await getChangelog()
      setEntries(res.data)
    } catch {
      showToast('Failed to load changelog', 'error')
    } finally {
      setLoading(false)
    }
  }, [showToast])

  useEffect(() => { fetchChangelog() }, [fetchChangelog])

  const toggleExpand = (id) =>
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }))

  const openCreate = () => {
    setEditEntry(null)
    setForm(EMPTY_FORM)
    setShowForm(true)
  }

  const openEdit = (entry) => {
    setEditEntry(entry)
    setForm({
      version: entry.version || '',
      title: entry.title || '',
      summary: entry.summary || '',
      details: entry.details || '',
      releaseDate: entry.releaseDate ? entry.releaseDate.slice(0, 10) : '',
      category: entry.category || 'Feature',
    })
    setShowForm(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.version || !form.title || !form.summary || !form.details || !form.releaseDate) {
      showToast('Please fill in all required fields', 'error')
      return
    }
    setSaving(true)
    try {
      if (editEntry) {
        await updateChangelog(editEntry._id, form)
        showToast('Changelog entry updated', 'success')
      } else {
        await createChangelog(form)
        showToast('Changelog entry created', 'success')
      }
      setShowForm(false)
      fetchChangelog()
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save entry', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteChangelog(id)
      showToast('Entry deleted', 'success')
      setDeleteConfirm(null)
      fetchChangelog()
    } catch {
      showToast('Failed to delete entry', 'error')
    }
  }

  if (loading) return <DashboardLayout><LoadingSpinner /></DashboardLayout>

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <h1 className="page-title">Changelog</h1>
          <p className="page-subtitle">Track what's new, improved, and fixed in each release.</p>
        </div>
        {isAdmin && (
          <button className="btn btn-primary" onClick={openCreate}>
            <Plus size={16} /> New Entry
          </button>
        )}
      </div>

      {/* Create / Edit Form */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal" style={{ maxWidth: 560 }}>
            <div className="modal-header">
              <h3>{editEntry ? 'Edit Changelog Entry' : 'New Changelog Entry'}</h3>
              <button className="btn btn-ghost btn-icon" onClick={() => setShowForm(false)}><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit} className="modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Version *</label>
                  <input className="form-input" value={form.version} onChange={e => setForm(f => ({ ...f, version: e.target.value }))} placeholder="e.g. v2.4.0" />
                </div>
                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select className="form-select" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Title *</label>
                <input className="form-input" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Release title" />
              </div>
              <div className="form-group">
                <label className="form-label">Release Date *</label>
                <input className="form-input" type="date" value={form.releaseDate} onChange={e => setForm(f => ({ ...f, releaseDate: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Summary *</label>
                <input className="form-input" value={form.summary} onChange={e => setForm(f => ({ ...f, summary: e.target.value }))} placeholder="One-line summary" />
              </div>
              <div className="form-group">
                <label className="form-label">Details *</label>
                <textarea className="form-textarea" rows={6} value={form.details} onChange={e => setForm(f => ({ ...f, details: e.target.value }))} placeholder="Full release notes..." />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving…' : editEntry ? 'Save Changes' : 'Create Entry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Entries */}
      {entries.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No changelog entries yet"
          description="Release notes will appear here once entries are added."
        />
      ) : (
        <div className="changelog-timeline">
          {entries.map((entry) => {
            const catColor = CATEGORY_COLORS[entry.category] || '#4F46E5'
            const isOpen = expanded[entry._id]
            return (
              <div className="changelog-entry" key={entry._id}>
                <div className="changelog-dot" style={{ backgroundColor: catColor }} />
                <div className="card changelog-card">
                  <div className="changelog-card-header">
                    <div className="changelog-meta">
                      <span className="changelog-version">{entry.version}</span>
                      <span
                        className="badge"
                        style={{ backgroundColor: catColor + '20', color: catColor, border: 'none' }}
                      >
                        {entry.category}
                      </span>
                      <span className="text-muted text-sm">{formatDate(entry.releaseDate)}</span>
                    </div>
                    {isAdmin && (
                      <div className="flex gap-2">
                        <button className="btn btn-ghost btn-icon btn-sm" onClick={() => openEdit(entry)}>
                          <Edit2 size={14} />
                        </button>
                        <button
                          className="btn btn-ghost btn-icon btn-sm"
                          style={{ color: 'var(--danger)' }}
                          onClick={() => setDeleteConfirm(entry._id)}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                  <h3 className="changelog-title">{entry.title}</h3>
                  <p className="changelog-summary">{entry.summary}</p>
                  {entry.details && (
                    <>
                      <button
                        className="btn btn-ghost btn-sm changelog-expand-btn"
                        onClick={() => toggleExpand(entry._id)}
                      >
                        {isOpen ? <><ChevronUp size={14} /> Hide details</> : <><ChevronDown size={14} /> Show details</>}
                      </button>
                      {isOpen && (
                        <div className="changelog-details">
                          <pre>{entry.details}</pre>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteConfirm}
        title="Delete Entry"
        message="Are you sure you want to delete this changelog entry? This cannot be undone."
        confirmText="Delete"
        isDestructive
        onConfirm={() => handleDelete(deleteConfirm)}
        onCancel={() => setDeleteConfirm(null)}
      />
    </DashboardLayout>
  )
}
