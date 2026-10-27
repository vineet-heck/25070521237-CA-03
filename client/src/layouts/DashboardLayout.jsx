import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
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
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/feedback', label: 'Feedback', icon: MessageSquare },
  { to: '/roadmap', label: 'Roadmap', icon: Map },
  { to: '/bugs', label: 'Bug Tracker', icon: Bug },
  { to: '/changelog', label: 'Changelog', icon: BookOpen },
  { to: '/saved', label: 'Saved Items', icon: Bookmark },
  { to: '/profile', label: 'My Profile', icon: User },
]

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
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  const currentPage = [...navItems, { to: '/admin', label: 'Admin Studio' }].find((item) =>
    location.pathname.startsWith(item.to)
  )

  const closeSidebar = () => setSidebarOpen(false)

  return (
    <div className="dashboard-layout">
      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={closeSidebar} />
      )}

      {/* Sidebar */}
      <aside className={`sidebar${sidebarOpen ? ' open' : ''}`}>
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">B</div>
          <span className="sidebar-logo-text">Backlog</span>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `sidebar-nav-item${isActive ? ' active' : ''}`
              }
              onClick={closeSidebar}
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}

          {user?.role === 'admin' && (
            <>
              <div className="sidebar-divider" />
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `sidebar-nav-item${isActive ? ' active' : ''}`
                }
                onClick={closeSidebar}
              >
                <Shield size={18} />
                Admin Studio
              </NavLink>
            </>
          )}
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="user-avatar user-avatar-sm">
              {getInitials(user?.name)}
            </div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">{user?.name || 'User'}</div>
              <div className="sidebar-user-role">{user?.role || 'member'}</div>
            </div>
          </div>
          <button
            className="sidebar-nav-item"
            onClick={logout}
            style={{ color: 'var(--danger)', width: '100%' }}
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="dashboard-main">
        {/* Topbar */}
        <header className="topbar">
          <div className="topbar-left">
            <button
              className="hamburger"
              onClick={() => setSidebarOpen((o) => !o)}
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
            <span className="topbar-title">{currentPage?.label || 'Backlog'}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="user-avatar user-avatar-sm">{getInitials(user?.name)}</div>
          </div>
        </header>

        {/* Page Content */}
        <main className="page-content">{children}</main>
      </div>
    </div>
  )
}
