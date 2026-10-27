import { ThumbsUp } from 'lucide-react'

export default function VoteButton({ count = 0, voted = false, loading = false, onVote, disabled }) {
  return (
    <button
      className={`vote-btn${voted ? ' voted' : ''}`}
      onClick={onVote}
      disabled={loading || disabled}
      aria-label={voted ? 'Remove vote' : 'Vote for this'}
      title={voted ? 'Remove vote' : 'Upvote'}
    >
      {loading ? (
        <span className="spinner spinner-sm" style={{ borderTopColor: 'var(--primary)' }} />
      ) : (
        <ThumbsUp size={14} fill={voted ? 'currentColor' : 'none'} />
      )}
      <span>{count}</span>
    </button>
  )
}
