"use client"

import { useEffect, useRef } from "react"

interface Neuron {
  x: number; y: number; r: number
  vx: number; vy: number
  a: number; baseA: number
  isHub: boolean
}

interface Signal {
  from: number; to: number; t: number; speed: number
}

export default function ParticleField() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return

    let w = 0, h = 0, neurons: Neuron[] = [], connections: [number, number][] = [], signals: Signal[] = [], raf: number
    const mouse = { x: -999, y: -999 }

    const init = () => {
      w = canvas.width = canvas.offsetWidth
      h = canvas.height = canvas.offsetHeight

      const isNarrow = w < 600
      // Center horizontally on narrow viewports (mobile vertical split); offset right on desktop
      const cx = isNarrow ? w * 0.5 : w * 0.72
      const cy = h * 0.50
      const rx = w * 0.3, ry = h * 0.42

      // Lighter density on mobile so the smaller visible area doesn't feel crowded
      const neuronCount = isNarrow ? 32 : 60
      const hubCount = isNarrow ? 6 : 10
      const signalCount = isNarrow ? 14 : 25
      const linkProbHub = isNarrow ? 0.4 : 0.5
      const linkProbBase = isNarrow ? 0.18 : 0.3

      neurons = Array.from({ length: neuronCount }, (_, i) => {
        const angle = Math.random() * Math.PI * 2
        const dist = Math.pow(Math.random(), 0.55)
        const x = cx + Math.cos(angle) * rx * dist + (Math.random() - 0.5) * 40
        const y = cy + Math.sin(angle) * ry * dist + (Math.random() - 0.5) * 40
        const isHub = i < hubCount
        return {
          x, y,
          r: isHub ? Math.random() * 2 + 3 : Math.random() * 1.2 + 0.5,
          vx: (Math.random() - 0.5) * 0.03,
          vy: (Math.random() - 0.5) * 0.03,
          a: isHub ? 0.7 : Math.random() * 0.3 + 0.4,
          baseA: isHub ? 0.7 : Math.random() * 0.3 + 0.4,
          isHub,
        }
      })

      connections = []
      for (let i = 0; i < neurons.length; i++) {
        for (let j = i + 1; j < neurons.length; j++) {
          const d = Math.hypot(neurons[i].x - neurons[j].x, neurons[i].y - neurons[j].y)
          const bothHubs = neurons[i].isHub && neurons[j].isHub
          const oneHub = neurons[i].isHub || neurons[j].isHub
          const maxDist = bothHubs ? 280 : oneHub ? 180 : 90
          if (d < maxDist && Math.random() < (oneHub ? linkProbHub : linkProbBase)) {
            connections.push([i, j])
          }
        }
      }

      signals = connections.length === 0 ? [] : Array.from({ length: signalCount }, () => {
        const ci = Math.floor(Math.random() * connections.length)
        return { from: connections[ci][0], to: connections[ci][1], t: Math.random(), speed: 0.002 + Math.random() * 0.003 }
      })
    }

    const tick = () => {
      ctx.clearRect(0, 0, w, h)

      // Dendrite connections
      connections.forEach(([i, j]) => {
        const a = neurons[i], b = neurons[j]
        const bothHubs = a.isHub && b.isHub
        const oneHub = a.isHub || b.isHub
        const alpha = bothHubs ? 0.3 : oneHub ? 0.2 : 0.12
        ctx.strokeStyle = `rgba(147,100,235,${alpha})`
        ctx.lineWidth = bothHubs ? 1.2 : oneHub ? 0.8 : 0.5
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke()
      })

      // Signal pulses
      signals.forEach((s) => {
        s.t += s.speed
        if (s.t > 1) {
          s.t = 0
          const ci = Math.floor(Math.random() * connections.length)
          s.from = connections[ci][0]; s.to = connections[ci][1]
          if (Math.random() > 0.5) { const tmp = s.from; s.from = s.to; s.to = tmp }
        }
        const a = neurons[s.from], b = neurons[s.to]
        const x = a.x + (b.x - a.x) * s.t
        const y = a.y + (b.y - a.y) * s.t
        const pulseA = Math.sin(s.t * Math.PI)

        // Outer glow
        ctx.beginPath(); ctx.arc(x, y, 8, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(192,132,252,${0.15 * pulseA})`; ctx.fill()
        // Inner glow
        ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(210,170,255,${0.4 * pulseA})`; ctx.fill()
        // Core
        ctx.beginPath(); ctx.arc(x, y, 2, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(230,200,255,${0.8 * pulseA})`; ctx.fill()
      })

      // Neurons
      neurons.forEach((n) => {
        const d = Math.hypot(n.x - mouse.x, n.y - mouse.y)
        n.a = d < 140 ? Math.min(1, n.baseA + 0.3 * (1 - d / 140)) : n.a + (n.baseA - n.a) * 0.05

        if (n.isHub) {
          // Outer glow
          ctx.beginPath(); ctx.arc(n.x, n.y, n.r * 4, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(147,51,234,${n.a * 0.12})`; ctx.fill()
          // Mid glow
          ctx.beginPath(); ctx.arc(n.x, n.y, n.r * 2.2, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(168,85,247,${n.a * 0.2})`; ctx.fill()
        }

        // Core
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2)
        ctx.fillStyle = n.isHub
          ? `rgba(220,180,255,${n.a})`
          : `rgba(180,140,240,${n.a * 0.8})`
        ctx.fill()

        n.x += n.vx; n.y += n.vy
        if (n.x < 0 || n.x > w) n.vx *= -1
        if (n.y < 0 || n.y > h) n.vy *= -1
      })

      raf = requestAnimationFrame(tick)
    }

    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect()
      mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top
    }

    const ro = new ResizeObserver(init)
    ro.observe(canvas)
    canvas.parentElement?.addEventListener("mousemove", onMove)
    init(); tick()

    return () => {
      cancelAnimationFrame(raf); ro.disconnect()
      canvas.parentElement?.removeEventListener("mousemove", onMove)
    }
  }, [])

  return (
    <canvas ref={ref} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} />
  )
}
