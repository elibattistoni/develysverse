"use client"

import { useEffect, useRef } from "react"

interface Star {
  x: number; y: number; r: number; a: number
}

export default function BackgroundStars({ count = 50 }: { count?: number }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return

    let w = 0, h = 0, stars: Star[] = []

    const init = () => {
      w = canvas.width = canvas.offsetWidth
      h = canvas.height = canvas.offsetHeight
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.2 + 0.3,
        a: Math.random() * 0.3 + 0.15,
      }))
      draw()
    }

    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      stars.forEach(s => {
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(192,132,252,${s.a})`
        ctx.fill()
      })
    }

    const ro = new ResizeObserver(init)
    ro.observe(canvas)
    init()

    return () => ro.disconnect()
  }, [count])

  return (
    <canvas ref={ref} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} />
  )
}
