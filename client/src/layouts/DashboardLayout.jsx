import { useState, useRef, useEffect } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  MessageSquare,
  Map,
  Bug,
  BookOpen,
  Bookmark,
  User,
  Shield,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Plus,
  Sparkles,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

function getInitials(name) {
  if (!name) return 'U'
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export default function DashboardLayout({ children }) {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const [moreOpen, setMoreOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const moreRef = useRef(null)
  const userMenuRef = useRef(null)

  const isAdmin = user?.role === 'admin'

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (moreRef.current && !moreRef.current.contains(event.target)) {
        setMoreOpen(false)
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false)
    setMoreOpen(false)
    setUserMenuOpen(false)
  }, [location.pathname])

  const mainNavItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/feedback', label: 'Feedback', icon: MessageSquare },
    { to: '/roadmap', label: 'Roadmap', icon: Map },
    { to: '/changelog', label: 'Changelog', icon: BookOpen },
    { to: '/bugs', label: 'Bugs', icon: Bug },
  ]

  const isMoreActive =
    location.pathname.startsWith('/saved') ||
    location.pathname.startsWith('/profile') ||
    location.pathname.startsWith('/admin')

  return (
    <div className="app-shell">
      {/* Top Navigation Bar */}
      <header className="topnav">
        <div className="topnav-container">
          {/* Left: Brand */}
          <div className="topnav-brand">
            <Link to="/dashboard" className="brand-link">
              <div className="brand-logo">B</div>
              <span className="brand-name">Backlog</span>
            </Link>
            <span className="brand-pill">v2.3</span>
          </div>

          {/* Center: Desktop Navigation */}
          <nav className="topnav-links" aria-label="Main Navigation">
            {mainNavItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `topnav-link${isActive ? ' active' : ''}`
                }
              >
                <Icon size={16} />
                <span>{label}</span>
              </NavLink>
            ))}

            {/* "More" Dropdown for secondary pages */}
            <div className="topnav-dropdown-wrapper" ref={moreRef}>
              <button
                type="button"
                className={`topnav-link topnav-dropdown-trigger${isMoreActive ? ' active' : ''}`}
                onClick={() => setMoreOpen((o) => !o)}
                aria-expanded={moreOpen}
              >
                <span>More</span>
                <ChevronDown size={14} className={`chevron-icon${moreOpen ? ' open' : ''}`} />
              </button>

              {moreOpen && (
                <div className="topnav-dropdown-menu">
                  <NavLink
                    to="/saved"
                    className={({ isActive }) =>
                      `dropdown-item${isActive ? ' active' : ''}`
                    }
                    onClick={() => setMoreOpen(false)}
                  >
                    <Bookmark size={15} />
                    <span>Saved Items</span>
                  </NavLink>
                  <NavLink
                    to="/profile"
                    className={({ isActive }) =>
                      `dropdown-item${isActive ? ' active' : ''}`
                    }
                    onClick={() => setMoreOpen(false)}
                  >
                    <User size={15} />
                    <span>My Profile</span>
                  </NavLink>
                  {isAdmin && (
                    <NavLink
                      to="/admin"
                      className={({ isActive }) =>
                        `dropdown-item admin-item${isActive ? ' active' : ''}`
                      }
                      onClick={() => setMoreOpen(false)}
                    >
                      <Shield size={15} />
                      <div className="flex items-center justify-between w-full">
                        <span>Admin Studio</span>
                        <span className="badge-admin-chip">Admin</span>
                      </div>
                    </NavLink>
                  )}
                </div>
              )}
            </div>
          </nav>

          {/* Right: Actions & User Profile */}
          <div className="topnav-actions">
            {/* Quick CTA */}
            <button
              className="btn btn-primary btn-sm topnav-cta"
              onClick={() => navigate('/feedback/new')}
            >
              <Plus size={15} />
              <span>New Feedback</span>
            </button>

            {/* Profile Menu Dropdown */}
            <div className="user-menu-wrapper" ref={userMenuRef}>
              <button
                type="button"
                className="user-menu-button"
                onClick={() => setUserMenuOpen((o) => !o)}
                aria-expanded={userMenuOpen}
                aria-label="User menu"
              >
                <div className="user-avatar-badge">
                  {getInitials(user?.name)}
                </div>
                <span className="user-first-name">{user?.name?.split(' ')[0] || 'User'}</span>
                <ChevronDown size={14} className={`chevron-icon${userMenuOpen ? ' open' : ''}`} />
              </button>

              {userMenuOpen && (
                <div className="user-dropdown-menu">
                  <div className="user-dropdown-header">
                    <div className="user-avatar-badge user-avatar-badge-lg">
                      {getInitials(user?.name)}
                    </div>
                    <div className="user-dropdown-meta">
                      <div className="user-full-name">{user?.name || 'User'}</div>
                      <div className="user-email-text">{user?.email || ''}</div>
                      <span className={`user-role-badge ${isAdmin ? 'admin' : 'member'}`}>
                        {isAdmin ? '★ Administrator' : 'Product Member'}
                      </span>
                    </div>
                  </div>

                  <div className="dropdown-divider" />

                  <Link
                    to="/profile"
                    className="dropdown-item"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <User size={15} />
                    <span>My Profile</span>
                  </Link>

                  <Link
                    to="/saved"
                    className="dropdown-item"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <Bookmark size={15} />
                    <span>Saved Items</span>
                  </Link>

                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="dropdown-item admin-item"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <Shield size={15} />
                      <span>Admin Studio</span>
                    </Link>
                  )}

                  <div className="dropdown-divider" />

                  <button
                    type="button"
                    className="dropdown-item signout-item"
                    onClick={() => {
                      setUserMenuOpen(false)
                      logout()
                    }}
                  >
                    <LogOut size={15} />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              className="hamburger-btn"
              onClick={() => setMobileMenuOpen((o) => !o)}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="mobile-drawer">
            <div className="mobile-drawer-content">
              {/* Main Links */}
              <div className="mobile-nav-group">
                <div className="mobile-group-label">Navigation</div>
                {mainNavItems.map(({ to, label, icon: Icon }) => (
                  <NavLink
                    key={to}
                    to={to}
                    className={({ isActive }) =>
                      `mobile-nav-link${isActive ? ' active' : ''}`
                    }
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Icon size={18} />
                    <span>{label}</span>
                  </NavLink>
                ))}
              </div>

              {/* Secondary Links */}
              <div className="mobile-nav-group">
                <div className="mobile-group-label">Account & Tools</div>
                <NavLink
                  to="/saved"
                  className={({ isActive }) =>
                    `mobile-nav-link${isActive ? ' active' : ''}`
                  }
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Bookmark size={18} />
                  <span>Saved Items</span>
                </NavLink>
                <NavLink
                  to="/profile"
                  className={({ isActive }) =>
                    `mobile-nav-link${isActive ? ' active' : ''}`
                  }
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User size={18} />
                  <span>My Profile</span>
                </NavLink>
                {isAdmin && (
                  <NavLink
                    to="/admin"
                    className={({ isActive }) =>
                      `mobile-nav-link admin${isActive ? ' active' : ''}`
                    }
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Shield size={18} />
                    <span>Admin Studio</span>
                  </NavLink>
                )}
              </div>

              {/* Mobile CTA */}
              <button
                className="btn btn-primary w-full mt-3"
                onClick={() => {
                  setMobileMenuOpen(false)
                  navigate('/feedback/new')
                }}
              >
                <Plus size={16} />
                <span>Submit New Feedback</span>
              </button>

              {/* Mobile Logout */}
              <div className="mobile-drawer-footer">
                <div className="mobile-user-row">
                  <div className="user-avatar-badge">
                    {getInitials(user?.name)}
                  </div>
                  <div className="mobile-user-info">
                    <div className="mobile-user-name">{user?.name}</div>
                    <div className="mobile-user-email">{user?.email}</div>
                  </div>
                </div>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm w-full text-danger mt-2"
                  onClick={() => {
                    setMobileMenuOpen(false)
                    logout()
                  }}
                >
                  <LogOut size={16} />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Container Area */}
      <main className="main-content-wrapper">
        <div className="app-container">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <div className="app-container footer-content">
          <div className="footer-left">
            <span className="footer-logo">Backlog</span>
            <span className="footer-dot">•</span>
            <span className="footer-text">Product Feedback & Roadmap Platform</span>
          </div>
          <div className="footer-right">
            <span>B.Tech Final Project</span>
            <span className="footer-dot">•</span>
            <span>25070521237-CA-03</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
