import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { getComments, addComment } from '../services/api'
import { MessageCircle, Send } from 'lucide-react'
import LoadingSpinner from './LoadingSpinner'
import EmptyState from './EmptyState'

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

function getInitials(name) {
  if (!name) return 'U'
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
}

export default function CommentSection({ feedbackId, onCommentAdded }) {
  const { user, isAuthenticated } = useAuth()
  const { showToast } = useToast()
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [text, setText] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!feedbackId) return
    setLoading(true)
    getComments(feedbackId)
      .then((res) => setComments(res.data.comments || res.data || []))
      .catch(() => setComments([]))
      .finally(() => setLoading(false))
  }, [feedbackId])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!text.trim()) return
    setSubmitting(true)
    try {
      const res = await addComment(feedbackId, { text: text.trim() })
      const newComment = res.data.comment || res.data
      setComments((prev) => [...prev, newComment])
      setText('')
      showToast('Comment added!', 'success')
      if (onCommentAdded) onCommentAdded()
    } catch {
      showToast('Failed to add comment.', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <div className="section-title">
        <MessageCircle size={18} />
        Comments ({comments.length})
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : comments.length === 0 ? (
        <EmptyState
          icon={MessageCircle}
          title="No comments yet"
          description="Be the first to share your thoughts."
        />
      ) : (
        <div>
          {comments.map((comment, i) => (
            <div key={comment._id || comment.id || i} className="comment-item">
              <div className="user-avatar user-avatar-sm">
                {getInitials(comment.author?.name || comment.user?.name)}
              </div>
              <div className="comment-body">
                <div>
                  <span className="comment-author">
                    {comment.author?.name || comment.user?.name || 'User'}
                  </span>
                  <span className="comment-date">
                    {formatDate(comment.createdAt)}
                  </span>
                </div>
                <p className="comment-text">{comment.text || comment.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {isAuthenticated && (
        <form onSubmit={handleSubmit} style={{ marginTop: '1.5rem' }}>
          <div className="form-group">
            <label className="form-label">Add a comment</label>
            <textarea
              className="form-textarea"
              rows={3}
              placeholder="Share your thoughts..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              style={{ minHeight: '90px' }}
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary btn-sm"
            disabled={submitting || !text.trim()}
          >
            {submitting ? (
              <span className="spinner spinner-sm" />
            ) : (
              <Send size={14} />
            )}
            {submitting ? 'Posting...' : 'Post Comment'}
          </button>
        </form>
      )}
    </div>
  )
}
