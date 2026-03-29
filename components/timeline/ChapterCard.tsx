"use client"

import type { Chapter } from "@/lib/data/chapters"
import { useIsMobile } from "@/hooks/useMediaQuery"

interface Props { chapter: Chapter; isActive: boolean; onClick: () => void }

export default function ChapterCard({ chapter, isActive, onClick }: Props) {
  const { num, year, place, title, role, body, tags, hex } = chapter
  const isMobile = useIsMobile()

  return (
    <div
      className="card-interactive"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick() } }}
      style={{ display: "flex", gap: isMobile ? 16 : 24, cursor: "pointer" }}
    >
      {/* Dot */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0, width: isMobile ? 32 : 44 }}>
        <div style={{
          width: 10, height: 10, borderRadius: "50%", marginTop: 16, flexShrink: 0, transition: "all 0.25s",
          background: isActive ? hex : "#1e1040",
          border: `1.5px solid ${isActive ? hex : "#2d1b5e"}`,
          boxShadow: isActive ? `0 0 12px ${hex}88` : "none",
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
        transition: "all 0.28s",
      }}>
        <div style={{ display: "flex", alignItems: "baseline", flexWrap: "wrap", gap: "8px 16px", marginBottom: isActive ? 8 : 0 }}>
          <span style={{ color: hex, fontSize: 12, fontWeight: 700, letterSpacing: "0.25em" }}>{num}</span>
          <span style={{ color: isActive ? "#e2e8f0" : "#64748b", fontSize: 16, fontWeight: isActive ? 500 : 400, transition: "color 0.2s" }}>{title}</span>
          <span style={{ color: "#64748b", fontSize: 12 }}>{year} · {place}</span>
        </div>

        {isActive && (
          <>
            <div style={{ color: hex, fontSize: 12, letterSpacing: "0.06em", marginBottom: 16, opacity: 0.85 }}>{role}</div>
            <p style={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.8, marginBottom: 16 }}>{body}</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {tags.map((tag) => (
                <span key={tag} style={{ color: hex, fontSize: 12, letterSpacing: "0.1em", padding: "4px 12px", border: `1px solid ${hex}30`, borderRadius: 20, background: `${hex}0d` }}>
                  {tag}
                </span>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
