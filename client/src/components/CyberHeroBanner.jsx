import { Sparkles, Terminal, Activity, ShieldCheck, Zap } from 'lucide-react'
import HoloSphere3D from './HoloSphere3D'

export default function CyberHeroBanner({ userName }) {
  return (
    <div
      style={{
        position: 'relative',
        background: 'linear-gradient(135deg, rgba(11, 17, 44, 0.85) 0%, rgba(4, 8, 28, 0.95) 100%)',
        border: '1px solid rgba(0, 210, 255, 0.22)',
        borderRadius: '16px',
        padding: '1.5rem 1.75rem',
        marginBottom: '2rem',
        overflow: 'hidden',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(0, 245, 255, 0.2)',
      }}
    >
      {/* Background glow flares */}
      <div
        style={{
          position: 'absolute',
          top: '-40%',
          right: '15%',
          width: '320px',
          height: '240px',
          background: 'radial-gradient(circle, rgba(0, 210, 255, 0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-30%',
          left: '5%',
          width: '280px',
          height: '200px',
          background: 'radial-gradient(circle, rgba(124, 58, 237, 0.1) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.5rem',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Left Information Deck */}
        <div style={{ flex: '1 1 360px', minWidth: '280px' }}>
          {/* Status Pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                padding: '0.25rem 0.65rem',
                borderRadius: '999px',
                background: 'rgba(6, 214, 160, 0.12)',
                color: '#06d6a0',
                border: '1px solid rgba(6, 214, 160, 0.35)',
                boxShadow: '0 0 10px rgba(6, 214, 160, 0.25)',
              }}
            >
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: '#06d6a0',
                  boxShadow: '0 0 6px #06d6a0',
                  animation: 'pulse-glow 2s infinite',
                }}
              />
              SYSTEM ONLINE
            </span>

            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.75rem',
                fontWeight: 600,
                padding: '0.25rem 0.65rem',
                borderRadius: '999px',
                background: 'rgba(0, 210, 255, 0.1)',
                color: 'var(--neon-cyan)',
                border: '1px solid rgba(0, 210, 255, 0.25)',
              }}
            >
              <Zap size={12} />
              Sprint v2.4 Active
            </span>

            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.75rem',
                fontWeight: 600,
                padding: '0.25rem 0.65rem',
                borderRadius: '999px',
                background: 'rgba(179, 136, 255, 0.1)',
                color: '#b388ff',
                border: '1px solid rgba(179, 136, 255, 0.25)',
              }}
            >
              <ShieldCheck size={12} />
              Enterprise Node
            </span>
          </div>

          <h2
            style={{
              fontSize: '1.35rem',
              fontWeight: 800,
              color: '#ffffff',
              letterSpacing: '-0.02em',
              marginBottom: '0.45rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <span>Product Intelligence Matrix</span>
            <Sparkles size={18} style={{ color: 'var(--neon-cyan)' }} />
          </h2>

          <p
            style={{
              fontSize: '0.875rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.5,
              maxWidth: '560px',
              marginBottom: '1rem',
            }}
          >
            Welcome, <strong style={{ color: 'var(--neon-cyan)', fontWeight: 600 }}>{userName || 'Lead Engineer'}</strong>. All telemetry channels are streaming. Drag the 3D core to interact with the neural backlog node.
          </p>

          {/* Micro Telemetry Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
              gap: '0.65rem',
              maxWidth: '460px',
            }}
          >
            <div
              style={{
                background: 'rgba(2, 4, 18, 0.65)',
                border: '1px solid rgba(0, 210, 255, 0.15)',
                borderRadius: '8px',
                padding: '0.45rem 0.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <Activity size={14} style={{ color: '#00d2ff' }} />
              <div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Database</div>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#06d6a0' }}>Operational</div>
              </div>
            </div>

            <div
              style={{
                background: 'rgba(2, 4, 18, 0.65)',
                border: '1px solid rgba(0, 210, 255, 0.15)',
                borderRadius: '8px',
                padding: '0.45rem 0.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <Terminal size={14} style={{ color: '#00f5ff' }} />
              <div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>API Latency</div>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--neon-cyan)' }}>18ms (Ultra)</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right 3D Interactive Core */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          <div
            style={{
              position: 'absolute',
              width: '160px',
              height: '160px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(0, 210, 255, 0.18) 0%, transparent 70%)',
              filter: 'blur(10px)',
              pointerEvents: 'none',
            }}
          />
          <HoloSphere3D size={150} interactive={true} showRing={true} />
        </div>
      </div>
    </div>
  )
}
