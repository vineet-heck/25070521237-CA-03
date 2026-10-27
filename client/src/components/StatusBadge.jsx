export default function StatusBadge({ status }) {
  if (!status) return null

  const normalized = status.toLowerCase().replace(/\s+/g, '-').replace(/_/g, '-')

  const classMap = {
    planned: 'badge-planned',
    'in-progress': 'badge-in-progress',
    'under-review': 'badge-under-review',
    completed: 'badge-completed',
    declined: 'badge-declined',
    open: 'badge-open',
    resolved: 'badge-resolved',
    critical: 'badge-critical',
    high: 'badge-high',
    medium: 'badge-medium',
    low: 'badge-low',
    feature: 'badge-feature',
    improvement: 'badge-improvement',
    bug: 'badge-bug',
    other: 'badge-other',
    admin: 'badge-admin',
    user: 'badge-user',
  }

  const labelMap = {
    'in-progress': 'In Progress',
    'under-review': 'Under Review',
  }

  const badgeClass = classMap[normalized] || 'badge-other'
  const label = labelMap[normalized] || status.charAt(0).toUpperCase() + status.slice(1)

  return <span className={`badge ${badgeClass}`}>{label}</span>
}
