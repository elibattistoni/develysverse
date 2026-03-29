"use client"

import { useState, useEffect, useCallback } from "react"
import { useIsMobile } from "@/hooks/useMediaQuery"

const NAV_ITEMS = [
  { label: "Hero",    id: "hero"    },
  { label: "Story",   id: "story"   },
  { label: "Skills",  id: "skills"  },
  { label: "Contact", id: "contact" },
] as const

export default function Nav() {
  const [active, setActive] = useState("hero")
  const [menuOpen, setMenuOpen] = useState(false)
  const isMobile = useIsMobile()

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
    setMenuOpen(false)
  }, [])

  return (
    <nav
      aria-label="Main navigation"
      style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: isMobile ? "16px 24px" : "16px 32px",
        background: "linear-gradient(to bottom, rgba(8,0,18,0.92), transparent)",
        backdropFilter: "blur(6px)",
      }}
    >
      <button
        className="nav-link"
        onClick={() => scrollTo("hero")}
        style={{ background: "none", border: "none", cursor: "pointer", color: "#c084fc", fontSize: 12, fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase" }}
      >
        develys<span style={{ color: "#7c3aed" }}>·</span>verse <span style={{ color: "#64748b", fontWeight: 400 }}>· elisa battistoni</span>
      </button>

      {isMobile ? (
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          style={{ background: "none", border: "none", cursor: "pointer", padding: 8, display: "flex", flexDirection: "column", gap: 5, zIndex: 110 }}
        >
          <div style={{ width: 22, height: 1.5, background: "#c084fc", transition: "all 0.3s", transform: menuOpen ? "rotate(45deg) translate(4px, 4px)" : "none" }} />
          <div style={{ width: 22, height: 1.5, background: "#c084fc", transition: "all 0.3s", opacity: menuOpen ? 0 : 1 }} />
          <div style={{ width: 22, height: 1.5, background: "#c084fc", transition: "all 0.3s", transform: menuOpen ? "rotate(-45deg) translate(4px, -4px)" : "none" }} />
        </button>
      ) : (
        <div style={{ display: "flex", gap: 32 }}>
          {NAV_ITEMS.map(({ label, id }) => (
            <button
              key={id}
              className="nav-link"
              onClick={() => scrollTo(id)}
              aria-current={active === id ? "true" : undefined}
              style={{
                background: "none", border: "none", cursor: "pointer",
                color: active === id ? "#c084fc" : "#64748b",
                fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase",
              }}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      {/* Mobile overlay */}
      {isMobile && menuOpen && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 105,
          background: "rgba(8,0,18,0.97)", backdropFilter: "blur(12px)",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 32,
        }}>
          {NAV_ITEMS.map(({ label, id }) => (
            <button
              key={id}
              className="nav-link"
              onClick={() => scrollTo(id)}
              aria-current={active === id ? "true" : undefined}
              style={{
                background: "none", border: "none", cursor: "pointer",
                color: active === id ? "#c084fc" : "#94a3b8",
                fontSize: 20, letterSpacing: "0.16em", textTransform: "uppercase",
                padding: "12px 24px",
              }}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </nav>
  )
}
