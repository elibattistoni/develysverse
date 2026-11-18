"use client"

import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent, type ReactNode } from "react"
import { GROUPS, type ClusterIndex, type DisciplineFilter } from "@/lib/data/skills"
import Icon from "@/components/ui/Icon"
import { HOME_VIEW, applyMapAction, drawConstellation, rotateView, type MapAction, type MapView } from "./constellation-renderer"
import styles from "./SkillsSection.module.css"

const KEYS: Record<string, MapAction> = { ArrowLeft: "rotate-left", ArrowRight: "rotate-right", ArrowUp: "rotate-up", ArrowDown: "rotate-down", "+": "zoom-in", "-": "zoom-out", Home: "reset" }
interface Drag { id: number; x: number; y: number; touch: boolean; active: boolean }

export default function Constellation({ children }: { children: ReactNode }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const view = useRef<MapView>({ ...HOME_VIEW })
  const drag = useRef<Drag | null>(null)
  const invalidate = useRef<() => void>(() => {})
  const [active, setActive] = useState<DisciplineFilter>("all")
  const [unavailable, setUnavailable] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current!
    let context: CanvasRenderingContext2D | null
    try { context = canvas.getContext("2d") } catch { context = null }
    const ctx = context
    let disposed = false, frame = 0
    if (!ctx) {
      queueMicrotask(() => { if (!disposed) setUnavailable(true) })
      return () => { disposed = true }
    }
    const requestDraw = () => {
      if (disposed || frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        if (!disposed) drawConstellation(canvas, ctx, view.current, window.devicePixelRatio)
      })
    }
    invalidate.current = requestDraw
    const observer = new ResizeObserver(requestDraw)
    observer.observe(canvas)
    document.fonts.ready.then(requestDraw)
    document.fonts.addEventListener("loadingdone", requestDraw)
    window.addEventListener("resize", requestDraw)
    requestDraw()
    return () => {
      disposed = true
      cancelAnimationFrame(frame)
      observer.disconnect()
      document.fonts.removeEventListener("loadingdone", requestDraw)
      window.removeEventListener("resize", requestDraw)
      invalidate.current = () => {}
      drag.current = null
    }
  }, [])

  function filter(discipline: DisciplineFilter) {
    view.current = { ...view.current, active: discipline }
    setActive(discipline)
    invalidate.current()
  }
  function action(name: MapAction) {
    view.current = applyMapAction(view.current, name)
    invalidate.current()
  }
  function keyboard(event: KeyboardEvent<HTMLCanvasElement>) {
    if (!Object.hasOwn(KEYS, event.key)) return
    event.preventDefault()
    action(KEYS[event.key])
  }
  function start(event: PointerEvent<HTMLCanvasElement>) {
    if (!event.isPrimary || event.button !== 0) return
    drag.current = { id: event.pointerId, x: event.clientX, y: event.clientY, touch: event.pointerType === "touch", active: false }
    event.currentTarget.setPointerCapture(event.pointerId)
  }
  function move(event: PointerEvent<HTMLCanvasElement>) {
    const current = drag.current
    if (current?.id !== event.pointerId) return
    const dx = event.clientX-current.x, dy = event.clientY-current.y
    if (current.touch && !current.active && (Math.abs(dx) < 7 || Math.abs(dx) <= Math.abs(dy))) return
    current.active = true
    view.current = rotateView(view.current, dx*.008, current.touch ? 0 : dy*.008)
    current.x = event.clientX
    current.y = event.clientY
    invalidate.current()
  }
  function end(event: PointerEvent<HTMLCanvasElement>) {
    if (drag.current?.id !== event.pointerId) return
    drag.current = null
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
  }

  return (
    <div className={styles.controller} data-canvas-unavailable={unavailable ? "" : undefined}>
      <p id="skills-map-help" className={styles.help} hidden={unavailable}>
        <span className={styles.mapPointerTip}>Drag to rotate · Select a discipline to explore.</span>
        <span className={styles.mapKeyboardTip} id="map-keyboard-tip">Arrow keys to rotate · + / − to zoom · Home to reset.</span>
      </p>
      <div className={styles.skillsMapToolbar} hidden={unavailable}>
        <div className={styles.skillsMapControls} role="group" aria-label="Discipline">
          <button type="button" aria-pressed={active === "all"} onClick={() => filter("all")}>All disciplines</button>
          {GROUPS.map((group, index) => <button key={group.name} type="button" aria-pressed={active === index} style={{ "--cluster-color": group.color } as CSSProperties} onClick={() => filter(index as ClusterIndex)}><i aria-hidden="true" />{group.name}</button>)}
        </div>
        <div className={`${styles.skillsMapControls} ${styles.mapViewControls}`} role="group" aria-label="Map view">
          <button type="button" aria-label="Rotate left" onClick={() => action("rotate-left")}><Icon name="arrow-left" className={styles.iconInline} /></button>
          <button type="button" aria-label="Rotate right" onClick={() => action("rotate-right")}><Icon name="details-right" className={styles.iconInline} /></button>
          <button type="button" aria-label="Zoom out" onClick={() => action("zoom-out")}>−</button>
          <button type="button" aria-label="Zoom in" onClick={() => action("zoom-in")}>+</button>
          <button type="button" aria-label="Reset map view" onClick={() => action("reset")}>Reset</button>
        </div>
      </div>
      <canvas ref={canvasRef} className={styles.skillsMapView} tabIndex={0} aria-label="Three-dimensional skills constellation" aria-describedby="map-keyboard-tip" hidden={unavailable} onKeyDown={keyboard} onPointerDown={start} onPointerMove={move} onPointerUp={end} onPointerCancel={end} onLostPointerCapture={() => { drag.current = null }}>Explore the three disciplines in the cards above.</canvas>
      {children}
    </div>
  )
}
