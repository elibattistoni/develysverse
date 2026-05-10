"use client"

import { useEffect, useRef } from "react"

interface Star {
  x: number; y: number; r: number; a: number
}

interface Props {
  count?: number
  // RGB triplet — alpha is applied per-star from alphaRange
  color?: [number, number, number]
  alphaRange?: [number, number]
  radiusRange?: [number, number]
}

export default function BackgroundStars({
  count = 50,
  color = [192, 132, 252],
  alphaRange = [0.15, 0.45],
  radiusRange = [0.3, 1.5],
}: Props) {
  const ref = useRef<HTMLCanvasElement>(null)
  const [r, g, b] = color
  const [aMin, aMax] = alphaRange
  const [rMin, rMax] = radiusRange

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
        r: Math.random() * (rMax - rMin) + rMin,
        a: Math.random() * (aMax - aMin) + aMin,
      }))
      draw()
    }

    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      stars.forEach(s => {
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${r},${g},${b},${s.a})`
        ctx.fill()
      })
    }

    const ro = new ResizeObserver(init)
    ro.observe(canvas)
    init()

    return () => ro.disconnect()
  }, [count, r, g, b, aMin, aMax, rMin, rMax])

  return (
    <canvas ref={ref} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} />
  )
}
