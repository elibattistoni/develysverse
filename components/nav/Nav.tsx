"use client"

import { useState, useEffect, useCallback } from "react"

const NAV_ITEMS = [
  { label: "Hero",    id: "hero"    },
  { label: "Story",   id: "story"   },
  { label: "Skills",  id: "skills"  },
  { label: "Contact", id: "contact" },
] as const

export default function Nav() {
  const [active, setActive] = useState("hero")

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id) })
      },
      { threshold: 0.4 }
    )
    NAV_ITEMS.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  const scrollTo = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
  }, [])

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "20px 40px",
      background: "linear-gradient(to bottom, rgba(8,0,18,0.92), transparent)",
      backdropFilter: "blur(6px)",
    }}>
      <button
        onClick={() => scrollTo("hero")}
        style={{ background: "none", border: "none", cursor: "pointer", color: "#c084fc", fontSize: 12, fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase" }}
      >
        develys<span style={{ color: "#7c3aed" }}>·</span>verse
      </button>
      <div style={{ display: "flex", gap: 32 }}>
        {NAV_ITEMS.map(({ label, id }) => (
          <button
            key={id}
            onClick={() => scrollTo(id)}
            style={{
              background: "none", border: "none", cursor: "pointer",
              color: active === id ? "#c084fc" : "#334155",
              fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase",
              transition: "color 0.2s",
            }}
          >
            {label}
          </button>
        ))}
      </div>
    </nav>
  )
}
