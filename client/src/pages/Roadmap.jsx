import { useState, useEffect, useCallback } from 'react'
import DashboardLayout from '../layouts/DashboardLayout'
import StatusBadge from '../components/StatusBadge'
import LoadingSpinner from '../components/LoadingSpinner'
import EmptyState from '../components/EmptyState'
import ConfirmModal from '../components/ConfirmModal'
import { useToast } from '../context/ToastContext'
import { useAuth } from '../context/AuthContext'
import { getRoadmap, updateRoadmapStatus } from '../services/api'
import { Map, ThumbsUp } from 'lucide-react'

const COLUMNS = [
  { key: 'Planned', label: 'Planned', color: '#8B5CF6' },
  { key: 'Under Review', label: 'Under Review', color: '#F59E0B' },
  { key: 'In Progress', label: 'In Progress', color: '#3B82F6' },
  { key: 'Completed', label: 'Completed', color: '#10B981' },
]

const STATUS_OPTIONS = ['Planned', 'Under Review', 'In Progress', 'Completed', 'Declined']

export default function Roadmap() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const [grouped, setGrouped] = useState({})
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(null)
  const [confirm, setConfirm] = useState(null)

  const isAdmin = user?.role === 'admin'

  const fetchRoadmap = useCallback(async () => {
    try {
      const res = await getRoadmap()
      // API returns { roadmap: { Planned: [...], ... } }
      setGrouped(res.data.roadmap || res.data)
    } catch {
      showToast('Failed to load roadmap', 'error')
    } finally {
      setLoading(false)
    }
  }, [showToast])

  useEffect(() => {
    fetchRoadmap()
  }, [fetchRoadmap])

  const handleStatusChange = async (itemId, newStatus) => {
    setUpdating(itemId)
    try {
      await updateRoadmapStatus(itemId, { status: newStatus })
      showToast('Status updated successfully', 'success')
      fetchRoadmap()
    } catch {
      showToast('Failed to update status', 'error')
    } finally {
      setUpdating(null)
    }
  }

  if (loading) return <DashboardLayout><LoadingSpinner /></DashboardLayout>

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-title">Product Roadmap</h1>
        <p className="page-subtitle">
          Track planned features, work in progress, and completed improvements.
        </p>
      </div>

      <div className="roadmap-board">
        {COLUMNS.map((col) => {
          const items = grouped[col.key] || []
          return (
            <div className="roadmap-column" key={col.key}>
              <div className="roadmap-column-header" style={{ borderTopColor: col.color }}>
                <span className="roadmap-column-title">{col.label}</span>
                <span
                  className="roadmap-column-count"
                  style={{ backgroundColor: col.color + '20', color: col.color }}
                >
                  {items.length}
                </span>
              </div>

              <div className="roadmap-cards">
                {items.length === 0 ? (
                  <div className="roadmap-empty">No items</div>
                ) : (
                  items.map((item) => (
                    <div className="roadmap-card" key={item._id}>
                      <div className="roadmap-card-category">
                        <span className="badge badge-sm">{item.category}</span>
                      </div>
                      <h4 className="roadmap-card-title">{item.title}</h4>
                      <p className="roadmap-card-desc">
                        {item.description?.slice(0, 90)}
                        {item.description?.length > 90 ? '…' : ''}
                      </p>
                      <div className="roadmap-card-meta">
                        <span className="roadmap-votes">
                          <ThumbsUp size={13} />
                          {item.voteCount ?? 0}
                        </span>
                        {isAdmin && (
                          <select
                            className="form-select roadmap-status-select"
                            value={item.status}
                            disabled={updating === item._id}
                            onChange={(e) => handleStatusChange(item._id, e.target.value)}
                          >
                            {STATUS_OPTIONS.map((s) => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )
        })}
      </div>
    </DashboardLayout>
  )
}
