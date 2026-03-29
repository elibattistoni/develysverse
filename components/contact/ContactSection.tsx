"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import SectionLabel from "@/components/ui/SectionLabel"
import { useIsMobile } from "@/hooks/useMediaQuery"

const LINKS = [
  { label: "GitHub",   href: "https://github.com/elibattistoni" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/elisa-battistoni-21597980/" },
  { label: "Email",    href: "mailto:elisabattistoni.net@gmail.com" },
] as const

export default function ContactSection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })
  const isMobile = useIsMobile()

  return (
    <section style={{ background: "#050008", borderTop: "1px solid rgba(100,30,200,0.1)", minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", padding: isMobile ? "48px 0" : "64px 0" }}>
      <div ref={ref} style={{ maxWidth: 900, margin: "0 auto", padding: isMobile ? "0 24px" : "0 32px", width: "100%" }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <SectionLabel text="Let's connect" />
          <h2 style={{ fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 300, color: "#e2e8f0", lineHeight: 1.15, marginBottom: 16, fontFamily: "var(--font-cormorant), Georgia, serif" }}>
            Looking for a developer<br />
            <span style={{ color: "#c084fc", fontWeight: 600 }}>who thinks differently.</span>
          </h2>
          <p style={{ color: "#94a3b8", fontSize: 16, lineHeight: 1.8, maxWidth: 480, marginBottom: 48 }}>
            Eight years of scientific training don&apos;t disappear when you write code. They show up in
            how I approach problems, document decisions, and think about the people using what I build.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          style={{ display: "flex", gap: 16, flexWrap: "wrap" }}
        >
          {LINKS.map(({ label, href }) => (
            <a key={label} href={href} target="_blank" rel="noreferrer"
              className="btn-outline"
              style={{ color: "#c084fc", padding: "12px 24px", border: "1px solid rgba(147,51,234,0.35)", borderRadius: 4, fontSize: 12, letterSpacing: "0.1em", textDecoration: "none", textTransform: "uppercase", width: isMobile ? "100%" : "auto", textAlign: "center" }}>
              {label} →
            </a>
          ))}
        </motion.div>
      </div>

      <div style={{ maxWidth: 900, margin: "48px auto 0", padding: isMobile ? "24px 24px 0" : "24px 32px 0", borderTop: "1px solid rgba(100,30,200,0.08)", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8, width: "100%" }}>
        <span style={{ color: "#64748b", fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase" }}>develys·verse · elisa battistoni</span>
        <span style={{ color: "#64748b", fontSize: 12 }}>PhD · Cognitive Neuroscience · Software Developer</span>
      </div>
    </section>
  )
}
