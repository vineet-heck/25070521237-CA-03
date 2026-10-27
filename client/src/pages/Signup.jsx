import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react'
import AuthLayout from '../layouts/AuthLayout'
import { register as registerApi } from '../services/api'

export default function Signup() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [apiError, setApiError] = useState('')
  const [success, setSuccess] = useState(false)

  const validate = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Name is required'
    if (!form.email.trim()) errs.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Enter a valid email'
    if (!form.password) errs.password = 'Password is required'
    else if (form.password.length < 8) errs.password = 'Password must be at least 8 characters'
    if (!form.confirmPassword) errs.confirmPassword = 'Please confirm your password'
    else if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match'
    return errs
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((p) => ({ ...p, [name]: value }))
    setErrors((p) => ({ ...p, [name]: '' }))
    setApiError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    try {
      await registerApi({ name: form.name.trim(), email: form.email.trim(), password: form.password })
      setSuccess(true)
      setTimeout(() => navigate('/login'), 2500)
    } catch (err) {
      if (!err.response) {
        setApiError('Cannot connect to backend server. Is "npm run dev" running in the server folder?')
      } else {
        setApiError(err.response?.data?.message || 'Registration failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <AuthLayout>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
          <h2 className="auth-form-title">Account created!</h2>
          <p className="auth-form-subtitle">Redirecting you to sign in…</p>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout>
      <h2 className="auth-form-title">Create your account</h2>
      <p className="auth-form-subtitle">Join Backlog and start tracking your product</p>

      {apiError && <div className="alert alert-error mb-4">{apiError}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="name">Full name</label>
          <div className="relative">
            <User size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              id="name" name="name" type="text"
              className={`form-input${errors.name ? ' error' : ''}`}
              style={{ paddingLeft: '2.5rem' }}
              placeholder="Jane Smith"
              value={form.name} onChange={handleChange}
            />
          </div>
          {errors.name && <span className="form-error">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="email">Email address</label>
          <div className="relative">
            <Mail size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              id="email" name="email" type="email"
              className={`form-input${errors.email ? ' error' : ''}`}
              style={{ paddingLeft: '2.5rem' }}
              placeholder="you@example.com"
              value={form.email} onChange={handleChange}
              autoComplete="email"
            />
          </div>
          {errors.email && <span className="form-error">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="password">Password</label>
          <div className="relative">
            <Lock size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              id="password" name="password" type={showPass ? 'text' : 'password'}
              className={`form-input${errors.password ? ' error' : ''}`}
              style={{ paddingLeft: '2.5rem', paddingRight: '2.75rem' }}
              placeholder="Min. 8 characters"
              value={form.password} onChange={handleChange}
            />
            <button type="button" onClick={() => setShowPass((p) => !p)}
              style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              tabIndex={-1}>
              {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && <span className="form-error">{errors.password}</span>}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="confirmPassword">Confirm password</label>
          <div className="relative">
            <Lock size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              id="confirmPassword" name="confirmPassword" type={showConfirm ? 'text' : 'password'}
              className={`form-input${errors.confirmPassword ? ' error' : ''}`}
              style={{ paddingLeft: '2.5rem', paddingRight: '2.75rem' }}
              placeholder="Re-enter password"
              value={form.confirmPassword} onChange={handleChange}
            />
            <button type="button" onClick={() => setShowConfirm((p) => !p)}
              style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              tabIndex={-1}>
              {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.confirmPassword && <span className="form-error">{errors.confirmPassword}</span>}
        </div>

        <button type="submit" className="btn btn-primary w-full btn-lg" disabled={loading}>
          {loading ? <span className="spinner spinner-sm" /> : null}
          {loading ? 'Creating account…' : 'Create Account'}
        </button>
      </form>

      <p className="auth-switch-link">
        Already have an account?{' '}
        <Link to="/login" style={{ fontWeight: 600 }}>Sign in</Link>
      </p>
    </AuthLayout>
  )
}
