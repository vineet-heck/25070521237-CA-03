import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock } from 'lucide-react'
import AuthLayout from '../layouts/AuthLayout'
import { login as loginApi } from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [apiError, setApiError] = useState('')

  const validate = () => {
    const errs = {}
    if (!form.email.trim()) errs.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Enter a valid email'
    if (!form.password) errs.password = 'Password is required'
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
      const res = await loginApi({ email: form.email.trim(), password: form.password })
      const { token, user } = res.data
      login(token, user)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      if (!err.response) {
        setApiError('Cannot connect to backend server. Is "npm run dev" running in the server folder?')
      } else {
        setApiError(err.response?.data?.message || 'Invalid email or password.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout>
      <h2 className="auth-form-title">Welcome back</h2>
      <p className="auth-form-subtitle">Sign in to your Backlog account</p>

      {apiError && (
        <div className="alert alert-error mb-4">{apiError}</div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="email">Email address</label>
          <div className="relative">
            <Mail
              size={16}
              style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
            />
            <input
              id="email"
              name="email"
              type="email"
              className={`form-input${errors.email ? ' error' : ''}`}
              style={{ paddingLeft: '2.5rem' }}
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
            />
          </div>
          {errors.email && <span className="form-error">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="password">Password</label>
          <div className="relative">
            <Lock
              size={16}
              style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
            />
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              className={`form-input${errors.password ? ' error' : ''}`}
              style={{ paddingLeft: '2.5rem', paddingRight: '2.75rem' }}
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              tabIndex={-1}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && <span className="form-error">{errors.password}</span>}
        </div>

        <button
          type="submit"
          className="btn btn-primary w-full btn-lg"
          disabled={loading}
        >
          {loading ? <span className="spinner spinner-sm" /> : null}
          {loading ? 'Signing in…' : 'Sign In'}
        </button>
      </form>

      <p className="auth-switch-link">
        Don&apos;t have an account?{' '}
        <Link to="/signup" style={{ fontWeight: 600 }}>
          Create one
        </Link>
      </p>
    </AuthLayout>
  )
}
