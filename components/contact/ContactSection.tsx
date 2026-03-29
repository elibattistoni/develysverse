"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import SectionLabel from "@/components/ui/SectionLabel"

const LINKS = [
  { label: "GitHub",   href: "https://github.com/elibattistoni" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/elisa-battistoni-21597980/" },
  { label: "Email",    href: "mailto:elisabattistoni.net@gmail.com" },
] as const

export default function ContactSection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <section style={{ background: "#050008", borderTop: "1px solid rgba(100,30,200,0.1)", padding: "80px 40px" }}>
      <div ref={ref} style={{ maxWidth: 900, margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <SectionLabel text="Let's connect" />
          <h2 style={{ fontSize: "clamp(24px, 4vw, 44px)", fontWeight: 300, color: "#e2e8f0", lineHeight: 1.15, marginBottom: 20, fontFamily: "var(--font-cormorant), Georgia, serif" }}>
            Looking for a developer<br />
            <span style={{ color: "#c084fc", fontWeight: 600 }}>who thinks differently.</span>
          </h2>
          <p style={{ color: "#475569", fontSize: 15, lineHeight: 1.8, maxWidth: 480, marginBottom: 48 }}>
            Eight years of scientific training don&apos;t disappear when you write code. They show up in
            how I approach problems, document decisions, and think about the people using what I build.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          style={{ display: "flex", gap: 14, flexWrap: "wrap" }}
        >
          {LINKS.map(({ label, href }) => (
            <a key={label} href={href} target="_blank" rel="noreferrer"
              style={{ color: "#c084fc", padding: "11px 24px", border: "1px solid rgba(147,51,234,0.35)", borderRadius: 4, fontSize: 12, letterSpacing: "0.1em", textDecoration: "none", textTransform: "uppercase" }}>
              {label} →
            </a>
          ))}
        </motion.div>
      </div>

      <div style={{ maxWidth: 900, margin: "60px auto 0", borderTop: "1px solid rgba(100,30,200,0.08)", paddingTop: 28, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <span style={{ color: "#1a1033", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase" }}>develys·verse · elisa battistoni</span>
        <span style={{ color: "#1a1033", fontSize: 10 }}>PhD · Data Science · Frontend</span>
      </div>
    </section>
  )
}
