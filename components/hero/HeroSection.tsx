"use client"

import dynamic from "next/dynamic"
import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { useTypewriter } from "./useTypewriter"
import { useIsMobile } from "@/hooks/useMediaQuery"

const ParticleField = dynamic(() => import("./ParticleField"), { ssr: false })

const TAGLINE = "I studied how brains see.\nNow I build what they look at."

function Cursor() {
  return (
    <span style={{ display: "inline-block", width: 3, height: "0.85em", background: "#9333ea", marginLeft: 4, verticalAlign: "middle", animation: "blink 1s step-end infinite" }} />
  )
}

export default function HeroSection() {
  const { display, started, done } = useTypewriter(TAGLINE)
  const lines = display.split("\n")
  const isMobile = useIsMobile()

  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  })

  // Brain network drifts up slowly, fades out before next section
  const networkY = useTransform(scrollYProgress, [0, 1], [0, 120])
  const networkOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const networkScale = useTransform(scrollYProgress, [0, 1], [1, 1.05])

  // Gradient drifts even slower for layered depth
  const gradientY = useTransform(scrollYProgress, [0, 1], [0, 60])

  // Text fades out fully by 50% of the section to clear way for next section
  const textY = useTransform(scrollYProgress, [0, 1], [0, -40])
  const textOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  // Comet fades early
  const cometOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0])

  const textContent = (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
        <div style={{ width: 24, height: 1, background: "#7c3aed" }} />
        <span style={{ color: "#9333ea", fontSize: 12, letterSpacing: "0.3em", textTransform: "uppercase" }}>
          Software Developer · Cognitive Scientist
        </span>
      </div>

      <h1 style={{ fontSize: "clamp(28px, 5vw, 40px)", fontWeight: 300, lineHeight: 1.1, letterSpacing: "-0.025em", marginBottom: isMobile ? 16 : 24, minHeight: isMobile ? "2.2em" : "2.6em", fontFamily: "var(--font-cormorant), Georgia, serif" }}>
        {lines[0] && (
          <span style={{ display: "block", color: "#e2e8f0" }}>
            {lines[0]}
            {started && !done && !lines[1] && <Cursor />}
          </span>
        )}
        {lines[1] && (
          <span style={{ display: "block", color: "#c084fc", fontWeight: 600 }}>
            {lines[1]}
            {started && !done && <Cursor />}
          </span>
        )}
      </h1>

      <p style={{ color: "#94a3b8", fontSize: 16, lineHeight: 1.8, maxWidth: 480, marginBottom: isMobile ? 16 : 32 }}>
        PhD in Cognitive Neuroscience. Now building software.
      </p>
    </>
  )

  return (
    <section ref={sectionRef} style={{ position: "relative", minHeight: "100vh", background: "#080012", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      {isMobile ? (
        // Mobile: vertical split — text on top (cleared from nav), network at bottom
        <>
          <motion.div style={{ position: "relative", zIndex: 5, padding: "144px 24px 0", y: textY, opacity: textOpacity }}>
            {textContent}
          </motion.div>
          <motion.div style={{ position: "relative", flex: 1, minHeight: "32vh", maxHeight: "40vh", overflow: "hidden", opacity: networkOpacity, scale: networkScale }}>
            <ParticleField />
            <motion.div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 65% 75% at 50% 50%, rgba(110,30,200,0.18) 0%, transparent 65%)", pointerEvents: "none", y: gradientY }} />
          </motion.div>
        </>
      ) : (
        // Desktop: full-screen network behind centered text
        <>
          <motion.div style={{ position: "absolute", inset: 0, y: networkY, opacity: networkOpacity, scale: networkScale }}>
            <ParticleField />
          </motion.div>
          <motion.div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 55% 65% at 70% 42%, rgba(110,30,200,0.14) 0%, transparent 65%)", pointerEvents: "none", y: gradientY }} />

          <motion.div style={{ position: "relative", zIndex: 5, flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "64px 32px 48px 12%", maxWidth: 750, y: textY, opacity: textOpacity }}>
            {textContent}
          </motion.div>
        </>
      )}

      <motion.button
        onClick={() => document.getElementById("story")?.scrollIntoView({ behavior: "smooth" })}
        aria-label="Scroll to next section"
        style={{ position: "absolute", bottom: isMobile ? 24 : 48, left: "50%", x: "-50%", zIndex: 5, background: "none", border: "none", cursor: "pointer", padding: 8, width: 24, opacity: cometOpacity }}
      >
        <div className="comet" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ width: 2, height: 68, background: "linear-gradient(to bottom, transparent, transparent 10%, rgba(124,58,237,0.4), rgba(147,51,234,0.8), #c084fc)", borderRadius: 1 }} />
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#c084fc", boxShadow: "0 0 5px 2px rgba(192,132,252,0.6), 0 0 12px 5px rgba(192,132,252,0.3), 0 0 20px 8px rgba(147,51,234,0.15)", filter: "blur(0.5px)", marginTop: -2 }} />
        </div>
      </motion.button>
    </section>
  )
}
