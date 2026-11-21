"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import Icon from "@/components/ui/Icon"
import styles from "./ProjectsSection.module.css"

export default function ProjectCarousel({ heading, children }: { heading: ReactNode; children: ReactNode }) {
  const railRef = useRef<HTMLDivElement>(null)
  const [view, setView] = useState({ scrollable: false, atStart: true, atEnd: false })

  useEffect(() => {
    const rail = railRef.current!
    let mounted = true
    const update = () => {
      if (!mounted) return
      const limit = rail.scrollWidth - rail.clientWidth
      const next = { scrollable: limit >= 3, atStart: rail.scrollLeft <= 2, atEnd: rail.scrollLeft >= limit - 2 }
      setView(current => current.scrollable === next.scrollable && current.atStart === next.atStart && current.atEnd === next.atEnd ? current : next)
    }
    const observer = new ResizeObserver(update)
    observer.observe(rail)
    rail.addEventListener("scroll", update, { passive: true })
    document.fonts.ready.then(update)
    return () => {
      mounted = false
      observer.disconnect()
      rail.removeEventListener("scroll", update)
    }
  }, [])

  function step(direction: -1 | 1) {
    const rail = railRef.current!
    const first = rail.children[0] as HTMLElement
    const second = rail.children[1] as HTMLElement
    const distance = second.offsetLeft - first.offsetLeft
    const current = direction > 0 ? Math.floor((rail.scrollLeft + 3) / distance) : Math.ceil((rail.scrollLeft - 3) / distance)
    rail.scrollTo({ left: (current + direction) * distance, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" })
  }

  return (
    <>
      <div className={styles.sectionHead}>{heading}</div>
      <div className={styles.projectRail} ref={railRef} id="projectRail" role="region" tabIndex={view.scrollable ? 0 : -1} aria-label="Selected project cards">{children}</div>
      <div className={styles.railControls} role="group" hidden={!view.scrollable} aria-label="Project carousel controls">
        <button className={styles.railButton} type="button" aria-label="Scroll projects left" aria-controls="projectRail" disabled={view.atStart} onClick={() => step(-1)}><Icon name="chevron-left" /></button>
        <button className={styles.railButton} type="button" aria-label="Scroll projects right" aria-controls="projectRail" disabled={view.atEnd} onClick={() => step(1)}><Icon name="chevron-right" /></button>
      </div>
    </>
  )
}
