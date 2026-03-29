"use client"

import dynamic from "next/dynamic"
import { useTypewriter } from "./useTypewriter"

const ParticleField = dynamic(() => import("./ParticleField"), { ssr: false })

const TAGLINE = "I studied how brains see.\nNow I build what they look at."

export default function HeroSection() {
  const { display, done } = useTypewriter(TAGLINE)
  const lines = display.split("\n")

  return (
    <section style={{ position: "relative", minHeight: "100vh", background: "#080012", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <ParticleField />
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 55% 65% at 70% 42%, rgba(110,30,200,0.14) 0%, transparent 65%)", pointerEvents: "none" }} />

      <div style={{ position: "relative", zIndex: 5, flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "120px 48px 80px", maxWidth: 880 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
          <div style={{ width: 24, height: 1, background: "#7c3aed" }} />
          <span style={{ color: "#9333ea", fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase" }}>
            Software developer · Researcher · Explorer
          </span>
        </div>

        <h1 style={{ fontSize: "clamp(30px, 5vw, 62px)", fontWeight: 300, lineHeight: 1.1, letterSpacing: "-0.025em", marginBottom: 32, minHeight: "2.6em", fontFamily: "var(--font-cormorant), Georgia, serif" }}>
          {lines[0] && <span style={{ display: "block", color: "#e2e8f0" }}>{lines[0]}</span>}
          {lines[1] && <span style={{ display: "block", color: "#c084fc", fontWeight: 600 }}>{lines[1]}</span>}
          {!done && (
            <span style={{ display: "inline-block", width: 3, height: "0.85em", background: "#9333ea", marginLeft: 4, verticalAlign: "middle", animation: "blink 1s step-end infinite" }} />
          )}
        </h1>

        <p style={{ color: "#475569", fontSize: 16, lineHeight: 1.8, maxWidth: 480, marginBottom: 48 }}>
          PhD in Cognitive Neuroscience → Data Scientist → Frontend Developer.
          <br />A non-linear path that made me a better engineer.
        </p>

        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          <button onClick={() => document.getElementById("story")?.scrollIntoView({ behavior: "smooth" })}
            style={{ background: "#9333ea", color: "#fff", padding: "13px 30px", border: "none", borderRadius: 4, fontSize: 13, letterSpacing: "0.06em", cursor: "pointer", fontWeight: 500 }}>
            Read the story →
          </button>
          <button onClick={() => document.getElementById("skills")?.scrollIntoView({ behavior: "smooth" })}
            style={{ background: "transparent", color: "#c084fc", padding: "12px 30px", border: "1px solid rgba(147,51,234,0.4)", borderRadius: 4, fontSize: 13, letterSpacing: "0.06em", cursor: "pointer" }}>
            Explore skills
          </button>
        </div>
      </div>

      <div style={{ position: "absolute", bottom: 28, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, opacity: 0.45, zIndex: 5 }}>
        <span style={{ fontSize: 9, letterSpacing: "0.25em", textTransform: "uppercase", color: "#9333ea" }}>scroll</span>
        <div style={{ width: 1, height: 36, background: "linear-gradient(to bottom, #7c3aed, transparent)" }} />
      </div>
    </section>
  )
}
