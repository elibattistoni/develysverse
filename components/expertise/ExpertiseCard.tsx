"use client"

import { useLayoutEffect, useRef, useState, type ReactNode } from "react"
import type { Expertise } from "@/lib/data/expertise"
import { useHydrated } from "@/hooks/useHydrated"
import Icon from "@/components/ui/Icon"
import ExpertiseBackBody from "./ExpertiseBackBody"
import ExpertiseIcon from "./ExpertiseIcon"
import styles from "./ExpertiseSection.module.css"

export default function ExpertiseCard({ expertise, children }: { expertise: Expertise; children: ReactNode }) {
  const enhanced = useHydrated()
  const [showBack, setShowBack] = useState(false)
  const pendingFocus = useRef(false)
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
      backRef.current?.querySelector<HTMLElement>("[data-expertise-back-content]")?.scrollTo({ top: 0, behavior: "instant" })
      backRef.current?.focus({ preventScroll: true })
    } else openRef.current?.focus({ preventScroll: true })
  }, [showBack])

  const titleId = `${expertise.id}-expertise-title`
  const detailsId = `${expertise.id}-expertise-details`
  return (
    <article className={`${styles.expertiseCard} ${expertise.primary ? styles.primary : ""}`} aria-labelledby={titleId} data-flip-ready={enhanced ? "" : undefined} data-flipped={showBack ? "" : undefined}>
      <div className={styles.expertiseFlipper}>
        <div className={`${styles.expertiseFace} ${styles.expertiseFront}`} inert={enhanced && showBack}>
          {expertise.primary && <span className={styles.primaryLabel}>Primary focus</span>}
          <div className={styles.expertiseSummary}>
            <div className={styles.expertiseIcon} aria-hidden="true"><ExpertiseIcon discipline={expertise.id} /></div>
            <h3 id={titleId}>{expertise.title}</h3>
            <p className={styles.essentials}>{expertise.essentials}</p>
          </div>
          <button ref={openRef} type="button" className={styles.expertiseAction} aria-label={`View details: ${expertise.title}`} aria-controls={detailsId} aria-expanded={showBack} hidden={!enhanced} onClick={() => flip(true)}><Icon name="details-right" className={styles.iconInline} /></button>
        </div>
        <div ref={backRef} className={`${styles.expertiseFace} ${styles.expertiseBack}`} id={detailsId} inert={enhanced && !showBack} role="group" aria-label={expertise.title} tabIndex={-1}>
          <ExpertiseBackBody title={expertise.title}>{children}</ExpertiseBackBody>
          <button
            type="button"
            className={styles.expertiseAction}
            aria-label={`Back to overview: ${expertise.title}`}
            hidden={!enhanced}
            onClick={() => flip(false)}
          >
            <Icon name="arrow-left" className={styles.iconInline} />
            <span className={styles.expertiseIcon} aria-hidden="true"><ExpertiseIcon discipline={expertise.id} /></span>
          </button>
        </div>
      </div>
    </article>
  )
}
