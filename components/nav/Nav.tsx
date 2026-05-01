"use client"

import { useState, useEffect, useCallback } from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence } from "framer-motion"
import { useIsMobile } from "@/hooks/useMediaQuery"

const NAV_ITEMS = [
  { label: "Home",    id: "hero"    },
  { label: "Journey", id: "story"   },
  { label: "Skills",  id: "skills"  },
  { label: "Contact", id: "contact" },
] as const

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? ""

export default function Nav() {
  const [active, setActive] = useState("hero")
  const [menuOpen, setMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const isMobile = useIsMobile()

  useEffect(() => { setMounted(true) }, [])

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

  // Lock body scroll when mobile menu open
  useEffect(() => {
    if (menuOpen) {
      const prev = document.body.style.overflow
      document.body.style.overflow = "hidden"
      return () => { document.body.style.overflow = prev }
    }
  }, [menuOpen])

  const scrollTo = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
    setMenuOpen(false)
  }, [])

  return (
    <>
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
          aria-label="develys·verse — home"
          style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center", zIndex: 9999 }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${BASE_PATH}/logo/muted/logo-compact.svg`}
            alt="develys·verse"
            style={{ height: 56, width: "auto", display: "block" }}
          />
        </button>

        {isMobile ? (
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            style={{ background: "none", border: "none", cursor: "pointer", padding: 8, display: "flex", flexDirection: "column", gap: 5, zIndex: 9999, position: "relative" }}
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
      </nav>

      {/* Mobile overlay — portaled to body so it escapes the nav's stacking context */}
      {mounted && isMobile && createPortal(
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              key="nav-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              style={{
                position: "fixed", inset: 0, zIndex: 9000,
                background: "rgba(8,0,18,0.97)", backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24,
              }}
            >
              {/* Close button (X) — sits inside the portal so it's above the overlay */}
              <button
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                style={{
                  position: "absolute", top: 16, right: 24, zIndex: 10,
                  background: "none", border: "none", cursor: "pointer",
                  padding: 8, width: 38, height: 38,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                <div style={{ position: "relative", width: 22, height: 22 }}>
                  <div style={{ position: "absolute", top: 10, left: 0, width: 22, height: 1.5, background: "#c084fc", transform: "rotate(45deg)" }} />
                  <div style={{ position: "absolute", top: 10, left: 0, width: 22, height: 1.5, background: "#c084fc", transform: "rotate(-45deg)" }} />
                </div>
              </button>
              {NAV_ITEMS.map(({ label, id }, i) => (
                <motion.button
                  key={id}
                  className="nav-link"
                  onClick={() => scrollTo(id)}
                  aria-current={active === id ? "true" : undefined}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 12 }}
                  transition={{ duration: 0.3, delay: 0.08 + i * 0.05, ease: "easeOut" }}
                  style={{
                    background: "none", border: "none", cursor: "pointer",
                    color: active === id ? "#c084fc" : "#94a3b8",
                    fontSize: 22, letterSpacing: "0.16em", textTransform: "uppercase",
                    padding: "16px 32px",
                  }}
                >
                  {label}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  )
}
