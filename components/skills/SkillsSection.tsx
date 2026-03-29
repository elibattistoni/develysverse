"use client"

import dynamic from "next/dynamic"
import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { CLUSTERS } from "@/lib/data/skills"
import SectionLabel from "@/components/ui/SectionLabel"
import { useIsMobile } from "@/hooks/useMediaQuery"

const Constellation = dynamic(() => import("./Constellation"), { ssr: false })

export default function SkillsSection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })
  const isMobile = useIsMobile()

  return (
    <section style={{ background: "#080012", borderTop: "1px solid rgba(100,30,200,0.12)", padding: isMobile ? "48px 0" : "64px 0" }}>
      <div ref={ref} style={{ maxWidth: 900, margin: "0 auto", padding: isMobile ? "0 24px" : "0 32px" }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <SectionLabel text="Skills constellation" />
          <h2 style={{ fontSize: 28, fontWeight: 300, color: "#e2e8f0", marginBottom: 8, fontFamily: "var(--font-cormorant), Georgia, serif" }}>
            Four clusters. One career.
          </h2>
          <p style={{ color: "#64748b", fontSize: 14, marginBottom: 32 }}>
            Bridge lines connect the pivot points · drag to rotate · hover to explore
          </p>
        </motion.div>
      </div>

      <Constellation />

      <div style={{ maxWidth: 900, margin: "0 auto", padding: isMobile ? "16px 24px 0" : "16px 32px 0" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {CLUSTERS.map(cl => (
            <div key={cl.name} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", background: "rgba(255,255,255,0.02)", border: `1px solid ${cl.hex}28`, borderRadius: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: cl.hex }} />
              <div>
                <div style={{ color: cl.hex, fontSize: 12, fontWeight: 500 }}>{cl.name}</div>
                <div style={{ color: "#64748b", fontSize: 12 }}>{cl.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
