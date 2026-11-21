"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import { useHydrated } from "@/hooks/useHydrated"
import styles from "./ExpertiseSection.module.css"

export default function ExpertiseBackBody({ title, children }: { title: string; children: ReactNode }) {
  const enhanced = useHydrated()
  const contentRef = useRef<HTMLDivElement>(null)
  const [overflow, setOverflow] = useState({ scrollable: false, more: false })

  useEffect(() => {
    const content = contentRef.current!
    const media = window.matchMedia("(min-width: 801px)")
    let mounted = true
    const update = () => {
      if (!mounted) return
      const overflowHeight = content.scrollHeight - content.clientHeight
      const scrollable = media.matches && overflowHeight > 1
      const more = scrollable && overflowHeight - content.scrollTop > 2
      setOverflow(current => current.scrollable === scrollable && current.more === more ? current : { scrollable, more })
    }
    const observer = new ResizeObserver(update)
    observer.observe(content)
    content.addEventListener("scroll", update, { passive: true })
    media.addEventListener("change", update)
    document.fonts.ready.then(update)
    return () => {
      mounted = false
      observer.disconnect()
      content.removeEventListener("scroll", update)
      media.removeEventListener("change", update)
    }
  }, [])

  const scrollable = enhanced && overflow.scrollable
  return (
    <div className={styles.expertiseBackScroll} data-more-content={scrollable && overflow.more ? "" : undefined}>
      <div
        ref={contentRef}
        className={styles.expertiseBackContent}
        data-expertise-back-content=""
        aria-label={scrollable ? `${title} details` : undefined}
        tabIndex={scrollable ? 0 : undefined}
        role={scrollable ? "region" : undefined}
      >
        {children}
      </div>
    </div>
  )
}
