import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { MessageSquare, Bug, Map, CheckCircle, Plus, ArrowRight, TrendingUp } from 'lucide-react'
import DashboardLayout from '../layouts/DashboardLayout'
import { getDashboardSummary } from '../services/api'
import { useAuth } from '../context/AuthContext'
import StatusBadge from '../components/StatusBadge'
import LoadingSpinner from '../components/LoadingSpinner'

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function StatCard({ icon: Icon, iconClass, value, label }) {
  return (
    <div className="stat-card">
      <div className={`stat-card-icon ${iconClass}`}>
        <Icon size={22} />
      </div>
      <div>
        <div className="stat-card-value">{value ?? '—'}</div>
        <div className="stat-card-label">{label}</div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getDashboardSummary()
      .then((res) => setData(res.data))
      .catch(() => setData({}))
      .finally(() => setLoading(false))
  }, [])

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">
          Good {getTimeGreeting()}, {user?.name?.split(' ')[0] || 'there'} 👋
        </h1>
        <p className="page-subtitle">Here's what's happening with your product today.</p>
      </div>

      {/* Quick Actions */}
      <div className="flex items-center gap-3 mb-6">
        <button className="btn btn-primary" onClick={() => navigate('/feedback/new')}>
          <Plus size={16} />
          Submit Feedback
        </button>
        <button className="btn btn-secondary" onClick={() => navigate('/bugs')}>
          <Bug size={16} />
          Report a Bug
        </button>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          {/* Stats */}
          <div className="stats-grid mb-6">
            <StatCard
              icon={MessageSquare}
              iconClass="indigo"
              value={data?.totalFeedback ?? data?.stats?.totalFeedback}
              label="Total Feedback"
            />
            <StatCard
              icon={Bug}
              iconClass="red"
              value={data?.openBugs ?? data?.stats?.openBugs}
              label="Open Bugs"
            />
            <StatCard
              icon={Map}
              iconClass="amber"
              value={data?.plannedItems ?? data?.stats?.plannedItems}
              label="Planned Items"
            />
            <StatCard
              icon={CheckCircle}
              iconClass="green"
              value={data?.completedItems ?? data?.stats?.completedItems}
              label="Completed"
            />
          </div>

          <div className="grid-2" style={{ gap: '1.5rem' }}>
            {/* Recent Feedback */}
            <div className="card">
              <div className="card-header">
                <span className="font-semibold flex items-center gap-2">
                  <MessageSquare size={16} /> Recent Feedback
                </span>
                <button className="btn btn-ghost btn-sm" onClick={() => navigate('/feedback')}>
                  View all <ArrowRight size={14} />
                </button>
              </div>
              <div className="card-body" style={{ padding: '0' }}>
                {(data?.recentFeedback || []).length === 0 ? (
                  <p style={{ padding: '1.5rem', color: 'var(--text-muted)', textAlign: 'center', fontSize: '0.9rem' }}>
                    No feedback yet.
                  </p>
                ) : (
                  (data?.recentFeedback || []).slice(0, 5).map((fb, i) => (
                    <div
                      key={fb._id || i}
                      style={{
                        padding: '0.875rem 1.25rem',
                        borderBottom: i < 4 ? '1px solid var(--border)' : 'none',
                        cursor: 'pointer',
                        transition: 'background 0.15s',
                      }}
                      onClick={() => navigate(`/feedback/${fb._id || fb.id}`)}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = '')}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-primary)', flex: 1 }} className="truncate">
                          {fb.title}
                        </span>
                        <StatusBadge status={fb.status} />
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                        {formatDate(fb.createdAt)} · {fb.voteCount ?? 0} votes
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Right column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Trending */}
              <div className="card">
                <div className="card-header">
                  <span className="font-semibold flex items-center gap-2">
                    <TrendingUp size={16} /> Trending
                  </span>
                </div>
                <div style={{ padding: '0' }}>
                  {(data?.trendingFeedback || []).length === 0 ? (
                    <p style={{ padding: '1.5rem', color: 'var(--text-muted)', textAlign: 'center', fontSize: '0.9rem' }}>No trending feedback.</p>
                  ) : (
                    (data?.trendingFeedback || []).slice(0, 3).map((fb, i) => (
                      <div
                        key={fb._id || i}
                        style={{
                          padding: '0.875rem 1.25rem',
                          borderBottom: i < 2 ? '1px solid var(--border)' : 'none',
                          cursor: 'pointer',
                        }}
                        onClick={() => navigate(`/feedback/${fb._id || fb.id}`)}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span style={{ fontSize: '0.875rem', fontWeight: 500, flex: 1 }} className="truncate">
                            {fb.title}
                          </span>
                          <span style={{
                            fontSize: '0.8rem', fontWeight: 700,
                            color: 'var(--primary)', background: 'var(--primary-light)',
                            borderRadius: '999px', padding: '0.1rem 0.5rem',
                          }}>
                            ▲ {fb.voteCount ?? 0}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Recent Changelog */}
              <div className="card">
                <div className="card-header">
                  <span className="font-semibold">Recent Changelog</span>
                  <button className="btn btn-ghost btn-sm" onClick={() => navigate('/changelog')}>
                    View all <ArrowRight size={14} />
                  </button>
                </div>
                <div style={{ padding: '0' }}>
                  {(data?.recentChangelog || []).length === 0 ? (
                    <p style={{ padding: '1.5rem', color: 'var(--text-muted)', textAlign: 'center', fontSize: '0.9rem' }}>No changelog entries.</p>
                  ) : (
                    (data?.recentChangelog || []).slice(0, 3).map((entry, i) => (
                      <div
                        key={entry._id || i}
                        style={{
                          padding: '0.875rem 1.25rem',
                          borderBottom: i < 2 ? '1px solid var(--border)' : 'none',
                        }}
                      >
                        <div style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 700, marginBottom: '0.15rem' }}>
                          {entry.version && `v${entry.version}`}
                        </div>
                        <div style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)' }}>{entry.title}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{formatDate(entry.releaseDate || entry.createdAt)}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  )
}

function getTimeGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'morning'
  if (h < 17) return 'afternoon'
  return 'evening'
}
