import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  MessageSquare,
  Bug,
  Map,
  CheckCircle,
  Plus,
  ArrowRight,
  TrendingUp,
  ThumbsUp,
  BookOpen,
} from 'lucide-react'
import DashboardLayout from '../layouts/DashboardLayout'
import { getDashboardSummary } from '../services/api'
import { useAuth } from '../context/AuthContext'
import StatusBadge from '../components/StatusBadge'
import LoadingSpinner from '../components/LoadingSpinner'

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

function getTimeGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'morning'
  if (h < 17) return 'afternoon'
  return 'evening'
}

function StatCard({ icon: Icon, iconClass, value, label }) {
  return (
    <div className="stat-card">
      <div className={`stat-card-icon ${iconClass}`}>
        <Icon size={22} />
      </div>
      <div>
        <div className="stat-card-value">{value ?? '0'}</div>
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
      {/* Header with Greeting & Action Buttons */}
      <div
        className="page-header"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.75rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <h1 className="page-title">
            Good {getTimeGreeting()}, {user?.name?.split(' ')[0] || 'there'} 👋
          </h1>
          <p className="page-subtitle">Here's what's happening with your product today.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn btn-primary" onClick={() => navigate('/feedback/new')}>
            <Plus size={16} />
            Submit Feedback
          </button>
          <button className="btn btn-secondary" onClick={() => navigate('/bugs')}>
            <Bug size={16} />
            Report a Bug
          </button>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          {/* Stat Cards Grid */}
          <div className="stats-grid mb-6">
            <StatCard
              icon={MessageSquare}
              iconClass="indigo"
              value={data?.totalFeedback}
              label="Total Feedback"
            />
            <StatCard
              icon={Bug}
              iconClass="red"
              value={data?.openBugs}
              label="Open Bugs"
            />
            <StatCard
              icon={Map}
              iconClass="amber"
              value={data?.plannedItems}
              label="Planned Items"
            />
            <StatCard
              icon={CheckCircle}
              iconClass="green"
              value={data?.completedItems}
              label="Completed"
            />
          </div>

          {/* Main 2-Column Dashboard Grid: Perfectly formatted */}
          <div className="grid-2" style={{ gap: '1.5rem', alignItems: 'start' }}>
            {/* Left Column: Recent Feedback & Most Voted Feature Requests */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* 1. Recent Feedback */}
              <div className="card">
                <div className="card-header">
                  <span className="font-semibold flex items-center gap-2">
                    <MessageSquare size={16} style={{ color: 'var(--primary)' }} />
                    Recent Feedback
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
                    (data?.recentFeedback || []).slice(0, 5).map((fb, i, arr) => (
                      <div
                        key={fb._id || i}
                        style={{
                          padding: '0.875rem 1.25rem',
                          borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '0.75rem',
                          transition: 'background 0.15s ease',
                        }}
                        onClick={() => navigate(`/feedback/${fb._id || fb.id}`)}
                        onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg)')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                      >
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }} className="truncate">
                              {fb.title}
                            </span>
                            <StatusBadge status={fb.status} />
                          </div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ background: 'var(--bg)', padding: '0.1rem 0.45rem', borderRadius: '4px', fontSize: '0.75rem', border: '1px solid var(--border)' }}>
                              {fb.category}
                            </span>
                            <span>•</span>
                            <span>{fb.author?.name || 'Community Member'}</span>
                            <span>•</span>
                            <span>{formatDate(fb.createdAt)}</span>
                          </div>
                        </div>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          fontSize: '0.85rem',
                          fontWeight: 600,
                          color: 'var(--text-secondary)',
                          background: 'var(--bg)',
                          border: '1px solid var(--border)',
                          padding: '0.3rem 0.6rem',
                          borderRadius: '8px',
                          flexShrink: 0,
                        }}>
                          <ThumbsUp size={13} />
                          <span>{fb.voteCount ?? 0}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* 2. Most Voted Feature Requests */}
              <div className="card">
                <div className="card-header">
                  <span className="font-semibold flex items-center gap-2">
                    <TrendingUp size={16} style={{ color: 'var(--success)' }} />
                    Most Voted Feature Requests
                  </span>
                  <button className="btn btn-ghost btn-sm" onClick={() => navigate('/feedback?sort=most-voted')}>
                    View all <ArrowRight size={14} />
                  </button>
                </div>
                <div className="card-body" style={{ padding: '0' }}>
                  {(data?.trendingFeedback || []).length === 0 ? (
                    <p style={{ padding: '1.5rem', color: 'var(--text-muted)', textAlign: 'center', fontSize: '0.9rem' }}>
                      No trending feedback yet.
                    </p>
                  ) : (
                    (data?.trendingFeedback || []).slice(0, 4).map((fb, i, arr) => (
                      <div
                        key={fb._id || i}
                        style={{
                          padding: '0.875rem 1.25rem',
                          borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '0.75rem',
                          transition: 'background 0.15s ease',
                        }}
                        onClick={() => navigate(`/feedback/${fb._id || fb.id}`)}
                        onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg)')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: 0 }}>
                          <span style={{
                            fontSize: '0.82rem',
                            fontWeight: 700,
                            color: i === 0 ? '#F59E0B' : i === 1 ? '#6B7280' : '#B45309',
                            width: '22px',
                            textAlign: 'center',
                            flexShrink: 0,
                          }}>
                            #{i + 1}
                          </span>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                              <span style={{ fontSize: '0.885rem', fontWeight: 600, color: 'var(--text-primary)' }} className="truncate">
                                {fb.title}
                              </span>
                              <StatusBadge status={fb.status} />
                            </div>
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                              {fb.category}
                            </div>
                          </div>
                        </div>
                        <span style={{
                          fontSize: '0.82rem',
                          fontWeight: 700,
                          color: 'var(--primary)',
                          background: 'var(--primary-light)',
                          border: '1px solid rgba(85, 88, 217, 0.18)',
                          borderRadius: '999px',
                          padding: '0.2rem 0.65rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          flexShrink: 0,
                        }}>
                          ▲ {fb.voteCount ?? 0}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Roadmap Status & Recent Releases */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* 3. Roadmap Status */}
              <div className="card">
                <div className="card-header">
                  <span className="font-semibold flex items-center gap-2">
                    <Map size={16} style={{ color: 'var(--primary)' }} />
                    Roadmap Status
                  </span>
                  <button className="btn btn-ghost btn-sm" onClick={() => navigate('/roadmap')}>
                    View Roadmap <ArrowRight size={14} />
                  </button>
                </div>
                <div className="card-body" style={{ padding: '1.25rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    {[
                      { key: 'Planned', label: 'Planned', count: data?.roadmapStats?.Planned ?? 0, color: '#8B5CF6' },
                      { key: 'In Progress', label: 'In Progress', count: data?.roadmapStats?.['In Progress'] ?? 0, color: '#3B82F6' },
                      { key: 'Under Review', label: 'Under Review', count: data?.roadmapStats?.['Under Review'] ?? 0, color: '#F59E0B' },
                      { key: 'Completed', label: 'Completed', count: data?.roadmapStats?.Completed ?? 0, color: '#10B981' },
                    ].map((col) => (
                      <div
                        key={col.key}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0.75rem 1rem',
                          borderRadius: '8px',
                          background: 'var(--bg)',
                          border: '1px solid var(--border)',
                          cursor: 'pointer',
                          transition: 'border-color 0.15s ease, transform 0.15s ease, background 0.15s ease',
                        }}
                        onClick={() => navigate('/roadmap')}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = col.color
                          e.currentTarget.style.background = '#FFFFFF'
                          e.currentTarget.style.transform = 'translateX(3px)'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = 'var(--border)'
                          e.currentTarget.style.background = 'var(--bg)'
                          e.currentTarget.style.transform = 'none'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                          <span
                            style={{
                              width: '10px',
                              height: '10px',
                              borderRadius: '50%',
                              backgroundColor: col.color,
                              display: 'inline-block',
                            }}
                          />
                          <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                            {col.label}
                          </span>
                        </div>
                        <span
                          style={{
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            color: 'var(--text-secondary)',
                            background: 'var(--surface)',
                            border: '1px solid var(--border)',
                            padding: '0.15rem 0.6rem',
                            borderRadius: '999px',
                          }}
                        >
                          {col.count} items
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 4. Recent Releases */}
              <div className="card">
                <div className="card-header">
                  <span className="font-semibold flex items-center gap-2">
                    <BookOpen size={16} style={{ color: 'var(--primary)' }} />
                    Recent Releases
                  </span>
                  <button className="btn btn-ghost btn-sm" onClick={() => navigate('/changelog')}>
                    View Changelog <ArrowRight size={14} />
                  </button>
                </div>
                <div className="card-body" style={{ padding: '0' }}>
                  {(data?.recentChangelog || []).length === 0 ? (
                    <p style={{ padding: '1.5rem', color: 'var(--text-muted)', textAlign: 'center', fontSize: '0.9rem' }}>
                      No changelog entries yet.
                    </p>
                  ) : (
                    (data?.recentChangelog || []).slice(0, 3).map((entry, i, arr) => (
                      <div
                        key={entry._id || i}
                        style={{
                          padding: '0.875rem 1.25rem',
                          borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none',
                          cursor: 'pointer',
                          transition: 'background 0.15s ease',
                        }}
                        onClick={() => navigate('/changelog')}
                        onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg)')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                      >
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: '0.25rem',
                          }}
                        >
                          <span
                            style={{
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              color: 'var(--primary)',
                              background: 'var(--primary-light)',
                              padding: '0.15rem 0.55rem',
                              borderRadius: '4px',
                            }}
                          >
                            {entry.version
                              ? entry.version.startsWith('v')
                                ? entry.version
                                : `v${entry.version}`
                              : 'v1.0.0'}
                          </span>
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                            {formatDate(entry.releaseDate || entry.createdAt)}
                          </span>
                        </div>
                        <div
                          style={{
                            fontSize: '0.885rem',
                            fontWeight: 600,
                            color: 'var(--text-primary)',
                            marginBottom: '0.2rem',
                          }}
                        >
                          {entry.title}
                        </div>
                        {entry.summary && (
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                            {entry.summary}
                          </div>
                        )}
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
