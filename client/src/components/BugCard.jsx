import StatusBadge from './StatusBadge'

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function getInitials(name) {
  if (!name) return 'U'
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
}

export default function BugCard({ bug, onDelete, onEdit, onStatusChange, isAdmin, isOwner }) {
  const desc = bug.description || ''
  const excerpt = desc.length > 120 ? desc.slice(0, 120) + '…' : desc

  return (
    <div className="bug-card">
      <div className="flex items-center gap-2 flex-wrap">
        <StatusBadge status={bug.severity} />
        <StatusBadge status={bug.status} />
      </div>

      <div>
        <h3
          style={{
            fontSize: '1rem',
            fontWeight: 600,
            color: 'var(--text-primary)',
            marginBottom: '0.375rem',
            lineHeight: 1.4,
          }}
        >
          {bug.title}
        </h3>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          {excerpt}
        </p>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '0.75rem',
          borderTop: '1px solid var(--border)',
          flexWrap: 'wrap',
          gap: '0.5rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.375rem',
            fontSize: '0.8125rem',
            color: 'var(--text-muted)',
          }}
        >
          <div className="user-avatar" style={{ width: 22, height: 22, fontSize: '0.65rem' }}>
            {getInitials(bug.reporter?.name || bug.author?.name)}
          </div>
          <span>{bug.reporter?.name || bug.author?.name || 'Anonymous'}</span>
          <span>·</span>
          <span>{formatDate(bug.createdAt)}</span>
        </div>
        <div className="flex items-center gap-2">
          {(isOwner || isAdmin) && (
            <>
              {onEdit && (
                <button className="btn btn-ghost btn-sm" onClick={() => onEdit(bug)}>
                  Edit
                </button>
              )}
              {onDelete && (
                <button className="btn btn-danger btn-sm" onClick={() => onDelete(bug._id || bug.id)}>
                  Delete
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
