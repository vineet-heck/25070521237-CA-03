import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, MessageSquare, Filter } from 'lucide-react'
import DashboardLayout from '../layouts/DashboardLayout'
import FeedbackCard from '../components/FeedbackCard'
import SkeletonCard from '../components/SkeletonCard'
import EmptyState from '../components/EmptyState'
import SearchBar from '../components/SearchBar'
import { getFeedback } from '../services/api'

const CATEGORIES = ['All', 'Feature', 'Improvement', 'Bug', 'Other']
const STATUSES = ['All', 'Planned', 'Under Review', 'In Progress', 'Completed', 'Declined']
const SORTS = [
  { value: 'newest', label: 'Newest' },
  { value: 'votes', label: 'Most Voted' },
  { value: 'oldest', label: 'Oldest' },
]

export default function FeedbackBoard() {
  const navigate = useNavigate()
  const [feedback, setFeedback] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [status, setStatus] = useState('All')
  const [sort, setSort] = useState('newest')

  const fetchFeedback = useCallback(() => {
    setLoading(true)
    const params = {}
    if (search) params.search = search
    if (category !== 'All') params.category = category.toLowerCase()
    if (status !== 'All') params.status = status.toLowerCase().replace(/\s+/g, '-')
    if (sort) params.sort = sort
    getFeedback(params)
      .then((res) => setFeedback(res.data.feedback || res.data || []))
      .catch(() => setFeedback([]))
      .finally(() => setLoading(false))
  }, [search, category, status, sort])

  useEffect(() => {
    fetchFeedback()
  }, [fetchFeedback])

  return (
    <DashboardLayout>
      <div className="page-header flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="page-title">Feedback Board</h1>
          <p className="page-subtitle">Browse, vote, and comment on product feedback.</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/feedback/new')}>
          <Plus size={16} />
          Submit Feedback
        </button>
      </div>

      {/* Filters */}
      <div className="filter-bar mb-6">
        <SearchBar
          placeholder="Search feedback…"
          onSearch={(val) => setSearch(val)}
        />

        <select
          className="form-select"
          style={{ width: 'auto' }}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          aria-label="Filter by category"
        >
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>

        <select
          className="form-select"
          style={{ width: 'auto' }}
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          aria-label="Filter by status"
        >
          {STATUSES.map((s) => <option key={s}>{s}</option>)}
        </select>

        <select
          className="form-select"
          style={{ width: 'auto' }}
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          aria-label="Sort by"
        >
          {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
      </div>

      {/* Content */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
          <SkeletonCard count={6} />
        </div>
      ) : feedback.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={MessageSquare}
            title="No feedback found"
            description="Be the first to submit feedback or try adjusting your filters."
            actionLabel="Submit Feedback"
            onAction={() => navigate('/feedback/new')}
          />
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {feedback.map((fb) => (
            <FeedbackCard
              key={fb._id || fb.id}
              feedback={fb}
              onVote={fetchFeedback}
            />
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}
