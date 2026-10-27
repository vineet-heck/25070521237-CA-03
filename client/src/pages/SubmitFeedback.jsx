import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Send } from 'lucide-react'
import DashboardLayout from '../layouts/DashboardLayout'
import { createFeedback } from '../services/api'
import { useToast } from '../context/ToastContext'

const CATEGORIES = [
  'Feature Request',
  'UI/UX Improvement',
  'Performance',
  'Bug Fix Request',
  'Integration',
  'Documentation',
  'Accessibility',
  'Other',
]

export default function SubmitFeedback() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [form, setForm] = useState({ title: '', description: '', category: '', tags: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const errs = {}
    if (!form.title.trim()) errs.title = 'Title is required'
    else if (form.title.trim().length < 5) errs.title = 'Title must be at least 5 characters'
    if (!form.description.trim()) errs.description = 'Description is required'
    else if (form.description.trim().length < 10) errs.description = 'Please provide more detail (min 10 characters)'
    if (!form.category) errs.category = 'Please select a category'
    return errs
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((p) => ({ ...p, [name]: value }))
    setErrors((p) => ({ ...p, [name]: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    try {
      const tags = form.tags ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : []
      await createFeedback({
        title: form.title.trim(),
        description: form.description.trim(),
        category: form.category,
        tags,
      })
      showToast('Feedback submitted successfully!', 'success')
      navigate('/feedback')
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to submit feedback.', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="page-header">
        <button className="btn btn-ghost btn-sm mb-3" onClick={() => navigate('/feedback')}>
          <ArrowLeft size={15} /> Back to Board
        </button>
        <h1 className="page-title">Submit Feedback</h1>
        <p className="page-subtitle">Share a feature request, improvement, or idea with the team.</p>
      </div>

      <div style={{ maxWidth: 640 }}>
        <div className="card">
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="title">Title *</label>
                <input
                  id="title" name="title" type="text"
                  className={`form-input${errors.title ? ' error' : ''}`}
                  placeholder="Short, descriptive title for your feedback"
                  value={form.title} onChange={handleChange}
                  maxLength={150}
                />
                {errors.title && <span className="form-error">{errors.title}</span>}
                <span className="form-hint">{form.title.length}/150 characters</span>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="category">Category *</label>
                <select
                  id="category" name="category"
                  className={`form-select${errors.category ? ' error' : ''}`}
                  value={form.category} onChange={handleChange}
                >
                  <option value="">Select a category</option>
                  {CATEGORIES.map((c) => <option key={c} value={c.toLowerCase()}>{c}</option>)}
                </select>
                {errors.category && <span className="form-error">{errors.category}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="description">Description *</label>
                <textarea
                  id="description" name="description"
                  className={`form-textarea${errors.description ? ' error' : ''}`}
                  placeholder="Describe your idea, what problem it solves, and any relevant context…"
                  rows={6}
                  value={form.description} onChange={handleChange}
                />
                {errors.description && <span className="form-error">{errors.description}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="tags">Tags</label>
                <input
                  id="tags" name="tags" type="text"
                  className="form-input"
                  placeholder="ui, performance, mobile (comma-separated)"
                  value={form.tags} onChange={handleChange}
                />
                <span className="form-hint">Separate multiple tags with commas</span>
              </div>

              <div className="flex items-center gap-3 mt-2">
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? <span className="spinner spinner-sm" /> : <Send size={15} />}
                  {loading ? 'Submitting…' : 'Submit Feedback'}
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => navigate('/feedback')}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
