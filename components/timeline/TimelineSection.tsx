"use client"

import { useState, useRef } from "react"
import { motion, useInView } from "framer-motion"
import { CHAPTERS } from "@/lib/data/chapters"
import ChapterCard from "./ChapterCard"
import SectionLabel from "@/components/ui/SectionLabel"
import { useIsMobile } from "@/hooks/useMediaQuery"

export default function TimelineSection() {
  const [active, setActive] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-100px" })
  const isMobile = useIsMobile()

  return (
    <section style={{ background: "#0a0016", minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", padding: isMobile ? "48px 0" : "64px 0" }}>
      <div ref={ref} style={{ maxWidth: 900, margin: "0 auto", padding: isMobile ? "0 24px" : "0 32px", width: "100%" }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <SectionLabel text="Career narrative" />
          <h2 style={{ fontSize: 28, fontWeight: 300, color: "#e2e8f0", marginBottom: 8, fontFamily: "var(--font-cormorant), Georgia, serif" }}>
            Five chapters of a non-linear journey
          </h2>
          <p style={{ color: "#64748b", fontSize: 14, marginBottom: 24 }}>
            Click a chapter to expand · each one a turning point
          </p>

          <p style={{ color: "#94a3b8", fontSize: 16, lineHeight: 1.8, marginBottom: 48 }}>
            Every chapter follows the same pattern: understand how something works, then build something with it.
            Only the system changed — from brains to browsers.
          </p>
        </motion.div>

        {/* Spine + cards */}
        <div style={{ position: "relative" }}>
          <div style={{ position: "absolute", left: isMobile ? 16 : 22, top: 0, bottom: 0, width: 1, background: "linear-gradient(to bottom, #7c3aed44, #818cf822)", pointerEvents: "none" }} />
          {CHAPTERS.map((chapter, i) => (
            <motion.div
              key={chapter.num}
              initial={{ opacity: 0, x: -16 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1, ease: "easeOut" }}
            >
              <ChapterCard chapter={chapter} isActive={active === i} onClick={() => setActive(i)} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
