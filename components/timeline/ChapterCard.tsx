"use client"

import { useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { Chapter } from "@/lib/data/chapters"
import { useIsMobile } from "@/hooks/useMediaQuery"

interface Props { chapter: Chapter; isActive: boolean; onClick: () => void }

export default function ChapterCard({ chapter, isActive, onClick }: Props) {
  const { num, year, place, title, role, body, tags, hex } = chapter
  const isMobile = useIsMobile()
  const ref = useRef<HTMLDivElement>(null)

  const handleActivate = () => {
    onClick()
    // Scroll the card so its title sits just below the fixed nav (~88px) + 8px buffer.
    const el = ref.current
    if (!el) return
    const top = el.getBoundingClientRect().top + window.scrollY - 96
    window.scrollTo({ top, behavior: "smooth" })
  }

  return (
    <div
      ref={ref}
      className="card-interactive"
      onClick={handleActivate}
      role="button"
      tabIndex={0}
      aria-expanded={isActive}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleActivate() } }}
      style={{ display: "flex", gap: isMobile ? 16 : 24, cursor: "pointer", scrollMarginTop: 96 }}
    >
      {/* Dot */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0, width: isMobile ? 32 : 44 }}>
        <div style={{
          width: 10, height: 10, borderRadius: "50%", marginTop: 16, flexShrink: 0, transition: "all 0.4s ease",
          background: isActive ? hex : "#1e1040",
          border: `1.5px solid ${isActive ? hex : "#2d1b5e"}`,
          boxShadow: isActive ? `0 0 12px ${hex}88` : "none",
          transform: isActive ? "scale(1.2)" : "scale(1)",
        }} />
      </div>

      {/* Body */}
      <div style={{
        flex: 1, marginBottom: 16,
        background: isActive ? "rgba(255,255,255,0.03)" : "transparent",
        border: isActive ? `1px solid ${hex}30` : "1px solid transparent",
        borderLeft: isActive ? `2px solid ${hex}` : "2px solid transparent",
        borderRadius: "0 8px 8px 0",
        padding: isActive
          ? (isMobile ? "16px 16px" : "24px 24px")
          : (isMobile ? "12px 16px" : "16px 24px"),
        transition: "background 0.6s ease, border-color 0.6s ease, padding 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
      }}>
        <div style={{ display: "flex", alignItems: "baseline", flexWrap: "wrap", gap: "8px 16px", marginBottom: isActive ? 8 : 0, transition: "margin-bottom 0.6s cubic-bezier(0.16, 1, 0.3, 1)" }}>
          <span style={{ color: hex, fontSize: 12, fontWeight: 700, letterSpacing: "0.25em" }}>{num}</span>
          <span style={{ color: isActive ? "#e2e8f0" : "#64748b", fontSize: 16, fontWeight: isActive ? 500 : 400, transition: "color 0.3s ease, font-weight 0.3s ease" }}>{title}</span>
          <span style={{ color: "#64748b", fontSize: 12 }}>{year} · {place}</span>
        </div>

        <AnimatePresence initial={false}>
          {isActive && (
            <motion.div
              key="content"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{
                height: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
                opacity: { duration: 0.5, ease: "easeOut", delay: 0.15 },
              }}
              style={{ overflow: "hidden" }}
            >
              <motion.div
                initial={{ y: -14 }}
                animate={{ y: 0 }}
                exit={{ y: -14 }}
                transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              >
                <div style={{ color: hex, fontSize: 12, letterSpacing: "0.06em", marginBottom: 16, opacity: 0.85 }}>{role}</div>
                <p style={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.8, marginBottom: 16 }}>{body}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {tags.map((tag, i) => (
                    <motion.span
                      key={tag}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.3 + i * 0.07, ease: "easeOut" }}
                      style={{ color: hex, fontSize: 12, letterSpacing: "0.1em", padding: "4px 12px", border: `1px solid ${hex}30`, borderRadius: 20, background: `${hex}0d`, display: "inline-block" }}
                    >
                      {tag}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
