"use client"

import { useRef } from "react"
import { motion, useInView, useScroll, useTransform } from "framer-motion"
import SectionLabel from "@/components/ui/SectionLabel"
import BackgroundStars from "@/components/ui/BackgroundStars"
import { useIsMobile } from "@/hooks/useMediaQuery"

const LINKS = [
  { label: "GitHub",   href: "https://github.com/elibattistoni" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/elisa-battistoni-21597980/" },
  { label: "Email",    href: "mailto:elisabattistoni.net@gmail.com" },
] as const

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? ""

export default function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })
  const isMobile = useIsMobile()

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })

  // Only the background stars parallax — foreground scrolls naturally
  const starsY = useTransform(scrollYProgress, [0, 1], [-100, 100])

  return (
    <section ref={sectionRef} style={{ position: "relative", background: "#050008", borderTop: "1px solid rgba(100,30,200,0.1)", minHeight: "100vh", display: "flex", flexDirection: "column", padding: isMobile ? "48px 0 0" : "64px 0 0", overflow: "hidden" }}>
      <motion.div style={{ position: "absolute", inset: 0, y: starsY, pointerEvents: "none", willChange: "transform" }}>
        <BackgroundStars count={50} />
      </motion.div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", width: "100%" }}>
      <div ref={ref} style={{ maxWidth: 900, margin: "0 auto", padding: isMobile ? "0 24px" : "0 32px", width: "100%" }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <SectionLabel text="Let's connect" />
          <h2 style={{ fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 300, color: "#e2e8f0", lineHeight: 1.15, marginBottom: 16, fontFamily: "var(--font-cormorant), Georgia, serif" }}>
            Looking for a developer<br />
            <span style={{ color: "#c084fc", fontWeight: 600 }}>who thinks like a scientist.</span>
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
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: isMobile ? "56px 24px 32px" : "32px 32px", borderTop: "1px solid rgba(100,30,200,0.08)", display: "flex", flexDirection: isMobile ? "column" : "row", justifyContent: isMobile ? "flex-start" : "space-between", alignItems: isMobile ? "flex-start" : "center", gap: isMobile ? 12 : 16, width: "100%" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`${BASE_PATH}/logo/muted/logo-extended.svg`}
          alt="develys·verse"
          style={{ height: isMobile ? 68 : 100, width: "auto", display: "block" }}
        />
        <span style={{ color: "#64748b", fontSize: 14, whiteSpace: isMobile ? "normal" : "nowrap", lineHeight: 1.6 }}>
          {isMobile ? (
            <>PhD · Cognitive Neuroscience<br />Software Developer</>
          ) : (
            "PhD · Cognitive Neuroscience · Software Developer"
          )}
        </span>
      </div>
    </section>
  )
}
