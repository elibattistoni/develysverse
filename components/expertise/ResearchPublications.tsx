"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import { useHydrated } from "@/hooks/useHydrated"
import { useIsMobile } from "@/hooks/useMediaQuery"
import styles from "./ExpertiseSection.module.css"

export default function ResearchPublications({ children }: { children: ReactNode }) {
  const enhanced = useHydrated()
  const desktop = !useIsMobile(800)
  const contentRef = useRef<HTMLDivElement>(null)
  const [more, setMore] = useState(false)

  useEffect(() => {
    const content = contentRef.current!
    const media = window.matchMedia("(min-width: 801px)")
    let mounted = true
    const update = () => {
      if (mounted) setMore(media.matches && content.scrollHeight - content.clientHeight - content.scrollTop > 2)
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

  return (
    <div className={styles.neuroscienceScroll} data-more-content={enhanced && more ? "" : undefined}>
      <div ref={contentRef} className={styles.neuroscienceContent} data-publications-content="" aria-label="Research methods, tools and publications" tabIndex={enhanced && desktop ? 0 : undefined} role={enhanced && desktop ? "region" : undefined}>{children}</div>
    </div>
  )
}
