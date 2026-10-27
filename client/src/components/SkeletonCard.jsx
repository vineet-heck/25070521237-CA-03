export default function SkeletonCard({ count = 1 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="card"
          style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
        >
          <div className="skeleton" style={{ height: '18px', width: '70%' }} />
          <div className="skeleton" style={{ height: '14px', width: '100%' }} />
          <div className="skeleton" style={{ height: '14px', width: '85%' }} />
          <div
            style={{
              display: 'flex',
              gap: '0.5rem',
              alignItems: 'center',
              marginTop: '0.5rem',
            }}
          >
            <div className="skeleton" style={{ height: '22px', width: '70px', borderRadius: '999px' }} />
            <div className="skeleton" style={{ height: '22px', width: '90px', borderRadius: '999px' }} />
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingTop: '0.75rem',
              borderTop: '1px solid var(--border)',
            }}
          >
            <div className="skeleton" style={{ height: '13px', width: '100px' }} />
            <div className="skeleton" style={{ height: '28px', width: '60px', borderRadius: 'var(--radius)' }} />
          </div>
        </div>
      ))}
    </>
  )
}
