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
  Sparkles,
  Calendar,
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

function StatCard({ icon: Icon, iconClass, value, label, subtext }) {
  return (
    <div className="stat-card">
      <div className={`stat-card-icon ${iconClass}`}>
        <Icon size={22} />
      </div>
      <div className="stat-card-content">
        <div className="stat-card-value">{value ?? '0'}</div>
        <div className="stat-card-label">{label}</div>
        {subtext && <div className="stat-card-sub">{subtext}</div>}
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

  const todayStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  })

  return (
    <DashboardLayout>
      {/* Hero Welcome Banner */}
      <div className="dashboard-hero">
        <div className="hero-content">
          <div className="hero-tag">
            <Calendar size={13} />
            <span>{todayStr}</span>
          </div>
          <h1 className="hero-title">
            Good {getTimeGreeting()}, {user?.name?.split(' ')[0] || 'there'} 👋
          </h1>
          <p className="hero-subtitle">
            Here's what's happening with your product backlog, user feedback, and release pipeline.
          </p>
        </div>

        <div className="hero-actions">
          <button
            className="btn btn-primary"
            onClick={() => navigate('/feedback/new')}
          >
            <Plus size={16} />
            <span>Submit Feedback</span>
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => navigate('/bugs')}
          >
            <Bug size={16} />
            <span>Report Bug</span>
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
              subtext="User feature requests"
            />
            <StatCard
              icon={Bug}
              iconClass="red"
              value={data?.openBugs}
              label="Active Bugs"
              subtext="Open & In Progress"
            />
            <StatCard
              icon={Map}
              iconClass="amber"
              value={data?.plannedItems}
              label="Planned Work"
              subtext="Scheduled for release"
            />
            <StatCard
              icon={CheckCircle}
              iconClass="green"
              value={data?.completedItems}
              label="Delivered"
              subtext="Shipped improvements"
            />
          </div>

          {/* Main 2-Column Dashboard Grid */}
          <div className="dashboard-grid">
            {/* Left Column: Recent Feedback & Trending */}
            <div className="dashboard-left-col">
              {/* Recent Feedback Feed */}
              <div className="card">
                <div className="card-header flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageSquare size={17} className="text-primary-color" />
                    <span className="font-semibold text-primary-color">Recent Feedback</span>
                  </div>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => navigate('/feedback')}
                  >
                    <span>View Board</span>
                    <ArrowRight size={14} />
                  </button>
                </div>

                <div className="card-body p-0">
                  {(data?.recentFeedback || []).length === 0 ? (
                    <div className="empty-p">No feedback items yet.</div>
                  ) : (
                    (data?.recentFeedback || []).slice(0, 5).map((fb, i) => (
                      <div
                        key={fb._id || i}
                        className="feed-item"
                        onClick={() => navigate(`/feedback/${fb._id || fb.id}`)}
                      >
                        <div className="feed-item-main">
                          <div className="feed-item-title-row">
                            <span className="feed-item-title">{fb.title}</span>
                            <StatusBadge status={fb.status} />
                          </div>
                          <div className="feed-item-meta">
                            <span className="meta-badge">{fb.category}</span>
                            <span>•</span>
                            <span>{fb.author?.name || 'Community Member'}</span>
                            <span>•</span>
                            <span>{formatDate(fb.createdAt)}</span>
                          </div>
                        </div>
                        <div className="feed-item-votes">
                          <ThumbsUp size={13} />
                          <span>{fb.voteCount ?? 0}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Trending Feedback */}
              <div className="card mt-4">
                <div className="card-header flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp size={17} style={{ color: '#10B981' }} />
                    <span className="font-semibold">Most Voted Feature Requests</span>
                  </div>
                  <span className="badge badge-sm badge-feature">Top Community Picks</span>
                </div>

                <div className="card-body p-0">
                  {(data?.trendingFeedback || []).length === 0 ? (
                    <div className="empty-p">No trending items yet.</div>
                  ) : (
                    (data?.trendingFeedback || []).slice(0, 4).map((fb, i) => (
                      <div
                        key={fb._id || i}
                        className="feed-item"
                        onClick={() => navigate(`/feedback/${fb._id || fb.id}`)}
                      >
                        <div className="trending-rank">#{i + 1}</div>
                        <div className="feed-item-main">
                          <div className="feed-item-title-row">
                            <span className="feed-item-title">{fb.title}</span>
                            <StatusBadge status={fb.status} />
                          </div>
                          <div className="feed-item-meta">
                            <span className="meta-badge">{fb.category}</span>
                          </div>
                        </div>
                        <div className="trending-vote-chip">
                          <ThumbsUp size={13} />
                          <span className="font-bold">{fb.voteCount ?? 0}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Roadmap Overview & Recent Changelog */}
            <div className="dashboard-right-col">
              {/* Roadmap Overview */}
              <div className="card">
                <div className="card-header flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Map size={17} className="text-primary-color" />
                    <span className="font-semibold">Roadmap Status</span>
                  </div>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => navigate('/roadmap')}
                  >
                    <span>Full Roadmap</span>
                    <ArrowRight size={14} />
                  </button>
                </div>

                <div className="card-body">
                  <div className="roadmap-status-list">
                    {[
                      { key: 'Planned', label: 'Planned', count: data?.roadmapStats?.Planned ?? 0, color: '#8B5CF6' },
                      { key: 'In Progress', label: 'In Progress', count: data?.roadmapStats?.['In Progress'] ?? 0, color: '#3B82F6' },
                      { key: 'Under Review', label: 'Under Review', count: data?.roadmapStats?.['Under Review'] ?? 0, color: '#F59E0B' },
                      { key: 'Completed', label: 'Completed', count: data?.roadmapStats?.Completed ?? 0, color: '#10B981' },
                    ].map((col) => (
                      <div
                        key={col.key}
                        className="roadmap-status-row"
                        onClick={() => navigate('/roadmap')}
                      >
                        <div className="flex items-center gap-2">
                          <span className="status-dot" style={{ backgroundColor: col.color }} />
                          <span className="status-row-label">{col.label}</span>
                        </div>
                        <span className="status-row-pill">{col.count} items</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recent Release Notes */}
              <div className="card mt-4">
                <div className="card-header flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BookOpen size={17} className="text-primary-color" />
                    <span className="font-semibold">Recent Releases</span>
                  </div>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => navigate('/changelog')}
                  >
                    <span>Changelog</span>
                    <ArrowRight size={14} />
                  </button>
                </div>

                <div className="card-body p-0">
                  {(data?.recentChangelog || []).length === 0 ? (
                    <div className="empty-p">No changelog entries yet.</div>
                  ) : (
                    (data?.recentChangelog || []).slice(0, 3).map((entry, i) => (
                      <div
                        key={entry._id || i}
                        className="changelog-widget-item"
                        onClick={() => navigate('/changelog')}
                      >
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="changelog-widget-version">{entry.version}</span>
                          <span className="text-muted text-xs">{formatDate(entry.releaseDate)}</span>
                        </div>
                        <div className="changelog-widget-title">{entry.title}</div>
                        <div className="changelog-widget-summary">{entry.summary}</div>
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
