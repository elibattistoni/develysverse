"use client"

import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence } from "framer-motion"
import BackgroundStars from "@/components/ui/BackgroundStars"

interface Props {
  email: string
  open: boolean
  onClose: () => void
}

export default function EmailModal({ email, open, onClose }: Props) {
  const [mounted, setMounted] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  // Esc to close
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, onClose])

  // Body scroll lock while open
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => { document.body.style.overflow = prev }
  }, [open])

  // Reset copied state when modal closes
  useEffect(() => { if (!open) setCopied(false) }, [open])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // clipboard API can fail on insecure contexts or permission denials — fail silently
    }
  }

  if (!mounted) return null

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          key="email-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          onClick={onClose}
          style={{
            position: "fixed", inset: 0, zIndex: 9100,
            background: "rgba(8,0,18,0.82)", backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: 24,
          }}
        >
          {/* Soft starfield drifting across the dimmed page behind the modal */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              filter: "blur(0.8px)",
              zIndex: 0,
            }}
          >
            <BackgroundStars
              count={100}
              color={[255, 255, 255]}
              alphaRange={[0.35, 0.75]}
              radiusRange={[0.4, 1.4]}
            />
          </div>
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="email-modal-title"
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 4 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "relative",
              background: "#0a0016",
              border: "1px solid rgba(147,51,234,0.3)",
              borderRadius: 8,
              padding: "32px 28px",
              width: "100%", maxWidth: 420,
              boxShadow: "0 12px 60px rgba(255,255,255,0.20), 0 4px 16px rgba(0,0,0,0.6)",
              zIndex: 1,
            }}
          >
            {/* Close X */}
            <button
              onClick={onClose}
              aria-label="Close"
              style={{
                position: "absolute", top: 12, right: 12,
                background: "none", border: "none", cursor: "pointer",
                width: 32, height: 32,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              <div style={{ position: "relative", width: 14, height: 14 }}>
                <div style={{ position: "absolute", top: 6, left: 0, width: 14, height: 1.5, background: "#94a3b8", transform: "rotate(45deg)" }} />
                <div style={{ position: "absolute", top: 6, left: 0, width: 14, height: 1.5, background: "#94a3b8", transform: "rotate(-45deg)" }} />
              </div>
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <div style={{ width: 20, height: 1, background: "#7c3aed" }} />
              <span style={{ color: "#9333ea", fontSize: 11, letterSpacing: "0.28em", textTransform: "uppercase" }}>
                Email
              </span>
            </div>

            <h3 id="email-modal-title" style={{ fontSize: 24, fontWeight: 300, color: "#e2e8f0", lineHeight: 1.2, marginBottom: 8, fontFamily: "var(--font-cormorant), Georgia, serif" }}>
              How would you like to send it?
            </h3>

            <p style={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.6, marginBottom: 24, wordBreak: "break-all" }}>
              {email}
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <button
                onClick={handleCopy}
                className="btn-outline"
                style={{
                  background: "transparent", color: "#c084fc",
                  padding: "12px 18px",
                  border: "1px solid rgba(147,51,234,0.35)",
                  borderRadius: 4, fontSize: 12, letterSpacing: "0.1em",
                  textTransform: "uppercase", textAlign: "center", cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                Copy email
              </button>

              <button
                onClick={() => {
                  window.location.href = `mailto:${email}`
                  // Delay close so the mailto: navigation gets dispatched
                  // before the modal unmounts (some browsers cancel on race).
                  setTimeout(onClose, 150)
                }}
                className="btn-outline"
                style={{
                  background: "transparent", color: "#c084fc",
                  padding: "12px 18px",
                  border: "1px solid rgba(147,51,234,0.35)",
                  borderRadius: 4, fontSize: 12, letterSpacing: "0.1em",
                  textTransform: "uppercase", textAlign: "center", cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                Open in mail client →
              </button>
            </div>

            {/* Copy-success toast inside the modal */}
            <AnimatePresence>
              {copied && (
                <motion.div
                  key="email-copied-toast"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  style={{
                    position: "absolute", left: 0, right: 0, bottom: -44,
                    display: "flex", justifyContent: "center", pointerEvents: "none",
                  }}
                >
                  <div style={{
                    background: "rgba(10,0,22,0.95)",
                    border: "1px solid rgba(147,51,234,0.35)",
                    borderRadius: 6,
                    padding: "8px 16px",
                    color: "#c084fc",
                    fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase",
                  }}>
                    Copied ✓
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}
