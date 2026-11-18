"use client"

import { useLayoutEffect, useRef, useState, type ReactNode } from "react"
import type { Expertise } from "@/lib/data/expertise"
import { useHydrated } from "@/hooks/useHydrated"
import Icon from "@/components/ui/Icon"
import ExpertiseIcon from "./ExpertiseIcon"
import styles from "./ExpertiseSection.module.css"

export default function ExpertiseCard({ expertise, children }: { expertise: Expertise; children: ReactNode }) {
  const enhanced = useHydrated()
  const [showBack, setShowBack] = useState(false)
  const pendingFocus = useRef(false)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const openRef = useRef<HTMLButtonElement>(null)
  const backRef = useRef<HTMLDivElement>(null)

  function flip(next: boolean) {
    pendingFocus.current = true
    setShowBack(next)
  }

  useLayoutEffect(() => {
    if (!pendingFocus.current) return
    pendingFocus.current = false
    // React has made the incoming face non-inert before focus moves. The hidden
    // face cannot keep a keyboard stop; no transition timeout is needed.
    if (showBack) {
      backRef.current?.querySelector<HTMLElement>("[data-publications-content]")?.scrollTo({ top: 0, behavior: "instant" })
      titleRef.current?.focus({ preventScroll: true })
    } else openRef.current?.focus({ preventScroll: true })
  }, [showBack])

  const titleId = `${expertise.id}-expertise-title`
  const detailsId = `${expertise.id}-expertise-details`
  return (
    <article className={`${styles.expertiseCard} ${expertise.primary ? styles.primary : ""}`} aria-labelledby={titleId} data-flip-ready={enhanced ? "" : undefined} data-flipped={showBack ? "" : undefined}>
      <div className={styles.expertiseFlipper}>
        <div className={`${styles.expertiseFace} ${styles.expertiseFront}`} inert={enhanced && showBack}>
          {expertise.primary && <span className={styles.primaryLabel}>Primary focus</span>}
          <div className={styles.expertiseIcon} aria-hidden="true"><ExpertiseIcon discipline={expertise.id} /></div>
          <h3 id={titleId}>{expertise.title}</h3>
          <p>{expertise.description}</p>
          <button ref={openRef} type="button" className={`${styles.expertiseAction} ${styles.expertiseOpen}`} aria-label={`View details: ${expertise.title}`} aria-controls={detailsId} aria-expanded={showBack} hidden={!enhanced} onClick={() => flip(true)}>View details <Icon name="details-right" className={styles.iconInline} /></button>
        </div>
        <div ref={backRef} className={`${styles.expertiseFace} ${styles.expertiseBack}`} id={detailsId} inert={enhanced && !showBack}>
          <div className={styles.expertiseBackHeading}>
            <div className={styles.expertiseIcon} aria-hidden="true"><ExpertiseIcon discipline={expertise.id} /></div>
            <h3 ref={titleRef} tabIndex={-1}>{expertise.title}</h3>
          </div>
          {children}
          <button type="button" className={styles.expertiseAction} aria-label={`Back to overview: ${expertise.title}`} hidden={!enhanced} onClick={() => flip(false)}><Icon name="arrow-left" className={styles.iconInline} /> Back to overview</button>
        </div>
      </div>
    </article>
  )
}
