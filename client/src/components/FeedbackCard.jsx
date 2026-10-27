import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MessageCircle } from 'lucide-react'
import StatusBadge from './StatusBadge'
import VoteButton from './VoteButton'
import { voteFeedback } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function getInitials(name) {
  if (!name) return 'U'
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
}

export default function FeedbackCard({ feedback, onVote, showVoteButton = true }) {
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const { showToast } = useToast()
  const [voting, setVoting] = useState(false)
  const [localVotes, setLocalVotes] = useState(feedback.voteCount ?? feedback.votes ?? 0)
  const [localVoted, setLocalVoted] = useState(
    feedback.votes?.some(id => (id._id || id).toString() === (user?._id || user?.id)?.toString()) ||
    feedback.voters?.includes(user?._id || user?.id) ||
    feedback.userVoted ||
    false
  )

  const handleVote = async (e) => {
    e.stopPropagation()
    if (!isAuthenticated) {
      showToast('Please log in to vote.', 'info')
      return
    }
    setVoting(true)
    try {
      const res = await voteFeedback(feedback._id || feedback.id)
      const count = res.data.voteCount ?? (res.data.feedback?.voteCount) ?? localVotes
      const voted = res.data.voted !== undefined ? res.data.voted : !localVoted
      setLocalVotes(count)
      setLocalVoted(voted)
      if (onVote) onVote(res.data.feedback || res.data)
    } catch {
      showToast('Failed to vote. Try again.', 'error')
    } finally {
      setVoting(false)
    }
  }

  const desc = feedback.description || ''
  const excerpt = desc.length > 120 ? desc.slice(0, 120) + '…' : desc

  return (
    <div className="feedback-card">
      <div>
        <div className="feedback-card-meta">
          <StatusBadge status={feedback.category} />
          <StatusBadge status={feedback.status} />
        </div>
        <h3
          className="feedback-card-title mt-2"
          onClick={() => navigate(`/feedback/${feedback._id || feedback.id}`)}
        >
          {feedback.title}
        </h3>
        <p className="feedback-card-desc">{excerpt}</p>
      </div>

      <div className="feedback-card-footer">
        <div className="feedback-card-author">
          <div className="user-avatar" style={{ width: 22, height: 22, fontSize: '0.65rem' }}>
            {getInitials(feedback.author?.name || feedback.user?.name)}
          </div>
          <span>{feedback.author?.name || feedback.user?.name || 'Anonymous'}</span>
          <span>·</span>
          <span>{formatDate(feedback.createdAt)}</span>
          {(feedback.commentCount ?? feedback.comments?.length) > 0 && (
            <>
              <span>·</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                <MessageCircle size={12} />
                {feedback.commentCount ?? feedback.comments?.length}
              </span>
            </>
          )}
        </div>
        {showVoteButton && (
          <VoteButton
            count={localVotes}
            voted={localVoted}
            loading={voting}
            onVote={handleVote}
          />
        )}
      </div>
    </div>
  )
}
