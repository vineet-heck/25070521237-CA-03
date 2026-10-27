export default function LoadingSpinner({ size = 'md', fullPage = false }) {
  const spinnerClass = `spinner${size === 'sm' ? ' spinner-sm' : size === 'lg' ? ' spinner-lg' : ''}`

  if (fullPage) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
        }}
      >
        <div className={spinnerClass} />
      </div>
    )
  }

  return (
    <div className="loading-center">
      <div className={spinnerClass} />
    </div>
  )
}
