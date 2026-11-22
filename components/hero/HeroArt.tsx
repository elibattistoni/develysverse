"use client"

/* Exact v10 assets: native images preserve their bytes and avoid export-time transformations. */
/* eslint-disable @next/next/no-img-element */
import { useCallback, useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react"
import { assetUrl } from "@/lib/assets"
import styles from "./HeroSection.module.css"

type Slot = "front" | "upper" | "lower"
type Discipline = "software" | "data" | "neuroscience"
const FRAGMENTS = [
  { id: "software", label: "Software Engineering", source: "hero-software.webp", matte: "#131321" },
  { id: "data", label: "Data Science", source: "hero-data.webp", matte: "#162530" },
  { id: "neuroscience", label: "Neuroscience", source: "hero-neuroscience.webp", matte: "#191426" },
] as const

export default function HeroArt() {
  const [slots, setSlots] = useState<Record<Discipline, Slot>>({ software: "front", data: "upper", neuroscience: "lower" })
  const frame = useRef(0)
  const tiltedArt = useRef<HTMLElement | null>(null)
  const tiltAllowed = useRef<MediaQueryList | null>(null)

  const resetTilt = useCallback(() => {
    cancelAnimationFrame(frame.current)
    frame.current = 0
    tiltedArt.current?.style.removeProperty("--rx")
    tiltedArt.current?.style.removeProperty("--ry")
    tiltedArt.current = null
  }, [])

  useEffect(() => {
    const media = window.matchMedia("(any-hover: hover) and (any-pointer: fine) and (prefers-reduced-motion: no-preference)")
    tiltAllowed.current = media
    media.addEventListener("change", resetTilt)
    return () => {
      media.removeEventListener("change", resetTilt)
      tiltAllowed.current = null
      resetTilt()
    }
  }, [resetTilt])

  function select(id: Discipline) {
    resetTilt()
    setSlots(current => {
      const front = FRAGMENTS.find(fragment => current[fragment.id] === "front")!
      if (front.id === id) return current
      return { ...current, [front.id]: current[id], [id]: "front" }
    })
  }

  function tilt(event: PointerEvent<HTMLDivElement>) {
    if (!tiltAllowed.current?.matches || event.pointerType !== "mouse") return
    const fragment = (event.target as Element).closest<HTMLButtonElement>("button[data-slot]")
    if (!fragment) return resetTilt()
    const art = fragment.querySelector<HTMLElement>("[data-fragment-art]")!
    if (tiltedArt.current !== art) resetTilt()
    tiltedArt.current = art
    const { clientX, clientY } = event
    cancelAnimationFrame(frame.current)
    frame.current = requestAnimationFrame(() => {
      frame.current = 0
      const bounds = fragment.getBoundingClientRect()
      const x = Math.max(-.5, Math.min(.5, (clientX - bounds.left) / bounds.width - .5))
      const y = Math.max(-.5, Math.min(.5, (clientY - bounds.top) / bounds.height - .5))
      art.style.setProperty("--rx", `${-y * 7}deg`)
      art.style.setProperty("--ry", `${x * 9}deg`)
    })
  }

  return (
    <figure className={styles.heroArt}>
      <div className={styles.fragmentScene}>
        <div className={styles.fragmentStack} role="group" aria-label="Explore the three disciplines" onPointerMove={tilt} onPointerLeave={resetTilt} onPointerCancel={resetTilt}>
          {FRAGMENTS.map(fragment => (
            <button type="button" key={fragment.id} className={styles.fragment} data-slot={slots[fragment.id]} data-discipline={fragment.id} style={{ "--art-matte": fragment.matte } as CSSProperties} aria-pressed={slots[fragment.id] === "front"} onClick={() => select(fragment.id)}>
              <span className={styles.fragmentArt} data-fragment-art="">
                <img alt="" draggable={false} src={assetUrl(`/assets/images/${fragment.source}`)} width={1199} height={750} loading={fragment.id === "software" ? "eager" : "lazy"} fetchPriority={fragment.id === "software" ? "high" : "low"} />
                <span>{fragment.label}</span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </figure>
  )
}
