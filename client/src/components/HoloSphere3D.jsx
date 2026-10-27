import { useEffect, useRef } from 'react'

/**
 * Interactive 3D Holographic Wireframe Polyhedron
 * Pure Canvas 3D engine with perspective projection, neon node glows, and interactive mouse-tracking.
 */
export default function HoloSphere3D({ size = 180, interactive = true, showRing = true }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    const width = size
    const height = size
    canvas.width = width * window.devicePixelRatio
    canvas.height = height * window.devicePixelRatio
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio)

    // Vertices of an Icosahedron / Geodesic Cyber Core
    const t = (1.0 + Math.sqrt(5.0)) / 2.0
    const rawVertices = [
      [-1,  t,  0], [ 1,  t,  0], [-1, -t,  0], [ 1, -t,  0],
      [ 0, -1,  t], [ 0,  1,  t], [ 0, -1, -t], [ 0,  1, -t],
      [ t,  0, -1], [ t,  0,  1], [-t,  0, -1], [-t,  0,  1]
    ].map(([x, y, z]) => {
      const len = Math.sqrt(x*x + y*y + z*z)
      return [ (x/len) * 55, (y/len) * 55, (z/len) * 55 ]
    })

    // Edges connecting vertices
    const edges = [
      [0, 11], [0, 5], [0, 1], [0, 7], [0, 10],
      [1, 5], [5, 11], [11, 10], [10, 7], [7, 1],
      [3, 9], [3, 4], [3, 2], [3, 6], [3, 8],
      [4, 9], [2, 4], [6, 2], [8, 6], [9, 8],
      [4, 5], [5, 9], [8, 1], [1, 9], [7, 8],
      [6, 7], [10, 6], [2, 10], [11, 2], [4, 11]
    ]

    // Floating data particles
    const particles = Array.from({ length: 18 }, () => ({
      x: (Math.random() - 0.5) * 110,
      y: (Math.random() - 0.5) * 110,
      z: (Math.random() - 0.5) * 110,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      vz: (Math.random() - 0.5) * 0.4,
      size: Math.random() * 1.8 + 0.8,
      hue: Math.random() > 0.4 ? '#00f5ff' : '#00d2ff'
    }))

    let rotX = 0.4
    let rotY = 0.6
    let rotZ = 0
    let targetSpeedX = 0.007
    let targetSpeedY = 0.012
    let speedX = 0.007
    let speedY = 0.012
    let animId

    const handleMouseMove = (e) => {
      if (!interactive) return
      const rect = canvas.getBoundingClientRect()
      const mx = (e.clientX - rect.left) / rect.width - 0.5
      const my = (e.clientY - rect.top) / rect.height - 0.5
      speedX = my * 0.04
      speedY = mx * 0.04
    }

    const handleMouseLeave = () => {
      speedX = targetSpeedX
      speedY = targetSpeedY
    }

    if (interactive) {
      canvas.addEventListener('mousemove', handleMouseMove)
      canvas.addEventListener('mouseleave', handleMouseLeave)
    }

    let pulse = 0

    const render = () => {
      pulse += 0.03
      rotX += speedX
      rotY += speedY
      rotZ += 0.003

      ctx.clearRect(0, 0, width, height)

      const cx = width / 2
      const cy = height / 2
      const fov = 160

      // Matrix rotation math
      const cosX = Math.cos(rotX), sinX = Math.sin(rotX)
      const cosY = Math.cos(rotY), sinY = Math.sin(rotY)
      const cosZ = Math.cos(rotZ), sinZ = Math.sin(rotZ)

      const project = ([x, y, z]) => {
        // Rot Y
        let x1 = x * cosY + z * sinY
        let y1 = y
        let z1 = -x * sinY + z * cosY

        // Rot X
        let x2 = x1
        let y2 = y1 * cosX - z1 * sinX
        let z2 = y1 * sinX + z1 * cosX

        // Rot Z
        let x3 = x2 * cosZ - y2 * sinZ
        let y3 = x2 * sinZ + y2 * cosZ
        let z3 = z2

        const scale = fov / (fov + z3 + 80)
        return {
          px: cx + x3 * scale,
          py: cy + y3 * scale,
          scale,
          z: z3
        }
      }

      // Draw Orbiting Ring
      if (showRing) {
        ctx.save()
        ctx.beginPath()
        ctx.ellipse(cx, cy, 68 + Math.sin(pulse) * 3, 24, rotZ * 0.5, 0, Math.PI * 2)
        ctx.strokeStyle = 'rgba(0, 245, 255, 0.28)'
        ctx.lineWidth = 1.2
        ctx.setLineDash([4, 6])
        ctx.stroke()
        ctx.restore()
      }

      // Draw floating background particles
      particles.forEach(p => {
        p.x += p.vx
        p.y += p.vy
        p.z += p.vz
        if (Math.abs(p.x) > 65) p.vx *= -1
        if (Math.abs(p.y) > 65) p.vy *= -1
        if (Math.abs(p.z) > 65) p.vz *= -1

        const pt = project([p.x, p.y, p.z])
        ctx.beginPath()
        ctx.arc(pt.px, pt.py, p.size * pt.scale, 0, Math.PI * 2)
        ctx.fillStyle = p.hue
        ctx.shadowColor = p.hue
        ctx.shadowBlur = 6
        ctx.fill()
      })

      // Project vertices
      const projected = rawVertices.map(project)

      // Draw wireframe edges
      edges.forEach(([i, j]) => {
        const p1 = projected[i]
        const p2 = projected[j]
        const avgZ = (p1.z + p2.z) / 2
        const alpha = Math.max(0.15, (avgZ + 60) / 120)

        ctx.save()
        ctx.beginPath()
        ctx.moveTo(p1.px, p1.py)
        ctx.lineTo(p2.px, p2.py)
        ctx.strokeStyle = `rgba(0, 210, 255, ${alpha * 0.75})`
        ctx.lineWidth = Math.max(0.8, 1.4 * ((p1.scale + p2.scale) / 2))
        ctx.shadowColor = 'rgba(0, 245, 255, 0.5)'
        ctx.shadowBlur = 5
        ctx.stroke()
        ctx.restore()
      })

      // Draw glowing vertex nodes
      projected.forEach((p, idx) => {
        const radius = Math.max(2, 3.8 * p.scale)
        ctx.save()
        ctx.beginPath()
        ctx.arc(p.px, p.py, radius, 0, Math.PI * 2)
        ctx.fillStyle = idx % 2 === 0 ? '#00f5ff' : '#00d2ff'
        ctx.shadowColor = '#00f5ff'
        ctx.shadowBlur = 8
        ctx.fill()
        ctx.restore()
      })

      // Central glowing core pulse
      ctx.save()
      const corePulse = (Math.sin(pulse * 1.5) + 1) / 2
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 32 + corePulse * 8)
      grad.addColorStop(0, 'rgba(0, 245, 255, 0.35)')
      grad.addColorStop(0.5, 'rgba(0, 102, 255, 0.15)')
      grad.addColorStop(1, 'transparent')
      ctx.fillStyle = grad
      ctx.beginPath()
      ctx.arc(cx, cy, 38, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()

      animId = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(animId)
      if (interactive) {
        canvas.removeEventListener('mousemove', handleMouseMove)
        canvas.removeEventListener('mouseleave', handleMouseLeave)
      }
    }
  }, [size, interactive, showRing])

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        filter: 'drop-shadow(0 0 16px rgba(0, 210, 255, 0.25))',
        cursor: interactive ? 'grab' : 'default'
      }}
      title="3D Cyber Matrix Core"
    >
      <canvas
        ref={canvasRef}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          display: 'block'
        }}
      />
    </div>
  )
}
