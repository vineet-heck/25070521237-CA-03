import HoloSphere3D from '../components/HoloSphere3D'

export default function AuthLayout({ children }) {
  return (
    <div className="auth-page">
      {/* Left Branding Panel */}
      <div className="auth-left">
        <div className="auth-left-logo">
          <div className="auth-left-logo-icon">B</div>
          <span className="auth-left-logo-text">Backlog</span>
        </div>
        <h2 className="auth-left-tagline">
          Build products your users actually want.
        </h2>
        <p className="auth-left-sub">
          Collect feedback, track bugs, manage your roadmap — all in one beautifully simple platform.
        </p>

        {/* 3D Holographic Interactive Core */}
        <div style={{ margin: '1.25rem 0', display: 'flex', alignItems: 'center' }}>
          <HoloSphere3D size={135} interactive={true} showRing={true} />
        </div>

        <div className="auth-features">
          {[
            'Centralized product feedback board',
            'Public roadmap with status tracking',
            'Bug reporting and severity management',
            'Changelog for transparent updates',
            'Save and revisit items anytime',
          ].map((feature) => (
            <div key={feature} className="auth-feature">
              <span className="auth-feature-dot" />
              {feature}
            </div>
          ))}
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="auth-right">
        <div className="auth-form-container">{children}</div>
      </div>
    </div>
  )
}
