import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../layouts/DashboardLayout'
import StatusBadge from '../components/StatusBadge'
import LoadingSpinner from '../components/LoadingSpinner'
import EmptyState from '../components/EmptyState'
import { useToast } from '../context/ToastContext'
import { getSavedItems, toggleSave } from '../services/api'
import { Bookmark, MessageSquare, Bug, ExternalLink, Trash2 } from 'lucide-react'

function formatDate(d) {
  if (!d) return ''
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function SavedItems() {
  const { showToast } = useToast()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [removing, setRemoving] = useState(null)

  const fetchSaved = useCallback(async () => {
    try {
      const res = await getSavedItems()
      // API returns { count, savedItems: [{savedId, itemType, savedAt, item}] }
      const raw = res.data?.savedItems || res.data || []
      // Normalize to { _id, itemId, itemType, itemData, createdAt }
      const normalized = raw.map(s => ({
        _id: s.savedId || s._id,
        itemType: s.itemType,
        itemId: s.item?._id,
        itemData: s.item,
        createdAt: s.savedAt || s.createdAt,
      }))
      setItems(normalized)
    } catch {
      showToast('Failed to load saved items', 'error')
    } finally {
      setLoading(false)
    }
  }, [showToast])

  useEffect(() => { fetchSaved() }, [fetchSaved])

  const handleUnsave = async (item) => {
    setRemoving(item._id)
    try {
      await toggleSave({ itemId: item.itemId, itemType: item.itemType })
      showToast('Removed from saved items', 'success')
      setItems(prev => prev.filter(i => i._id !== item._id))
    } catch {
      showToast('Failed to remove item', 'error')
    } finally {
      setRemoving(null)
    }
  }

  const feedbackItems = items.filter(i => i.itemType === 'feedback')
  const bugItems = items.filter(i => i.itemType === 'bug')

  if (loading) return <DashboardLayout><LoadingSpinner /></DashboardLayout>

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <h1 className="page-title">Saved Items</h1>
          <p className="page-subtitle">Feedback and bug reports you've bookmarked for later.</p>
        </div>
        <span className="badge badge-lg">{items.length} item{items.length !== 1 ? 's' : ''}</span>
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon={Bookmark}
          title="Nothing saved yet"
          description="Save feedback and bug reports to find them here quickly."
          actionLabel="Browse Feedback"
          onAction={() => window.location.href = '/feedback'}
        />
      ) : (
        <div className="saved-sections">
          {feedbackItems.length > 0 && (
            <section className="saved-section">
              <div className="saved-section-header">
                <MessageSquare size={18} style={{ color: 'var(--primary)' }} />
                <h3>Feedback ({feedbackItems.length})</h3>
              </div>
              <div className="saved-list">
                {feedbackItems.map((item) => {
                  const data = item.itemData
                  if (!data) return null
                  return (
                    <div className="card saved-item" key={item._id}>
                      <div className="saved-item-header">
                        <span className="saved-type-badge feedback-type">
                          <MessageSquare size={12} /> Feedback
                        </span>
                        <div className="saved-item-actions">
                          <Link to={`/feedback/${item.itemId}`} className="btn btn-ghost btn-sm btn-icon" title="View">
                            <ExternalLink size={14} />
                          </Link>
                          <button
                            className="btn btn-ghost btn-sm btn-icon"
                            style={{ color: 'var(--danger)' }}
                            disabled={removing === item._id}
                            onClick={() => handleUnsave(item)}
                            title="Remove"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                      <h4 className="saved-item-title">{data.title}</h4>
                      <p className="saved-item-desc">{data.description?.slice(0, 100)}{data.description?.length > 100 ? '…' : ''}</p>
                      <div className="saved-item-footer">
                        <StatusBadge status={data.status} />
                        <span className="badge badge-sm">{data.category}</span>
                        <span className="text-muted text-sm">Saved {formatDate(item.createdAt)}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>
          )}

          {bugItems.length > 0 && (
            <section className="saved-section">
              <div className="saved-section-header">
                <Bug size={18} style={{ color: 'var(--danger)' }} />
                <h3>Bug Reports ({bugItems.length})</h3>
              </div>
              <div className="saved-list">
                {bugItems.map((item) => {
                  const data = item.itemData
                  if (!data) return null
                  return (
                    <div className="card saved-item" key={item._id}>
                      <div className="saved-item-header">
                        <span className="saved-type-badge bug-type">
                          <Bug size={12} /> Bug Report
                        </span>
                        <div className="saved-item-actions">
                          <button
                            className="btn btn-ghost btn-sm btn-icon"
                            style={{ color: 'var(--danger)' }}
                            disabled={removing === item._id}
                            onClick={() => handleUnsave(item)}
                            title="Remove"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                      <h4 className="saved-item-title">{data.title}</h4>
                      <p className="saved-item-desc">{data.description?.slice(0, 100)}{data.description?.length > 100 ? '…' : ''}</p>
                      <div className="saved-item-footer">
                        <StatusBadge status={data.status} />
                        <StatusBadge status={data.severity} type="severity" />
                        <span className="text-muted text-sm">Saved {formatDate(item.createdAt)}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>
          )}
        </div>
      )}
    </DashboardLayout>
  )
}
