"use client"

import dynamic from "next/dynamic"
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

  return (
    <section style={{ position: "relative", minHeight: "100vh", background: "#080012", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <ParticleField />
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 55% 65% at 70% 42%, rgba(110,30,200,0.14) 0%, transparent 65%)", pointerEvents: "none" }} />

      <div style={{ position: "relative", zIndex: 5, flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: isMobile ? "64px 24px 48px" : "64px 32px 48px", maxWidth: 900, margin: "0 auto", width: "100%" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
          <div style={{ width: 24, height: 1, background: "#7c3aed" }} />
          <span style={{ color: "#9333ea", fontSize: 12, letterSpacing: "0.3em", textTransform: "uppercase" }}>
            Software Developer · Cognitive Scientist
          </span>
        </div>

        <h1 style={{ fontSize: "clamp(28px, 5vw, 40px)", fontWeight: 300, lineHeight: 1.1, letterSpacing: "-0.025em", marginBottom: 24, minHeight: "2.6em", fontFamily: "var(--font-cormorant), Georgia, serif" }}>
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

        <p style={{ color: "#94a3b8", fontSize: 16, lineHeight: 1.8, maxWidth: 480, marginBottom: 32 }}>
          PhD in Cognitive Neuroscience. Now building software.
        </p>

      </div>

      <button
        onClick={() => document.getElementById("story")?.scrollIntoView({ behavior: "smooth" })}
        aria-label="Scroll to next section"
        style={{ position: "absolute", bottom: 48, left: "50%", transform: "translateX(-50%)", zIndex: 5, background: "none", border: "none", cursor: "pointer", padding: 8, width: 24 }}
      >
        <div className="comet" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ width: 2, height: 68, background: "linear-gradient(to bottom, transparent, transparent 10%, rgba(124,58,237,0.4), rgba(147,51,234,0.8), #c084fc)", borderRadius: 1 }} />
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#c084fc", boxShadow: "0 0 5px 2px rgba(192,132,252,0.6), 0 0 12px 5px rgba(192,132,252,0.3), 0 0 20px 8px rgba(147,51,234,0.15)", filter: "blur(0.5px)", marginTop: -2 }} />
        </div>
      </button>
    </section>
  )
}
