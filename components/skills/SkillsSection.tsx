"use client"

import dynamic from "next/dynamic"
import { useRef, useState } from "react"
import { motion, useInView, useScroll, useTransform } from "framer-motion"
import { CLUSTERS } from "@/lib/data/skills"
import SectionLabel from "@/components/ui/SectionLabel"
import BackgroundStars from "@/components/ui/BackgroundStars"
import { useIsMobile } from "@/hooks/useMediaQuery"

const Constellation = dynamic(() => import("./Constellation"), { ssr: false })

export default function SkillsSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })
  const isMobile = useIsMobile()
  const [paused, setPaused] = useState(false)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })

  // Only the background stars parallax — foreground scrolls naturally
  const starsY = useTransform(scrollYProgress, [0, 1], [-120, 120])

  return (
    <section ref={sectionRef} style={{ position: "relative", background: "#080012", borderTop: "1px solid rgba(100,30,200,0.12)", minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", padding: isMobile ? "48px 0" : "64px 0", overflow: "hidden" }}>
      <motion.div style={{ position: "absolute", inset: 0, y: starsY, pointerEvents: "none", willChange: "transform" }}>
        <BackgroundStars count={60} />
      </motion.div>
      <div ref={ref} style={{ maxWidth: 900, margin: "0 auto", padding: isMobile ? "0 24px" : "0 32px", width: "100%" }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <SectionLabel text="Skills constellation" />
          <h2 style={{ fontSize: 28, fontWeight: 300, color: "#e2e8f0", marginBottom: 8, fontFamily: "var(--font-cormorant), Georgia, serif" }}>
            Three clusters. One career.
          </h2>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
            <p style={{ color: "#64748b", fontSize: 14, margin: 0 }}>
              {isMobile
                ? `Touch to rotate · ${paused ? "pinch to zoom" : "pause to zoom"}`
                : `Drag to rotate · ${paused ? "scroll to zoom" : "pause to zoom"}`}
            </p>
            <button
              className="btn-outline"
              onClick={() => setPaused(!paused)}
              aria-label={paused ? "Play animation" : "Pause animation"}
              style={{
                background: "transparent", border: "1px solid rgba(147,51,234,0.3)",
                borderRadius: 4, padding: "4px 14px", cursor: "pointer",
                color: "#94a3b8", fontSize: 12, letterSpacing: "0.06em",
                whiteSpace: "nowrap", flexShrink: 0, marginLeft: 16,
              }}
            >
              {paused ? "▶ Play" : "❚❚ Pause"}
            </button>
          </div>
        </motion.div>
      </div>

      <Constellation paused={paused} />

      <div style={{ maxWidth: 900, margin: "0 auto", padding: isMobile ? "48px 24px 0" : "48px 32px 0", width: "100%" }}>
        <div style={{ display: "flex", flexWrap: isMobile ? "wrap" : "nowrap", gap: 8, justifyContent: "center" }}>
          {CLUSTERS.map(cl => (
            <div key={cl.name} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 14px", background: "rgba(255,255,255,0.02)", border: `1px solid ${cl.hex}28`, borderRadius: 6 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: cl.hex, flexShrink: 0 }} />
              <span style={{ color: cl.hex, fontSize: 12, fontWeight: 500, whiteSpace: "nowrap" }}>{cl.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
