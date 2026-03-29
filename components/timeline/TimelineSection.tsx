"use client"

import { useState, useRef } from "react"
import { motion, useInView } from "framer-motion"
import { CHAPTERS } from "@/lib/data/chapters"
import ChapterCard from "./ChapterCard"
import SectionLabel from "@/components/ui/SectionLabel"

export default function TimelineSection() {
  const [active, setActive] = useState(1)
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section style={{ background: "#0a0016", padding: "80px 0" }}>
      <div ref={ref} style={{ maxWidth: 900, margin: "0 auto", padding: "0 40px" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <SectionLabel text="Career narrative" />
          <h2 style={{ fontSize: 26, fontWeight: 300, color: "#e2e8f0", marginBottom: 8, fontFamily: "var(--font-cormorant), Georgia, serif" }}>
            Five chapters of a non-linear journey
          </h2>
          <p style={{ color: "#1e293b", fontSize: 13, marginBottom: 52 }}>
            Click a chapter to expand · each one a turning point
          </p>
        </motion.div>

        {/* Spine + cards */}
        <div style={{ position: "relative" }}>
          <div style={{ position: "absolute", left: 22, top: 0, bottom: 0, width: 1, background: "linear-gradient(to bottom, #7c3aed44, #818cf822)", pointerEvents: "none" }} />
          {CHAPTERS.map((chapter, i) => (
            <motion.div
              key={chapter.num}
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1, ease: "easeOut" }}
            >
              <ChapterCard chapter={chapter} isActive={active === i} onClick={() => setActive(i)} />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          style={{ marginTop: 40, borderLeft: "2px solid #7c3aed", padding: "20px 28px", background: "rgba(124,58,237,0.05)", borderRadius: "0 10px 10px 0" }}
        >
          <p style={{ color: "#4b3a7a", fontSize: 13, lineHeight: 1.8, margin: 0, fontStyle: "italic" }}>
            The thread running through all five chapters: a compulsion to understand complex systems —
            whether neural, statistical, or computational — and then build something with that understanding.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
