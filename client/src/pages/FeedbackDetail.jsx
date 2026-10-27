import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Edit2, Trash2, Bookmark, BookmarkCheck } from 'lucide-react'
import DashboardLayout from '../layouts/DashboardLayout'
import StatusBadge from '../components/StatusBadge'
import VoteButton from '../components/VoteButton'
import CommentSection from '../components/CommentSection'
import LoadingSpinner from '../components/LoadingSpinner'
import ConfirmModal from '../components/ConfirmModal'
import { getFeedbackById, voteFeedback, deleteFeedback, updateFeedback, toggleSave, checkSaved } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

function getInitials(name) {
  if (!name) return 'U'
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
}

const STATUSES = ['planned', 'under-review', 'in-progress', 'completed', 'declined']

export default function FeedbackDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const { showToast } = useToast()

  const [feedback, setFeedback] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [voting, setVoting] = useState(false)
  const [voted, setVoted] = useState(false)
  const [saved, setSaved] = useState(false)
  const [savingToggle, setSavingToggle] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [editing, setEditing] = useState(false)
  const [editForm, setEditForm] = useState({ title: '', description: '', status: '' })
  const [editLoading, setEditLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    getFeedbackById(id)
      .then((res) => {
        const fb = res.data.feedback || res.data
        setFeedback(fb)
        setVoted(fb.voters?.includes(user?._id || user?.id) || fb.userVoted || false)
        setEditForm({ title: fb.title, description: fb.description, status: fb.status || 'planned' })
      })
      .catch((err) => {
        if (err.response?.status === 404) setNotFound(true)
      })
      .finally(() => setLoading(false))
  }, [id, user])

  useEffect(() => {
    if (!isAuthenticated || !id) return
    checkSaved({ itemId: id, itemType: 'feedback' })
      .then((res) => setSaved(res.data.saved || false))
      .catch(() => {})
  }, [id, isAuthenticated])

  const handleVote = async () => {
    if (!isAuthenticated) { showToast('Please log in to vote.', 'info'); return }
    setVoting(true)
    try {
      const res = await voteFeedback(id)
      const updated = res.data.feedback || res.data
      setFeedback((p) => ({ ...p, voteCount: updated.voteCount ?? updated.votes }))
      setVoted((v) => !v)
    } catch { showToast('Vote failed.', 'error') }
    finally { setVoting(false) }
  }

  const handleToggleSave = async () => {
    if (!isAuthenticated) { showToast('Please log in to save items.', 'info'); return }
    setSavingToggle(true)
    try {
      await toggleSave({ itemId: id, itemType: 'feedback' })
      setSaved((s) => !s)
      showToast(saved ? 'Removed from saved items.' : 'Saved!', 'success')
    } catch { showToast('Failed to save item.', 'error') }
    finally { setSavingToggle(false) }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await deleteFeedback(id)
      showToast('Feedback deleted.', 'success')
      navigate('/feedback')
    } catch { showToast('Delete failed.', 'error'); setDeleting(false) }
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()
    if (!editForm.title.trim()) { showToast('Title is required.', 'error'); return }
    setEditLoading(true)
    try {
      const res = await updateFeedback(id, {
        title: editForm.title.trim(),
        description: editForm.description.trim(),
        status: editForm.status,
      })
      setFeedback(res.data.feedback || res.data)
      setEditing(false)
      showToast('Feedback updated!', 'success')
    } catch { showToast('Update failed.', 'error') }
    finally { setEditLoading(false) }
  }

  const isOwner = user && feedback && (
    (feedback.author?._id || feedback.author?.id || feedback.author) === (user._id || user.id)
  )
  const isAdmin = user?.role === 'admin'

  if (loading) return <DashboardLayout><LoadingSpinner /></DashboardLayout>

  if (notFound) {
    return (
      <DashboardLayout>
        <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔍</div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>Feedback not found</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>This feedback item doesn't exist or was removed.</p>
          <button className="btn btn-primary" onClick={() => navigate('/feedback')}>Back to Board</button>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <button className="btn btn-ghost btn-sm mb-4" onClick={() => navigate('/feedback')}>
        <ArrowLeft size={15} /> Back to Board
      </button>

      <div style={{ maxWidth: 760 }}>
        {editing ? (
          <div className="card mb-4">
            <div className="card-header">
              <h2 style={{ fontWeight: 600 }}>Edit Feedback</h2>
            </div>
            <div className="card-body">
              <form onSubmit={handleEditSubmit}>
                <div className="form-group">
                  <label className="form-label">Title</label>
                  <input
                    className="form-input"
                    value={editForm.title}
                    onChange={(e) => setEditForm((p) => ({ ...p, title: e.target.value }))}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-textarea"
                    rows={5}
                    value={editForm.description}
                    onChange={(e) => setEditForm((p) => ({ ...p, description: e.target.value }))}
                  />
                </div>
                {isAdmin && (
                  <div className="form-group">
                    <label className="form-label">Status</label>
                    <select
                      className="form-select"
                      value={editForm.status}
                      onChange={(e) => setEditForm((p) => ({ ...p, status: e.target.value }))}
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>{s.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}</option>
                      ))}
                    </select>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <button type="submit" className="btn btn-primary" disabled={editLoading}>
                    {editLoading ? <span className="spinner spinner-sm" /> : null}
                    Save Changes
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={() => setEditing(false)}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          <div className="card mb-4">
            <div className="card-body">
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <StatusBadge status={feedback?.category} />
                <StatusBadge status={feedback?.status} />
                {feedback?.tags?.map((tag) => (
                  <span key={tag} style={{ fontSize: '0.75rem', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '999px', padding: '0.1rem 0.5rem', color: 'var(--text-secondary)' }}>
                    #{tag}
                  </span>
                ))}
              </div>

              <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem', lineHeight: 1.3 }}>
                {feedback?.title}
              </h1>

              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.75, marginBottom: '1.5rem', whiteSpace: 'pre-wrap' }}>
                {feedback?.description}
              </p>

              <div className="flex items-center gap-3 flex-wrap" style={{ paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                <div className="flex items-center gap-2" style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                  <div className="user-avatar user-avatar-sm">
                    {getInitials(feedback?.author?.name)}
                  </div>
                  <span>{feedback?.author?.name || 'Anonymous'}</span>
                  <span>·</span>
                  <span>{formatDate(feedback?.createdAt)}</span>
                </div>

                <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <VoteButton
                    count={feedback?.voteCount ?? 0}
                    voted={voted}
                    loading={voting}
                    onVote={handleVote}
                  />
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={handleToggleSave}
                    disabled={savingToggle}
                    title={saved ? 'Remove from saved' : 'Save this feedback'}
                  >
                    {saved ? <BookmarkCheck size={15} /> : <Bookmark size={15} />}
                    {saved ? 'Saved' : 'Save'}
                  </button>
                  {(isOwner || isAdmin) && (
                    <>
                      <button className="btn btn-secondary btn-sm" onClick={() => setEditing(true)}>
                        <Edit2 size={14} /> Edit
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => setShowConfirm(true)}>
                        <Trash2 size={14} /> Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Comments */}
        <div className="card">
          <div className="card-body">
            <CommentSection feedbackId={id} />
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={showConfirm}
        title="Delete Feedback"
        message="Are you sure you want to delete this feedback? This action cannot be undone."
        confirmText="Delete"
        isDestructive
        onConfirm={handleDelete}
        onCancel={() => setShowConfirm(false)}
      />
    </DashboardLayout>
  )
}
