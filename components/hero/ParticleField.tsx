"use client"

import { useEffect, useRef } from "react"

interface Particle {
  x: number; y: number; r: number
  vx: number; vy: number; a: number; baseA: number
}

export default function ParticleField() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return

    let w = 0, h = 0, particles: Particle[] = [], raf: number
    const mouse = { x: -999, y: -999 }

    const init = () => {
      w = canvas.width = canvas.offsetWidth
      h = canvas.height = canvas.offsetHeight
      particles = Array.from({ length: 110 }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        r: Math.random() * 1.6 + 0.2,
        vx: (Math.random() - 0.5) * 0.22, vy: (Math.random() - 0.5) * 0.22,
        a: Math.random() * 0.5 + 0.1, baseA: Math.random() * 0.5 + 0.1,
      }))
    }

    const tick = () => {
      ctx.clearRect(0, 0, w, h)
      particles.forEach((p, i) => {
        const d = Math.hypot(p.x - mouse.x, p.y - mouse.y)
        p.a = d < 100 ? Math.min(1, p.baseA + 0.5 * (1 - d / 100)) : p.a + (p.baseA - p.a) * 0.05

        for (let j = i + 1; j < particles.length; j++) {
          const d2 = Math.hypot(p.x - particles[j].x, p.y - particles[j].y)
          if (d2 < 120) {
            ctx.strokeStyle = `rgba(147,51,234,${0.22 * (1 - d2 / 120)})`
            ctx.lineWidth = 0.6
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(particles[j].x, particles[j].y); ctx.stroke()
          }
        }

        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(192,132,252,${p.a})`; ctx.fill()

        p.x += p.vx; p.y += p.vy
        if (p.x < 0 || p.x > w) p.vx *= -1
        if (p.y < 0 || p.y > h) p.vy *= -1
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
