"use client"

import type { Chapter } from "@/lib/data/chapters"

interface Props { chapter: Chapter; isActive: boolean; onClick: () => void }

export default function ChapterCard({ chapter, isActive, onClick }: Props) {
  const { num, year, place, title, role, body, tags, hex } = chapter
  return (
    <div onClick={onClick} style={{ display: "flex", gap: 24, cursor: "pointer" }}>
      {/* Dot */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0, width: 44 }}>
        <div style={{
          width: 10, height: 10, borderRadius: "50%", marginTop: 20, flexShrink: 0, transition: "all 0.25s",
          background: isActive ? hex : "#1e1040",
          border: `1.5px solid ${isActive ? hex : "#2d1b5e"}`,
          boxShadow: isActive ? `0 0 12px ${hex}88` : "none",
        }} />
      </div>

      {/* Body */}
      <div style={{
        flex: 1, marginBottom: 12,
        background: isActive ? "rgba(255,255,255,0.03)" : "transparent",
        border: isActive ? `1px solid ${hex}30` : "1px solid transparent",
        borderLeft: isActive ? `2px solid ${hex}` : "2px solid transparent",
        borderRadius: "0 10px 10px 0",
        padding: isActive ? "24px 28px" : "14px 28px",
        transition: "all 0.28s",
      }}>
        <div style={{ display: "flex", alignItems: "baseline", flexWrap: "wrap", gap: "6px 14px", marginBottom: isActive ? 10 : 0 }}>
          <span style={{ color: hex, fontSize: 9, fontWeight: 700, letterSpacing: "0.25em" }}>{num}</span>
          <span style={{ color: isActive ? "#f1f5f9" : "#64748b", fontSize: 15, fontWeight: isActive ? 500 : 400, transition: "color 0.2s" }}>{title}</span>
          <span style={{ color: "#1e293b", fontSize: 11 }}>{year} · {place}</span>
        </div>

        {isActive && (
          <>
            <div style={{ color: hex, fontSize: 11, letterSpacing: "0.06em", marginBottom: 12, opacity: 0.85 }}>{role}</div>
            <p style={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.8, marginBottom: 18 }}>{body}</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {tags.map((tag) => (
                <span key={tag} style={{ color: hex, fontSize: 10, letterSpacing: "0.1em", padding: "4px 10px", border: `1px solid ${hex}30`, borderRadius: 20, background: `${hex}0d` }}>
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
